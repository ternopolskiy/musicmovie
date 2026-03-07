from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db, require_admin
from app.models.movie import Movie
from app.models.track import Track
from app.schemas.track import TrackCreate, TrackResponse, TrackUpdate

router = APIRouter(prefix="/tracks", tags=["Tracks"])


def _serialize_track(t: Track) -> dict:
    d = TrackResponse.model_validate(t).model_dump()
    d["movie_title"] = t.movie.title if t.movie else None
    return d


@router.get("", response_model=dict)
def list_tracks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    movie_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Track).options(joinedload(Track.movie))
    if search:
        pattern = f"%{search}%"
        q = q.filter(Track.title.ilike(pattern) | Track.artist.ilike(pattern))
    if movie_id is not None:
        q = q.filter(Track.movie_id == movie_id)
    total = q.count()
    tracks = q.order_by(Track.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "items": [_serialize_track(t) for t in tracks],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{track_id}")
def get_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(Track).options(joinedload(Track.movie)).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return _serialize_track(track)


@router.post("", response_model=TrackResponse, status_code=status.HTTP_201_CREATED)
def create_track(body: TrackCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if body.movie_id:
        if not db.query(Movie).filter(Movie.id == body.movie_id).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    track = Track(**body.model_dump())
    db.add(track)
    db.commit()
    db.refresh(track)
    return track


@router.put("/{track_id}", response_model=TrackResponse)
def update_track(track_id: int, body: TrackUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    update_data = body.model_dump(exclude_unset=True)
    if "movie_id" in update_data and update_data["movie_id"] is not None:
        if not db.query(Movie).filter(Movie.id == update_data["movie_id"]).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    for key, value in update_data.items():
        setattr(track, key, value)
    db.commit()
    db.refresh(track)
    return track


@router.delete("/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_track(track_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    db.delete(track)
    db.commit()
