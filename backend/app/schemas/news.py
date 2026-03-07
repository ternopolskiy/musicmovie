from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class NewsCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[datetime] = None
    source_url: Optional[str] = None


class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[datetime] = None
    source_url: Optional[str] = None


class NewsResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[datetime] = None
    source_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
