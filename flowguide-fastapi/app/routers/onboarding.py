"""
FlowGuide - Onboarding Router
Steps, progress tracking, completion flow, and AI-style guidance
"""

from datetime import datetime

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.audit import AuditLog
from app.models.onboarding import OnboardingStep, UserProgress
from app.models.user import User
from app.schemas.onboarding import (
    GuidanceRequest,
    GuidanceResponse,
    OnboardingSummary,
    OnboardingStepOut,
    ProgressOut,
    ProgressUpdateRequest,
    StepWithProgress,
)

router = APIRouter(prefix="/api/onboarding", tags=["Onboarding"])


# ---- GET all onboarding steps (public-ish, but requires auth) ----
@router.get("/steps", response_model=list[OnboardingStepOut])
def list_steps(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    steps = db.query(OnboardingStep).order_by(OnboardingStep.step_order.asc()).all()
    return steps


# ---- GET full onboarding summary for current user (steps + progress) ----
@router.get("/summary", response_model=OnboardingSummary)
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    steps = db.query(OnboardingStep).order_by(OnboardingStep.step_order.asc()).all()

    progress_map = {
        p.step_id: p
        for p in db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    }

    items = []
    completed_count = 0
    for step in steps:
        progress = progress_map.get(step.id)
        if progress and progress.status == "completed":
            completed_count += 1
        items.append(StepWithProgress(step=step, progress=progress))

    total = len(steps)
    percent = round((completed_count / total) * 100, 2) if total > 0 else 0.0

    return OnboardingSummary(
        total_steps=total,
        completed_steps=completed_count,
        percent_complete=percent,
        steps=items,
    )


# ---- PATCH update progress for a specific step ----
@router.patch("/steps/{step_id}/progress", response_model=ProgressOut)
def update_progress(
    step_id: str,
    payload: ProgressUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    valid_statuses = {"pending", "in_progress", "completed", "skipped"}
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"status must be one of {valid_statuses}")

    step = db.query(OnboardingStep).filter(OnboardingStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Onboarding step not found")

    progress = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == current_user.id, UserProgress.step_id == step_id)
        .first()
    )

    if not progress:
        progress = UserProgress(user_id=current_user.id, step_id=step_id, status="pending")
        db.add(progress)

    now = datetime.utcnow()
    progress.status = payload.status
    if payload.notes is not None:
        progress.notes = payload.notes

    if payload.status == "in_progress" and progress.started_at is None:
        progress.started_at = now
    elif payload.status == "completed":
        progress.completed_at = now
    elif payload.status == "skipped":
        progress.skipped_at = now

    db.commit()
    db.refresh(progress)

    db.add(AuditLog(
        user_id=current_user.id,
        action=f"STEP_{payload.status.upper()}",
        entity_type="onboarding_step",
        entity_id=step.id,
    ))
    db.commit()

    # ---- Completion flow management ----
    if payload.status == "completed":
        total_steps = db.query(OnboardingStep).count()
        completed_steps = (
            db.query(UserProgress)
            .filter(UserProgress.user_id == current_user.id, UserProgress.status == "completed")
            .count()
        )

        # Notify via Spring Boot: step completed email
        try:
            httpx.post(
                f"{settings.SPRING_NOTIFICATION_URL}/step-completed",
                json={
                    "email": current_user.email,
                    "fullName": current_user.full_name,
                    "stepTitle": step.title,
                    "completedCount": completed_steps,
                    "totalCount": total_steps,
                },
                timeout=3.0,
            )
        except Exception:
            pass

        # If ALL steps completed -> send onboarding-complete email
        if completed_steps == total_steps:
            try:
                httpx.post(
                    f"{settings.SPRING_NOTIFICATION_URL}/onboarding-complete",
                    json={"email": current_user.email, "fullName": current_user.full_name},
                    timeout=3.0,
                )
            except Exception:
                pass

            db.add(AuditLog(user_id=current_user.id, action="ONBOARDING_COMPLETED", entity_type="user", entity_id=current_user.id))
            db.commit()

    return progress


# ---- POST AI-powered contextual guidance ----
@router.post("/guidance", response_model=GuidanceResponse)
def get_guidance(
    payload: GuidanceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Simple rule-based 'intelligent guidance' engine.
    Matches user query keywords to onboarding steps and gives contextual help.
    """
    query_lower = payload.query.lower()
    steps = db.query(OnboardingStep).order_by(OnboardingStep.step_order.asc()).all()

    # Keyword -> step matching
    keyword_map = {
        "profile": ["profile", "name", "avatar", "photo", "picture"],
        "email": ["email", "verify", "verification", "confirm"],
        "dashboard": ["dashboard", "explore", "tour", "overview"],
        "notification": ["notification", "alert", "email settings"],
        "team": ["team", "invite", "collaborate", "member"],
        "integration": ["integration", "connect", "slack", "jira", "google"],
        "welcome": ["welcome", "start", "getting started", "begin"],
        "complete": ["complete", "finish", "done"],
    }

    matched_step = None
    for step in steps:
        title_lower = step.title.lower()
        category_lower = step.category.lower()
        for category_key, keywords in keyword_map.items():
            if any(kw in query_lower for kw in keywords):
                if category_key in title_lower or category_key in category_lower or any(kw in title_lower for kw in keywords):
                    matched_step = step
                    break
        if matched_step:
            break

    # Get current progress for personalised answer
    progress_map = {
        p.step_id: p
        for p in db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    }

    if matched_step:
        progress = progress_map.get(matched_step.id)
        status_text = progress.status if progress else "pending"

        if status_text == "completed":
            answer = (
                f"You've already completed '{matched_step.title}'. "
                f"{matched_step.help_text or ''} Need help with something else?"
            )
        else:
            answer = (
                f"For '{matched_step.title}': {matched_step.description} "
                f"{matched_step.help_text or ''}"
            )

        return GuidanceResponse(
            answer=answer,
            suggested_step_id=matched_step.id,
            suggested_step_title=matched_step.title,
        )

    # ---- Fallback: suggest next incomplete step ----
    for step in steps:
        progress = progress_map.get(step.id)
        if not progress or progress.status not in ("completed", "skipped"):
            return GuidanceResponse(
                answer=(
                    f"I couldn't find an exact match, but your next step is "
                    f"'{step.title}': {step.description}"
                ),
                suggested_step_id=step.id,
                suggested_step_title=step.title,
            )

    return GuidanceResponse(
        answer="You've completed all onboarding steps! Let me know if you have other questions.",
        suggested_step_id=None,
        suggested_step_title=None,
    )