
import sqlite3

def inspect_db():
    try:
        conn = sqlite3.connect('test.db')
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(feedback)")
        columns = cursor.fetchall()
        print("Columns in 'feedback' table:")
        for col in columns:
            print(col)
        conn.close()
    except Exception as e:
        print(f"Error inspecting DB: {e}")

if __name__ == "__main__":
    inspect_db()
