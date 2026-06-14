# backend/app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from backend.app.api.v1 import auth, feeds, courses, quiz, tutor, live
from backend.app.core.security import jwt_auth_middleware

app = FastAPI(title="skillsprint API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Auth Middleware
app.add_middleware(jwt_auth_middleware.JWTAuthMiddleware, secret_key=os.getenv("JWT_SECRET"))

# Session (for CSRF, optional)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET", "session-secret"))

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(feeds.router, prefix="/api/v1/feeds", tags=["feeds"])
app.include_router(courses.router, prefix="/api/v1/courses", tags=["courses"])
app.include_router(quiz.router, prefix="/api/v1/quiz", tags=["quiz"])
app.include_router(tutor.router, prefix="/api/v1/tutor", tags=["tutor"])
app.include_router(live.router, prefix="/api/v1/live", tags=["live"])

# Root health check
@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
