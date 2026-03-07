from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FavoriteToggle(BaseModel):
    item_type: str = Field(..., pattern="^(movie|track)$")
    item_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    item_type: str
    item_id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
