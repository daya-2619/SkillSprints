# backend/app/api/v1/courses.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from backend.app.db import get_db
from sqlalchemy.orm import Session
from backend.app.models.course import Course, Module, Lesson

router = APIRouter()

class LessonCreate(BaseModel):
    title: str
    video_url: str
    transcript: Optional[str] = None

class ModuleCreate(BaseModel):
    title: str
    order_index: int = 0
    lessons: List[LessonCreate] = []

class CourseCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: str | None = None
    modules: List[ModuleCreate] = []

class LessonRead(BaseModel):
    id: int
    title: str
    video_url: Optional[str]
    class Config:
        from_attributes = True

class ModuleRead(BaseModel):
    id: int
    title: str
    order_index: int
    lessons: List[LessonRead]
    class Config:
        from_attributes = True

class CourseRead(BaseModel):
    id: int
    title: str
    description: str | None = None
    instructor_id: int
    is_published: bool
    modules: List[ModuleRead]
    class Config:
        from_attributes = True

@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    # Assuming instructor_id = 1 for testing
    db_course = Course(title=course.title, description=course.description, instructor_id=1, is_published=True)
    db.add(db_course)
    db.flush()
    
    for mod in course.modules:
        db_mod = Module(title=mod.title, order_index=mod.order_index, course_id=db_course.id)
        db.add(db_mod)
        db.flush()
        for les in mod.lessons:
            db_les = Lesson(title=les.title, video_url=les.video_url, transcript=les.transcript, module_id=db_mod.id)
            db.add(db_les)
            
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/", response_model=List[CourseRead])
def list_courses(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Course).offset(skip).limit(limit).all()

@router.get("/{course_id}", response_model=CourseRead)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
