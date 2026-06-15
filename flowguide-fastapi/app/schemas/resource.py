from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class QuizQuestionBase(BaseModel):
    course: str = Field(min_length=2, max_length=50)
    question: str
    options_raw: str
    correct_index: int = Field(ge=0, le=3)

class QuizQuestionCreate(QuizQuestionBase):
    pass

class QuizQuestionUpdate(BaseModel):
    course: Optional[str] = Field(default=None, min_length=2, max_length=50)
    question: Optional[str] = None
    options_raw: Optional[str] = None
    correct_index: Optional[int] = Field(default=None, ge=0, le=3)

class QuizQuestionOut(QuizQuestionBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class StudyMaterialBase(BaseModel):
    course: str = Field(min_length=2, max_length=50)
    title: str = Field(min_length=2, max_length=255)
    description: str
    read_time: str = Field(min_length=2, max_length=50)
    content: str

class StudyMaterialCreate(StudyMaterialBase):
    pass

class StudyMaterialUpdate(BaseModel):
    course: Optional[str] = Field(default=None, min_length=2, max_length=50)
    title: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = None
    read_time: Optional[str] = Field(default=None, min_length=2, max_length=50)
    content: Optional[str] = None

class StudyMaterialOut(StudyMaterialBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class VideoTutorialBase(BaseModel):
    course: str = Field(min_length=2, max_length=50)
    title: str = Field(min_length=2, max_length=255)
    description: str
    duration: str = Field(min_length=2, max_length=50)
    embed_url: str
    watch_url: str
    color: str = Field(min_length=2, max_length=100)

class VideoTutorialCreate(VideoTutorialBase):
    pass

class VideoTutorialUpdate(BaseModel):
    course: Optional[str] = Field(default=None, min_length=2, max_length=50)
    title: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = None
    duration: Optional[str] = Field(default=None, min_length=2, max_length=50)
    embed_url: Optional[str] = None
    watch_url: Optional[str] = None
    color: Optional[str] = Field(default=None, min_length=2, max_length=100)

class VideoTutorialOut(VideoTutorialBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
