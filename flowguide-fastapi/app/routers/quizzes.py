import json
from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.learning import Course, Quiz, QuizAttempt, Enrollment

router = APIRouter(prefix="/api/quizzes", tags=["Quizzes"])

# --- Pydantic Schemas ---
class QuestionSchema(BaseModel):
    question: str
    options: List[str]
    answer_idx: int

class QuizCreateRequest(BaseModel):
    course_id: UUID
    title: str
    questions: List[QuestionSchema]

class QuizOut(BaseModel):
    id: UUID
    course_id: UUID
    title: str
    questions_json: str
    
    class Config:
        from_attributes = True

class QuizSubmitRequest(BaseModel):
    answers: List[int] # List of chosen answer indices

class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    points_earned: int
    streak_updated: int
    passed: bool


# --- Endpoints ---
@router.get("/course/{course_id}", response_model=List[QuizOut])
def get_course_quizzes(course_id: UUID, db: Session = Depends(get_db)):
    return db.query(Quiz).filter(Quiz.course_id == course_id).all()


@router.post("", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(
    payload: QuizCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permissions required")
        
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    quiz = Quiz(
        course_id=payload.course_id,
        title=payload.title,
        questions_json=json.dumps([q.dict() for q in payload.questions])
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


@router.post("/{quiz_id}/submit", response_model=QuizSubmitResponse)
def submit_quiz(
    quiz_id: UUID,
    payload: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    questions = json.loads(quiz.questions_json)
    if len(payload.answers) != len(questions):
        raise HTTPException(
            status_code=400,
            detail=f"Answer list size mismatch. Expected {len(questions)}, got {len(payload.answers)}"
        )
        
    # Evaluate score
    score = 0
    for idx, question in enumerate(questions):
        correct_idx = int(question["answer_idx"])
        user_idx = payload.answers[idx]
        if user_idx == correct_idx:
            score += 1
            
    total = len(questions)
    passed = score >= (total / 2) # Pass if 50% or more correct
    
    # Reward points (e.g. 50 points flat + 10 points per correct answer)
    points_earned = 50 + (score * 10) if passed else 10
    current_user.total_points += points_earned
    
    # Update daily study streak
    streak_updated = current_user.streak_count
    today = datetime.now(timezone.utc).date()
    if current_user.last_activity_date:
        last_active = current_user.last_activity_date.date()
        if today == last_active + timedelta(days=1):
            current_user.streak_count += 1
            streak_updated = current_user.streak_count
        elif today > last_active:
            current_user.streak_count = 1
            streak_updated = 1
    else:
        current_user.streak_count = 1
        streak_updated = 1
        
    current_user.last_activity_date = datetime.now(timezone.utc)
    
    # Update course enrollment progress
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == quiz.course_id
    ).first()
    
    if enrollment:
        # Increase progress by 25% up to 100%
        new_progress = min(enrollment.progress + 25, 100)
        enrollment.progress = new_progress
        if new_progress == 100:
            enrollment.status = "completed"
            
    # Record quiz attempt
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=score,
        total=total
    )
    db.add(attempt)
    db.commit()
    
    return QuizSubmitResponse(
        score=score,
        total=total,
        points_earned=points_earned,
        streak_updated=streak_updated,
        passed=passed
    )
