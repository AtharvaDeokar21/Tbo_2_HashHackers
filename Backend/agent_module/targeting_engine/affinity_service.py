import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")




def get_destination_affinity(customer_id, destination):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT COUNT(*)
        FROM trips
        WHERE customer_id = %s
        AND destination = %s
    """, (customer_id, destination))

    count = cur.fetchone()[0]

    cur.close()
    conn.close()

    return min(count / 3, 1)
