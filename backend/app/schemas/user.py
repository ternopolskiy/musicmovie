from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UserBrief(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
