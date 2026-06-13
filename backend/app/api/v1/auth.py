// backend/app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from backend.app.core.security import jwt_auth_middleware
from backend.app.core.security.password import verify_password, get_password_hash
from backend.app.models.user import User
from backend.app.db import get_db
from sqlalchemy.orm import Session
import os, jwt, datetime

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed, name=user.name, role_id=2)  # role 2 = student
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return _create_tokens(db_user)

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return _create_tokens(user)

def _create_tokens(user: User):
    secret = os.getenv("JWT_SECRET", "secret")
    now = datetime.datetime.utcnow()
    access_payload = {"sub": str(user.id), "role": user.role.name, "exp": now + datetime.timedelta(minutes=15)}
    refresh_payload = {"sub": str(user.id), "exp": now + datetime.timedelta(days=30)}
    access_token = jwt.encode(access_payload, secret, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, secret, algorithm="HS256")
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
