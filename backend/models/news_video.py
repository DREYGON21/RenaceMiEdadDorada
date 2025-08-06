from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class NewsVideoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    video_id: str = Field(..., min_length=1, description="YouTube video ID")
    thumbnail: str = Field(..., description="YouTube thumbnail URL")
    week: str = Field(..., description="Week format: YYYY-WNN")
    is_active: bool = Field(default=True)

class NewsVideoCreate(NewsVideoBase):
    pass

class NewsVideoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    video_id: Optional[str] = None
    thumbnail: Optional[str] = None
    week: Optional[str] = None
    is_active: Optional[bool] = None

class NewsVideo(NewsVideoBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True