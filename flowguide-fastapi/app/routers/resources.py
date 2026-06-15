from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.resource import QuizQuestion, StudyMaterial, VideoTutorial
from app.models.audit import AuditLog
from app.schemas.resource import (
    QuizQuestionCreate, QuizQuestionUpdate, QuizQuestionOut,
    StudyMaterialCreate, StudyMaterialUpdate, StudyMaterialOut,
    VideoTutorialCreate, VideoTutorialUpdate, VideoTutorialOut
)

router = APIRouter(tags=["Resources"])

def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permissions required to perform this action"
        )
    return current_user

# ================================================================
# User Endpoints (Fetch dynamic content filtered by course)
# ================================================================

@router.get("/api/resources/quizzes", response_model=list[QuizQuestionOut])
def get_quizzes(course: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(QuizQuestion).filter(QuizQuestion.course == course.lower()).order_by(QuizQuestion.created_at.asc()).all()

@router.get("/api/resources/materials", response_model=list[StudyMaterialOut])
def get_materials(course: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(StudyMaterial).filter(StudyMaterial.course == course.lower()).order_by(StudyMaterial.created_at.asc()).all()

@router.get("/api/resources/videos", response_model=list[VideoTutorialOut])
def get_videos(course: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(VideoTutorial).filter(VideoTutorial.course == course.lower()).order_by(VideoTutorial.created_at.asc()).all()

# ================================================================
# Admin Endpoints (Manage content)
# ================================================================

# --- Quizzes ---
@router.post("/api/admin/resources/quizzes", response_model=QuizQuestionOut, status_code=status.HTTP_201_CREATED)
def create_quiz_question(payload: QuizQuestionCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    question = QuizQuestion(
        course=payload.course.lower(),
        question=payload.question,
        options_raw=payload.options_raw,
        correct_index=payload.correct_index
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    db.add(AuditLog(user_id=admin.id, action=f"ADMIN_CREATE_QUIZ_{payload.course.upper()}", entity_type="quiz_question", entity_id=question.id))
    db.commit()
    return question

@router.put("/api/admin/resources/quizzes/{id}", response_model=QuizQuestionOut)
def update_quiz_question(id: UUID, payload: QuizQuestionUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    question = db.query(QuizQuestion).filter(QuizQuestion.id == id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Quiz question not found")
    
    if payload.course is not None:
        question.course = payload.course.lower()
    if payload.question is not None:
        question.question = payload.question
    if payload.options_raw is not None:
        question.options_raw = payload.options_raw
    if payload.correct_index is not None:
        question.correct_index = payload.correct_index
        
    db.commit()
    db.refresh(question)
    db.add(AuditLog(user_id=admin.id, action="ADMIN_UPDATE_QUIZ", entity_type="quiz_question", entity_id=question.id))
    db.commit()
    return question

@router.delete("/api/admin/resources/quizzes/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz_question(id: UUID, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    question = db.query(QuizQuestion).filter(QuizQuestion.id == id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Quiz question not found")
    db.delete(question)
    db.commit()
    db.add(AuditLog(user_id=admin.id, action="ADMIN_DELETE_QUIZ", entity_type="quiz_question", entity_id=id))
    db.commit()

# --- Materials ---
@router.post("/api/admin/resources/materials", response_model=StudyMaterialOut, status_code=status.HTTP_201_CREATED)
def create_study_material(payload: StudyMaterialCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    material = StudyMaterial(
        course=payload.course.lower(),
        title=payload.title,
        description=payload.description,
        read_time=payload.read_time,
        content=payload.content
    )
    db.add(material)
    db.commit()
    db.refresh(material)
    db.add(AuditLog(user_id=admin.id, action=f"ADMIN_CREATE_MATERIAL_{payload.course.upper()}", entity_type="study_material", entity_id=material.id))
    db.commit()
    return material

@router.put("/api/admin/resources/materials/{id}", response_model=StudyMaterialOut)
def update_study_material(id: UUID, payload: StudyMaterialUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    material = db.query(StudyMaterial).filter(StudyMaterial.id == id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Study material not found")
    
    if payload.course is not None:
        material.course = payload.course.lower()
    if payload.title is not None:
        material.title = payload.title
    if payload.description is not None:
        material.description = payload.description
    if payload.read_time is not None:
        material.read_time = payload.read_time
    if payload.content is not None:
        material.content = payload.content
        
    db.commit()
    db.refresh(material)
    db.add(AuditLog(user_id=admin.id, action="ADMIN_UPDATE_MATERIAL", entity_type="study_material", entity_id=material.id))
    db.commit()
    return material

@router.delete("/api/admin/resources/materials/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_study_material(id: UUID, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    material = db.query(StudyMaterial).filter(StudyMaterial.id == id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Study material not found")
    db.delete(material)
    db.commit()
    db.add(AuditLog(user_id=admin.id, action="ADMIN_DELETE_MATERIAL", entity_type="study_material", entity_id=id))
    db.commit()

# --- Videos ---
@router.post("/api/admin/resources/videos", response_model=VideoTutorialOut, status_code=status.HTTP_201_CREATED)
def create_video_tutorial(payload: VideoTutorialCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    video = VideoTutorial(
        course=payload.course.lower(),
        title=payload.title,
        description=payload.description,
        duration=payload.duration,
        embed_url=payload.embed_url,
        watch_url=payload.watch_url,
        color=payload.color
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    db.add(AuditLog(user_id=admin.id, action=f"ADMIN_CREATE_VIDEO_{payload.course.upper()}", entity_type="video_tutorial", entity_id=video.id))
    db.commit()
    return video

@router.put("/api/admin/resources/videos/{id}", response_model=VideoTutorialOut)
def update_video_tutorial(id: UUID, payload: VideoTutorialUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    video = db.query(VideoTutorial).filter(VideoTutorial.id == id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video tutorial not found")
    
    if payload.course is not None:
        video.course = payload.course.lower()
    if payload.title is not None:
        video.title = payload.title
    if payload.description is not None:
        video.description = payload.description
    if payload.duration is not None:
        video.duration = payload.duration
    if payload.embed_url is not None:
        video.embed_url = payload.embed_url
    if payload.watch_url is not None:
        video.watch_url = payload.watch_url
    if payload.color is not None:
        video.color = payload.color
        
    db.commit()
    db.refresh(video)
    db.add(AuditLog(user_id=admin.id, action="ADMIN_UPDATE_VIDEO", entity_type="video_tutorial", entity_id=video.id))
    db.commit()
    return video

@router.delete("/api/admin/resources/videos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video_tutorial(id: UUID, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    video = db.query(VideoTutorial).filter(VideoTutorial.id == id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video tutorial not found")
    db.delete(video)
    db.commit()
    db.add(AuditLog(user_id=admin.id, action="ADMIN_DELETE_VIDEO", entity_type="video_tutorial", entity_id=id))
    db.commit()
