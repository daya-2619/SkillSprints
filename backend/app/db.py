# backend/app/db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.settings import Settings
import os

settings = Settings()

DATABASE_URL = os.getenv("DATABASE_URL") or settings.DATABASE_URL
if DATABASE_URL:
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
else:
    DATABASE_URL = "postgresql+psycopg2://postgres:password@localhost:5432/skillsprint"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    import backend.app.models  # Ensure models register on Base
    from backend.app.models.role import Role
    from sqlalchemy import text
    
    # Create extension for pgvector
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Seed default roles if not present
    db = SessionLocal()
    try:
        if not db.query(Role).filter(Role.id == 1).first():
            db.add(Role(id=1, name="instructor"))
        if not db.query(Role).filter(Role.id == 2).first():
            db.add(Role(id=2, name="student"))
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()
