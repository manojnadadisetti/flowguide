"""
FlowGuide - User Model
Maps to the 'users' table (already created by Spring Boot's JPA)
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, String, Text, Integer
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(50), nullable=False, default="user")
    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    avatar_url = Column(Text, nullable=True)
    phone_number = Column(String(50), nullable=True)
    interests = Column(Text, nullable=True, default="")
    skill_level = Column(String(50), nullable=True, default="Beginner")
    streak_count = Column(Integer, nullable=False, default=0)
    last_activity_date = Column(DateTime, nullable=True)
    total_points = Column(Integer, nullable=False, default=0)
    daily_target_minutes = Column(Integer, nullable=False, default=30)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)