
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from datetime import datetime, timedelta
from typing import Dict, Any

from ..database import SessionLocal
from ..models import Feedback
from app.auth import verify_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_admin(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username = payload.get("sub")
    if username != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return username

@router.get("/report", response_model=Dict[str, Any])
def get_report(db: Session = Depends(get_db), current_user: str = Depends(get_current_admin)):
    # Total Average Rating
    total_avg = db.query(func.avg(Feedback.rating)).scalar() or 0.0

    # Helper function for rolling averages
    def get_avg_rating_days(days: int) -> float:
        cutoff_date = datetime.now() - timedelta(days=days)
        avg = db.query(func.avg(Feedback.rating)).filter(Feedback.created_at >= cutoff_date).scalar()
        return avg or 0.0

    avg_30 = get_avg_rating_days(30)
    avg_60 = get_avg_rating_days(60)
    avg_90 = get_avg_rating_days(90)

    # Unique Ratings (using logic: unique emails)
    unique_raters = db.query(func.count(distinct(Feedback.email))).scalar() or 0

    return {
        "total_avg_rating": round(float(total_avg), 2),
        "avg_rating_last_30_days": round(float(avg_30), 2),
        "avg_rating_last_60_days": round(float(avg_60), 2),
        "avg_rating_last_90_days": round(float(avg_90), 2),
        "unique_rating_count": unique_raters
    }
