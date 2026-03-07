from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MovieCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    poster_url: Optional[str] = None
    year: Optional[int] = None
    director: Optional[str] = None
    genres: Optional[str] = None
    description: Optional[str] = None
    trailer_query: Optional[str] = None
    watch_query: Optional[str] = None


class MovieUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    poster_url: Optional[str] = None
    year: Optional[int] = None
    director: Optional[str] = None
    genres: Optional[str] = None
    description: Optional[str] = None
    trailer_query: Optional[str] = None
    watch_query: Optional[str] = None


class MovieResponse(BaseModel):
    id: int
    title: str
    poster_url: Optional[str] = None
    year: Optional[int] = None
    director: Optional[str] = None
    genres: Optional[str] = None
    description: Optional[str] = None
    trailer_query: Optional[str] = None
    watch_query: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
