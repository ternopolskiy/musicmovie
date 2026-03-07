from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.movie import Movie
from app.schemas.movie import MovieCreate, MovieResponse, MovieUpdate

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("", response_model=dict)
def list_movies(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Movie)
    if search:
        pattern = f"%{search}%"
        q = q.filter(Movie.title.ilike(pattern) | Movie.director.ilike(pattern))
    total = q.count()
    movies = q.order_by(Movie.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "items": [MovieResponse.model_validate(m).model_dump() for m in movies],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{movie_id}")
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    from app.schemas.track import TrackResponse
    from sqlalchemy.orm import joinedload
    from app.models.track import Track

    tracks = db.query(Track).filter(Track.movie_id == movie_id).all()
    track_list = []
    for t in tracks:
        td = TrackResponse.model_validate(t).model_dump()
        td["movie_title"] = movie.title
        track_list.append(td)

    data = MovieResponse.model_validate(movie).model_dump()
    data["tracks"] = track_list
    return data


@router.post("", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
def create_movie(body: MovieCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    movie = Movie(**body.model_dump())
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


@router.put("/{movie_id}", response_model=MovieResponse)
def update_movie(movie_id: int, body: MovieUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(movie, key, value)
    db.commit()
    db.refresh(movie)
    return movie


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(movie_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    db.delete(movie)
    db.commit()
