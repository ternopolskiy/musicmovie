from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func as sa_func
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_current_user_optional, get_db
from app.models.forum import ForumComment, ForumPost, ForumVote
from app.models.user import User
from app.schemas.forum import (
    ForumCommentCreate,
    ForumCommentResponse,
    ForumPostCreate,
    ForumPostDetail,
    ForumPostResponse,
    ForumPostUpdate,
    VoteRequest,
)
from app.schemas.user import UserBrief

router = APIRouter(prefix="/forum", tags=["Forum"])


def _post_to_dict(
    post: ForumPost,
    comments_count: int,
    user_vote: Optional[int],
    db: Session,
) -> dict:
    author = db.query(User).filter(User.id == post.user_id).first()
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "rating": post.rating,
        "author": UserBrief.model_validate(author).model_dump() if author else None,
        "comments_count": comments_count,
        "user_vote": user_vote,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def _comment_to_dict(c: ForumComment, db: Session) -> dict:
    author = db.query(User).filter(User.id == c.user_id).first()
    return {
        "id": c.id,
        "post_id": c.post_id,
        "user_id": c.user_id,
        "text": c.text,
        "created_at": c.created_at,
        "author": UserBrief.model_validate(author).model_dump() if author else None,
    }


@router.get("/posts", response_model=dict)
def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("new", pattern="^(new|top|old)$"),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    q = db.query(ForumPost)

    if search:
        pattern = f"%{search}%"
        q = q.filter(ForumPost.title.ilike(pattern) | ForumPost.content.ilike(pattern))

    if sort == "new":
        q = q.order_by(ForumPost.created_at.desc())
    elif sort == "top":
        q = q.order_by(ForumPost.rating.desc(), ForumPost.created_at.desc())
    else:
        q = q.order_by(ForumPost.created_at.asc())

    total = q.count()
    posts = q.offset(skip).limit(limit).all()

    post_ids = [p.id for p in posts]

    cc_rows = (
        db.query(ForumComment.post_id, sa_func.count(ForumComment.id))
        .filter(ForumComment.post_id.in_(post_ids))
        .group_by(ForumComment.post_id)
        .all()
    )
    cc_map: dict[int, int] = dict(cc_rows)

    uv_map: dict[int, int] = {}
    if current_user:
        vote_rows = (
            db.query(ForumVote)
            .filter(ForumVote.post_id.in_(post_ids), ForumVote.user_id == current_user.id)
            .all()
        )
        uv_map = {v.post_id: v.value for v in vote_rows}

    items = [
        _post_to_dict(p, cc_map.get(p.id, 0), uv_map.get(p.id), db)
        for p in posts
    ]
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/posts/{post_id}")
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = (
        db.query(ForumComment)
        .filter(ForumComment.post_id == post_id)
        .order_by(ForumComment.created_at.asc())
        .all()
    )
    comments_count = len(comments)

    user_vote = None
    if current_user:
        vote = (
            db.query(ForumVote)
            .filter(ForumVote.post_id == post_id, ForumVote.user_id == current_user.id)
            .first()
        )
        user_vote = vote.value if vote else None

    data = _post_to_dict(post, comments_count, user_vote, db)
    data["comments"] = [_comment_to_dict(c, db) for c in comments]
    return data


@router.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(
    body: ForumPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = ForumPost(user_id=current_user.id, title=body.title, content=body.content)
    db.add(post)
    db.commit()
    db.refresh(post)
    return _post_to_dict(post, 0, None, db)


@router.put("/posts/{post_id}")
def update_post(
    post_id: int,
    body: ForumPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(post, key, value)
    post.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(post)

    cc = db.query(ForumComment).filter(ForumComment.post_id == post_id).count()
    uv = db.query(ForumVote).filter(ForumVote.post_id == post_id, ForumVote.user_id == current_user.id).first()
    return _post_to_dict(post, cc, uv.value if uv else None, db)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(post)
    db.commit()


@router.post("/posts/{post_id}/vote")
def vote_post(
    post_id: int,
    body: VoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.value not in (1, -1):
        raise HTTPException(status_code=400, detail="Vote value must be 1 or -1")

    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = (
        db.query(ForumVote)
        .filter(ForumVote.user_id == current_user.id, ForumVote.post_id == post_id)
        .first()
    )

    result_vote: Optional[int] = None

    if existing:
        if existing.value == body.value:
            post.rating -= existing.value
            db.delete(existing)
            result_vote = None
        else:
            post.rating -= existing.value
            existing.value = body.value
            post.rating += body.value
            result_vote = body.value
    else:
        new_vote = ForumVote(user_id=current_user.id, post_id=post_id, value=body.value)
        db.add(new_vote)
        post.rating += body.value
        result_vote = body.value

    db.commit()
    db.refresh(post)
    return {"rating": post.rating, "user_vote": result_vote}


@router.get("/posts/{post_id}/comments")
def list_post_comments(
    post_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    if not db.query(ForumPost).filter(ForumPost.id == post_id).first():
        raise HTTPException(status_code=404, detail="Post not found")

    q = db.query(ForumComment).filter(ForumComment.post_id == post_id)
    total = q.count()
    comments = q.order_by(ForumComment.created_at.asc()).offset(skip).limit(limit).all()
    return {
        "items": [_comment_to_dict(c, db) for c in comments],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.post("/posts/{post_id}/comments", status_code=status.HTTP_201_CREATED)
def create_post_comment(
    post_id: int,
    body: ForumCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(ForumPost).filter(ForumPost.id == post_id).first():
        raise HTTPException(status_code=404, detail="Post not found")

    comment = ForumComment(post_id=post_id, user_id=current_user.id, text=body.text)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _comment_to_dict(comment, db)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_forum_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(comment)
    db.commit()
