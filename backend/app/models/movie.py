from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    poster_url = Column(String(500), nullable=True)
    year = Column(Integer, nullable=True)
    director = Column(String(150), nullable=True)
    genres = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    trailer_query = Column(String(300), nullable=True)
    watch_query = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    tracks = relationship("Track", back_populates="movie", cascade="all, delete-orphan")
