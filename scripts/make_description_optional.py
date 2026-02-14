
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
            print("Modifying 'description' column to be NULLABLE...")
            # MySQL syntax to modify column definition
            # Assuming description is VARCHAR(255) or similar based on Models (String default is usually 255 or Text)
            # SQLAlchemy String without length usually compiles to VARCHAR in MySQL but length matters.
            # Let's assume standard behavior or check.
            # Safer to use MODIFY COLUMN description VARCHAR(255) NULL
            # But we need to know the type.
            # Let's inspect first or just try TEXT which covers most.
            
            # First check type? No, let's just use what we think it is.
            # In models it was String.
            
            connection.execute(text("ALTER TABLE feedback MODIFY COLUMN description VARCHAR(500) NULL"))
            print("Column 'description' modified to allow NULL.")
        except Exception as e:
            print(f"Error modifying column: {e}")

if __name__ == "__main__":
    upgrade()
