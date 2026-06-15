from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.learning import Course, Assignment, AssignmentSubmission, Enrollment

router = APIRouter(prefix="/api/assignments", tags=["Assignments"])

# --- Pydantic Schemas ---
class AssignmentCreateRequest(BaseModel):
    course_id: UUID
    title: str
    description: str
    due_date: datetime

class AssignmentOut(BaseModel):
    id: UUID
    course_id: UUID
    title: str
    description: str
    due_date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class SubmissionSubmitRequest(BaseModel):
    submission_text: str

class GradeRequest(BaseModel):
    grade: str
    feedback: str

# Detailed outputs for admin
class UserSimpleOut(BaseModel):
    full_name: str
    email: str
    phone_number: Optional[str] = None
    
    class Config:
        from_attributes = True

class AssignmentSimpleOut(BaseModel):
    title: str
    course_id: UUID
    
    class Config:
        from_attributes = True

class SubmissionOut(BaseModel):
    id: UUID
    assignment_id: UUID
    user_id: UUID
    submission_text: str
    status: str
    grade: Optional[str] = None
    feedback: Optional[str] = None
    submitted_at: datetime
    user: UserSimpleOut
    assignment: AssignmentSimpleOut
    
    class Config:
        from_attributes = True


# --- Endpoints ---
@router.get("/course/{course_id}", response_model=List[AssignmentOut])
def get_course_assignments(course_id: UUID, db: Session = Depends(get_db)):
    return db.query(Assignment).filter(Assignment.course_id == course_id).all()


@router.post("", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
def create_assignment(
    payload: AssignmentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permissions required")
        
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    assignment = Assignment(
        course_id=payload.course_id,
        title=payload.title,
        description=payload.description,
        due_date=payload.due_date
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.post("/{assignment_id}/submit", status_code=status.HTTP_201_CREATED)
def submit_assignment(
    assignment_id: UUID,
    payload: SubmissionSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    existing = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.assignment_id == assignment_id,
        AssignmentSubmission.user_id == current_user.id
    ).first()
    
    if existing:
        existing.submission_text = payload.submission_text
        existing.status = "pending"
        existing.submitted_at = datetime.utcnow()
        db.commit()
        return {"status": "resubmitted", "submission_id": str(existing.id)}
        
    submission = AssignmentSubmission(
        assignment_id=assignment_id,
        user_id=current_user.id,
        submission_text=payload.submission_text,
        status="pending"
    )
    db.add(submission)
    
    # Give course progress boost for submitting assignments
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == assignment.course_id
    ).first()
    if enrollment:
        enrollment.progress = min(enrollment.progress + 15, 100)
        if enrollment.progress == 100:
            enrollment.status = "completed"
            
    db.commit()
    return {"status": "submitted", "submission_id": str(submission.id)}


@router.get("/submissions", response_model=List[SubmissionOut])
def get_all_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permissions required")
        
    return db.query(AssignmentSubmission).all()


@router.post("/submissions/{submission_id}/grade", status_code=status.HTTP_200_OK)
def grade_submission(
    submission_id: UUID,
    payload: GradeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permissions required")
        
    sub = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    sub.grade = payload.grade
    sub.feedback = payload.feedback
    sub.status = "graded"
    
    # Award points to student if they pass!
    if payload.grade.upper() in ["A", "B", "C", "PASS"]:
        student = db.query(User).filter(User.id == sub.user_id).first()
        if student:
            student.total_points += 150
            
    db.commit()
    return {"status": "graded"}
