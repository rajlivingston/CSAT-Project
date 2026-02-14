
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
            # Check if column exists
            result = connection.execute(text("SHOW COLUMNS FROM feedback LIKE 'created_at'"))
            if result.fetchone():
                print("Column 'created_at' already exists in 'feedback' table.")
            else:
                print("Adding 'created_at' column to 'feedback' table...")
                connection.execute(text("ALTER TABLE feedback ADD COLUMN created_at DATETIME DEFAULT NOW()"))
                print("Column added successfully.")
        except Exception as e:
            print(f"Error checking/adding column: {e}")

if __name__ == "__main__":
    upgrade()
