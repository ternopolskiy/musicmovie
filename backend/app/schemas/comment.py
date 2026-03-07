from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserBrief


class CommentCreate(BaseModel):
    item_type: str = Field(..., pattern="^(movie|track)$")
    item_id: int
    text: str = Field(..., min_length=1, max_length=2000)


class CommentResponse(BaseModel):
    id: int
    user_id: int
    item_type: str
    item_id: int
    text: str
    created_at: Optional[datetime] = None
    author: Optional[UserBrief] = None

    model_config = ConfigDict(from_attributes=True)
