
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from app.models import Feedback

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def verify_optional_description():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        # Create feedback without description
        fb = Feedback(
            name="No Desc",
            email="no@desc.com",
            rating=5,
            description=None, # Should be allowed now
            ip_address="127.0.0.1"
        )
        db.add(fb)
        db.commit()
        print("Successfully created feedback with NULL description.")
        
        # Clean up
        db.delete(fb)
        db.commit()
        print("Cleaned up test data.")
        
    except Exception as e:
        print(f"Verification failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_optional_description()
