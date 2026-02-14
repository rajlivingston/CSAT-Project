
from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.schemas import FeedbackCreate
from app.models import Feedback
from app.database import SessionLocal, engine, Base
import shutil
import os

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ensure tables exist (optional here, usually done in main.py)
# Base.metadata.create_all(bind=engine) 

@router.post("/submit")
def submit_feedback(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    rating: float = Form(...), 
    description: str = Form(None),
    screenshot: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    ip = request.client.host if request.client else "127.0.0.1"

    screenshot_path = None

    if screenshot:
        os.makedirs("screenshots", exist_ok=True)
        screenshot_path = f"screenshots/{screenshot.filename}"

        with open(screenshot_path, "wb") as buffer:
            shutil.copyfileobj(screenshot.file, buffer)

    db_feedback = Feedback(
        name=name,
        email=email,
        rating=rating,
        description=description,
        ip_address=ip,
        screenshot=screenshot_path
    )

    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)

    return {"message": "Feedback received"}
