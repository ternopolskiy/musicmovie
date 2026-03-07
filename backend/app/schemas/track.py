from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TrackCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    cover_url: Optional[str] = None
    artist: Optional[str] = None
    movie_id: Optional[int] = None
    spotify_url: Optional[str] = None


class TrackUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    cover_url: Optional[str] = None
    artist: Optional[str] = None
    movie_id: Optional[int] = None
    spotify_url: Optional[str] = None


class TrackResponse(BaseModel):
    id: int
    title: str
    cover_url: Optional[str] = None
    artist: Optional[str] = None
    movie_id: Optional[int] = None
    movie_title: Optional[str] = None
    spotify_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
