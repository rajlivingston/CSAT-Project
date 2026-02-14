# from sqlalchemy import Column, Integer, String, DateTime
# from sqlalchemy.sql import func
# from .database import Base

# class Feedback(Base):
#     __tablename__ = "feedback"

#     id = Column(Integer, primary_key=True, index=True)
#     ip_address = Column(String(50))
#     name = Column(String(100))
#     email = Column(String(100))
#     rating = Column(Integer)
#     screenshot_url = Column(String(255), nullable=True)
#     description = Column(String(500))
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())

from sqlalchemy.sql import func
from .database import Base

from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base   # assuming you use Base from database.py

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    rating = Column(Float, nullable=False)   
    description = Column(String, nullable=True)
    ip_address = Column(String)
    screenshot = Column(String, nullable=True)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

