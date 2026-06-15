import json
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.learning import Course, Enrollment

router = APIRouter(prefix="/api/courses", tags=["Courses"])

# --- Pydantic Schemas ---
class ModuleSchema(BaseModel):
    id: int
    title: str
    content: str

class CourseCreateRequest(BaseModel):
    title: str
    description: str
    category: str
    level: str
    modules: List[ModuleSchema]

class CourseOut(BaseModel):
    id: UUID
    title: str
    description: str
    category: str
    level: str
    modules_json: str
    
    class Config:
        from_attributes = True

class EnrollmentOut(BaseModel):
    id: UUID
    course_id: UUID
    progress: int
    status: str
    course: CourseOut
    
    class Config:
        from_attributes = True


# --- Endpoints ---
@router.get("", response_model=List[CourseOut])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@router.get("/my-courses", response_model=List[EnrollmentOut])
def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()


@router.post("/{course_id}/enroll", status_code=status.HTTP_201_CREATED)
def enroll_in_course(
    course_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if existing:
        return {"status": "already_enrolled", "enrollment_id": str(existing.id)}
        
    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=course_id,
        progress=0,
        status="enrolled"
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    
    return {"status": "enrolled", "enrollment_id": str(enrollment.id)}


@router.post("", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permissions required")
        
    course = Course(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        level=payload.level,
        modules_json=json.dumps([m.dict() for m in payload.modules])
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
def delete_course(
    course_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin permissions required")
        
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    db.delete(course)
    db.commit()
    return {"detail": "Course deleted successfully"}
