import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course = Column(String(50), nullable=False, index=True)
    question = Column(Text, nullable=False)
    options_raw = Column(Text, nullable=False)  # pipe-separated string
    correct_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    read_time = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class VideoTutorial(Base):
    __tablename__ = "video_tutorials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    duration = Column(String(50), nullable=False)
    embed_url = Column(Text, nullable=False)
    watch_url = Column(Text, nullable=False)
    color = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
