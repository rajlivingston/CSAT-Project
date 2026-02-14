
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import pandas as pd

# Ensure we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def view_data():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            df = pd.read_sql("SELECT * FROM feedback", connection)
            
            if df.empty:
                print("No feedback data found.")
            else:
                print("\n=== Feedback Data ===\n")
                # Adjust display options for better readability
                pd.set_option('display.max_columns', None)
                pd.set_option('display.width', 1000)
                pd.set_option('display.max_colwidth', 50)
                print(df)
            
    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == "__main__":
    view_data()
