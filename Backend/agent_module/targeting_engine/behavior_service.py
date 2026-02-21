import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")

def get_behavior_score(customer_id, destination):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT COUNT(*)
        FROM customer_engagement ce
        JOIN itineraries i ON ce.itinerary_id = i.id
        JOIN trips t ON i.trip_id = t.id
        WHERE ce.customer_id = %s
        AND t.destination = %s
        AND ce.created_at >= NOW() - INTERVAL '14 days'
    """, (customer_id, destination))

    interactions = cur.fetchone()[0]

    cur.close()
    conn.close()

    return min(interactions / 5, 1)
