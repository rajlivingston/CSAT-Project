
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Ensure we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def upgrade():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        try:
            # Check for screenshot column
            result = connection.execute(text("SHOW COLUMNS FROM feedback LIKE 'screenshot'"))
            if result.fetchone():
                print("Column 'screenshot' already exists.")
            else:
                print("Adding 'screenshot' column...")
                connection.execute(text("ALTER TABLE feedback ADD COLUMN screenshot VARCHAR(255) NULL"))
                print("Column 'screenshot' added.")
                
            # Check for ip_address column just in case (as it was in the error params)
            result = connection.execute(text("SHOW COLUMNS FROM feedback LIKE 'ip_address'"))
            if result.fetchone():
                print("Column 'ip_address' already exists.")
            else:
                print("Adding 'ip_address' column...")
                connection.execute(text("ALTER TABLE feedback ADD COLUMN ip_address VARCHAR(255) NULL"))
                print("Column 'ip_address' added.")

        except Exception as e:
            print(f"Error fixing schema: {e}")

if __name__ == "__main__":
    upgrade()
