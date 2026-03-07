from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.comment import Comment
from app.models.forum import ForumComment, ForumPost
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def list_users(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    users = db.query(User).all()
    return {
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "created_at": u.created_at,
            }
            for u in users
        ]
    }


@router.get("/moderation/comments")
def list_all_comments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    comments = db.query(Comment).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(Comment).count()
    return {
        "items": [
            {
                "id": c.id,
                "user_id": c.user_id,
                "item_type": c.item_type,
                "item_id": c.item_id,
                "text": c.text,
                "created_at": c.created_at,
            }
            for c in comments
        ],
        "total": total,
    }


@router.delete("/moderation/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment_admin(
    comment_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()


@router.get("/moderation/forum/posts")
def list_all_forum_posts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    posts = db.query(ForumPost).order_by(ForumPost.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(ForumPost).count()
    return {
        "items": [
            {
                "id": p.id,
                "user_id": p.user_id,
                "title": p.title,
                "content": p.content,
                "rating": p.rating,
                "created_at": p.created_at,
            }
            for p in posts
        ],
        "total": total,
    }


@router.delete("/moderation/forum/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_forum_post_admin(
    post_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()


@router.get("/moderation/forum/comments")
def list_all_forum_comments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    comments = db.query(ForumComment).order_by(ForumComment.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(ForumComment).count()
    return {
        "items": [
            {
                "id": c.id,
                "post_id": c.post_id,
                "user_id": c.user_id,
                "text": c.text,
                "created_at": c.created_at,
            }
            for c in comments
        ],
        "total": total,
    }


@router.delete("/moderation/forum/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_forum_comment_admin(
    comment_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Forum comment not found")
    db.delete(comment)
    db.commit()
