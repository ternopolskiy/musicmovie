from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db
from app.models.movie import Movie
from app.models.track import Track
from app.schemas.movie import MovieResponse
from app.schemas.track import TrackResponse

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    pattern = f"%{q}%"

    movies = (
        db.query(Movie)
        .filter(
            Movie.title.ilike(pattern)
            | Movie.director.ilike(pattern)
            | Movie.genres.ilike(pattern)
        )
        .limit(limit)
        .all()
    )

    tracks = (
        db.query(Track)
        .options(joinedload(Track.movie))
        .filter(
            Track.title.ilike(pattern)
            | Track.artist.ilike(pattern)
        )
        .limit(limit)
        .all()
    )

    movie_results = [MovieResponse.model_validate(m).model_dump() for m in movies]
    track_results = []
    for t in tracks:
        td = TrackResponse.model_validate(t).model_dump()
        td["movie_title"] = t.movie.title if t.movie else None
        track_results.append(td)

    return {
        "movies": movie_results,
        "tracks": track_results,
    }
