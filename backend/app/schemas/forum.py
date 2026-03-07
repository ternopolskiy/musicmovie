from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserBrief


class ForumPostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    content: str = Field(..., min_length=1)


class ForumPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    content: Optional[str] = Field(None, min_length=1)


class ForumCommentCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class ForumCommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    text: str
    created_at: Optional[datetime] = None
    author: Optional[UserBrief] = None

    model_config = ConfigDict(from_attributes=True)


class ForumPostResponse(BaseModel):
    id: int
    title: str
    content: str
    rating: int = 0
    author: Optional[UserBrief] = None
    comments_count: int = 0
    user_vote: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ForumPostDetail(ForumPostResponse):
    comments: list[ForumCommentResponse] = []


class VoteRequest(BaseModel):
    value: int = Field(..., ge=-1, le=1)
