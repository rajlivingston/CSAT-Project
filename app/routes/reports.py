
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
    if username != "Raj Livingston":
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

    # Rating Distribution (1, 2, 3, 4, 5)
    # Since ratings can be floats (0.5 steps), we'll group them by floor value
    distribution = {}
    for i in range(1, 6):
        # Count ratings where floor(rating) == i OR (rating > i-1 and rating <= i)
        # To keep it simple for the chart, we'll group 4.5 with 5, etc., or just count occurrences.
        # Let's count ratings in ranges: [0.5, 1.5], (1.5, 2.5], etc.
        count = db.query(func.count(Feedback.id)).filter(
            Feedback.rating > (i - 1),
            Feedback.rating <= i
        ).scalar() or 0
        distribution[str(i)] = count

    # Recent Feedback
    recent_feedback = db.query(Feedback).order_by(Feedback.created_at.desc()).limit(5).all()
    recent_list = []
    for f in recent_feedback:
        recent_list.append({
            "id": f.id,
            "name": f.name,
            "email": f.email,
            "rating": f.rating,
            "description": f.description,
            "created_at": f.created_at.isoformat() if f.created_at else None
        })

    return {
        "total_avg_rating": round(float(total_avg), 2),
        "avg_rating_last_30_days": round(float(avg_30), 2),
        "avg_rating_last_60_days": round(float(avg_60), 2),
        "avg_rating_last_90_days": round(float(avg_90), 2),
        "unique_rating_count": unique_raters,
        "distribution": distribution,
        "recent_feedback": recent_list
    }
