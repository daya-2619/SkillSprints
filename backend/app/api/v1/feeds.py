# backend/app/api/v1/feeds.py
from fastapi import APIRouter, Depends
from typing import List, Dict
from backend.app.db import get_db
from sqlalchemy.orm import Session
from backend.app.models.course import Lesson, Module, Course

router = APIRouter()

@router.get("/trending", response_model=List[Dict])
async def get_feed(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """Returns a list of lessons for the TikTok-style feed."""
    lessons = db.query(Lesson).join(Module).join(Course).filter(Course.is_published == True).offset(skip).limit(limit).all()
    
    feed = []
    for l in lessons:
        feed.append({
            "id": str(l.id),
            "title": l.title,
            "video_url": l.video_url,
            "course_title": l.module.course.title if l.module and l.module.course else "Unknown Course"
        })
    return feed
