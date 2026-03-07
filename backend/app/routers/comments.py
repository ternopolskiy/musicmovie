from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.comment import Comment
from app.models.movie import Movie
from app.models.track import Track
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse
from app.schemas.user import UserBrief

router = APIRouter(prefix="/comments", tags=["Comments"])


def _enrich_comment(c: Comment, db: Session) -> dict:
    d = CommentResponse.model_validate(c).model_dump()
    author = db.query(User).filter(User.id == c.user_id).first()
    d["author"] = UserBrief.model_validate(author).model_dump() if author else None
    return d


@router.get("/{item_type}/{item_id}", response_model=dict)
def list_comments(
    item_type: str,
    item_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    if item_type not in ("movie", "track"):
        raise HTTPException(status_code=400, detail="item_type must be 'movie' or 'track'")

    q = db.query(Comment).filter(Comment.item_type == item_type, Comment.item_id == item_id)
    total = q.count()
    comments = q.order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "items": [_enrich_comment(c, db) for c in comments],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_comment(
    body: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.item_type == "movie":
        if not db.query(Movie).filter(Movie.id == body.item_id).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    elif body.item_type == "track":
        if not db.query(Track).filter(Track.id == body.item_id).first():
            raise HTTPException(status_code=404, detail="Track not found")

    comment = Comment(user_id=current_user.id, **body.model_dump())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _enrich_comment(comment, db)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(comment)
    db.commit()
