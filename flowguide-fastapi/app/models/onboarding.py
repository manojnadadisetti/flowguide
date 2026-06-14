"""
FlowGuide - Onboarding Models
Maps to 'onboarding_steps' and 'user_progress' tables
(already created by Spring Boot's JPA, seeded with 8 default steps)
"""

import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class OnboardingStep(Base):
    __tablename__ = "onboarding_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    step_order = Column(Integer, unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    is_required = Column(Boolean, nullable=False, default=True)
    icon = Column(String(100), nullable=True)
    help_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    progress_records = relationship("UserProgress", back_populates="step")


class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = (UniqueConstraint("user_id", "step_id", name="uq_user_step"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    step_id = Column(UUID(as_uuid=True), ForeignKey("onboarding_steps.id"), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    skipped_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    step = relationship("OnboardingStep", back_populates="progress_records")
    user = relationship("User")