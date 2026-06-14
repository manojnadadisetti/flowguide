"""
FlowGuide - Onboarding Schemas
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# ---- Onboarding Step ----
class OnboardingStepOut(BaseModel):
    id: UUID
    step_order: int
    title: str
    description: str
    category: str
    is_required: bool
    icon: Optional[str] = None
    help_text: Optional[str] = None

    class Config:
        from_attributes = True


# ---- User Progress ----
class ProgressUpdateRequest(BaseModel):
    status: str  # pending | in_progress | completed | skipped
    notes: Optional[str] = None


class ProgressOut(BaseModel):
    id: UUID
    step_id: UUID
    status: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    skipped_at: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


# ---- Combined step + progress (for the onboarding UI) ----
class StepWithProgress(BaseModel):
    step: OnboardingStepOut
    progress: Optional[ProgressOut] = None


class OnboardingSummary(BaseModel):
    total_steps: int
    completed_steps: int
    percent_complete: float
    steps: list[StepWithProgress]


# ---- AI Guidance ----
class GuidanceRequest(BaseModel):
    query: str


class GuidanceResponse(BaseModel):
    answer: str
    suggested_step_id: Optional[UUID] = None
    suggested_step_title: Optional[str] = None