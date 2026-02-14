from pydantic import BaseModel, EmailStr
from typing import Optional

class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    rating: int
    description: str

class FeedbackResponse(BaseModel):
    id: int
    name: str
    rating: int

    class Config:
        from_attributes = True


# Schema for login request
class LoginRequest(BaseModel):
    username: str
    password: str

