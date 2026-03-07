from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    cover_url = Column(String(500), nullable=True)
    artist = Column(String(150), nullable=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="SET NULL"), nullable=True)
    spotify_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    movie = relationship("Movie", back_populates="tracks")

    @property
    def movie_title(self) -> str | None:
        return self.movie.title if self.movie else None
