from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.favorite import Favorite
from app.models.movie import Movie
from app.models.track import Track
from app.models.user import User
from app.schemas.favorite import FavoriteResponse, FavoriteToggle

router = APIRouter(prefix="/favorites", tags=["Favorites"])


def _validate_item_exists(db: Session, item_type: str, item_id: int):
    if item_type == "movie":
        if not db.query(Movie).filter(Movie.id == item_id).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    elif item_type == "track":
        if not db.query(Track).filter(Track.id == item_id).first():
            raise HTTPException(status_code=404, detail="Track not found")


@router.get("", response_model=dict)
def list_favorites(
    item_type: Optional[str] = Query(None, pattern="^(movie|track)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Favorite).filter(Favorite.user_id == current_user.id)
    if item_type:
        q = q.filter(Favorite.item_type == item_type)
    total = q.count()
    favs = q.order_by(Favorite.created_at.desc()).offset(skip).limit(limit).all()

    items = []
    for f in favs:
        fd = FavoriteResponse.model_validate(f).model_dump()
        if f.item_type == "movie":
            movie = db.query(Movie).filter(Movie.id == f.item_id).first()
            fd["item_title"] = movie.title if movie else None
            fd["item_poster"] = movie.poster_url if movie else None
        else:
            track = db.query(Track).filter(Track.id == f.item_id).first()
            fd["item_title"] = track.title if track else None
            fd["item_poster"] = track.cover_url if track else None
        items.append(fd)

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/toggle")
def toggle_favorite(
    body: FavoriteToggle,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _validate_item_exists(db, body.item_type, body.item_id)
    existing = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.item_type == body.item_type,
            Favorite.item_id == body.item_id,
        )
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed", "is_favorite": False}

    fav = Favorite(user_id=current_user.id, item_type=body.item_type, item_id=body.item_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return {"status": "added", "is_favorite": True, "id": fav.id}


@router.get("/check")
def check_favorite(
    item_type: str = Query(..., pattern="^(movie|track)$"),
    item_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exists = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.item_type == item_type,
            Favorite.item_id == item_id,
        )
        .first()
    )
    return {"is_favorite": exists is not None}


@router.get("/ids")
def get_favorite_ids(
    item_type: str = Query(..., pattern="^(movie|track)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ids = (
        db.query(Favorite.item_id)
        .filter(Favorite.user_id == current_user.id, Favorite.item_type == item_type)
        .all()
    )
    return {"ids": [row[0] for row in ids]}
