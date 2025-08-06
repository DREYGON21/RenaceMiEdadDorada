from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class ActivityBase(BaseModel):
    week: int = Field(..., ge=1, le=5, description="Week number (1-5)")
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=1000)
    images: List[str] = Field(default_factory=list, description="List of image URLs")
    is_active: bool = Field(default=True)

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    week: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=1000)
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None

class Activity(ActivityBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True