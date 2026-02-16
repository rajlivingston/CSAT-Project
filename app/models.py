from sqlalchemy.sql import func
from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    rating = Column(Float, nullable=False)   
    description = Column(String(1000), nullable=True)
    ip_address = Column(String(100), nullable=True)
    screenshot = Column(String(500), nullable=True)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())
