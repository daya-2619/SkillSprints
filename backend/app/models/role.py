# backend/app/models/role.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.app.db import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # Back‑reference to users
    users = relationship("User", back_populates="role")
