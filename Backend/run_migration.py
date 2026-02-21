import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    raise ValueError("DATABASE_URL not found in .env")

def run_sql_file(cursor, file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        sql = f.read()
        cursor.execute(sql)
        print(f"Executed: {file_path}")

def main():
    try:
        conn = psycopg2.connect(DB_URL)
        conn.autocommit = True
        cursor = conn.cursor()

        sql_files = [
            "db/schema2.sql",
            "db/schema.sql",
            "db/indexes.sql",
            "db/indexes2.sql"
        ]

        for file in sql_files:
            if os.path.exists(file):
                run_sql_file(cursor, file)
            else:
                print(f"File not found: {file}")

        cursor.close()
        conn.close()
        print("All migrations completed successfully.")

    except Exception as e:
        print("Migration failed:", e)

if __name__ == "__main__":
    main()

