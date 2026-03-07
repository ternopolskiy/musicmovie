from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.movie import Movie
from app.models.track import Track
from app.models.user import User

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("")
def get_stats(db: Session = Depends(get_db)):
    return {
        "movies": db.query(Movie).count(),
        "tracks": db.query(Track).count(),
        "users": db.query(User).count(),
    }
