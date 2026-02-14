
import sys
import os
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import Base, SessionLocal
from app.models import Feedback
from app.routes.reports import get_report

def verify():
    db = SessionLocal()
    try:
        # Clean up existing data for test (optional, but good for consistent results)
        # db.query(Feedback).delete()
        
        # Add mock data
        now = datetime.now()
        
        feedback_data = [
            {"rating": 5, "created_at": now, "name": "A", "email": "a@example.com", "description": "Good"},
            {"rating": 4, "created_at": now - timedelta(days=10), "name": "B", "email": "b@example.com", "description": "Okay"},
            {"rating": 3, "created_at": now - timedelta(days=40), "name": "A", "email": "a@example.com", "description": "Meh"}, # User A again
            {"rating": 2, "created_at": now - timedelta(days=70), "name": "C", "email": "c@example.com", "description": "Bad"},
            {"rating": 1, "created_at": now - timedelta(days=100), "name": "D", "email": "d@example.com", "description": "Terrible"},
        ]
        
        for data in feedback_data:
            fb = Feedback(**data)
            db.add(fb)
        
        db.commit()
        
        print("Mock data added.")
        
        # Manually call the report function logic (or similar)
        # Since get_report depends on depends, we simulate the logic here or call it if we mock Depends. 
        # Easier to just invoke the logic directly or call the function if possible.
        # But get_report requires 'username' dependency which returns string.
        
        # Let's just run the query logic directly to verify correctness of SQLAlchemy queries
        
        total_avg = db.query(Feedback).count()
        print(f"Total feedback count: {total_avg}")
        
        report = get_report(db, username="admin")
        print("\n--- Report Output ---")
        for k, v in report.items():
            print(f"{k}: {v}")
            
    except Exception as e:
        print(f"Error during verification: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify()
