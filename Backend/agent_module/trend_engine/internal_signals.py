import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")



def get_connection():
    return psycopg2.connect(DATABASE_URL)


def normalize(value):
    return max(min(value, 1), 0)


def search_spike(destination):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COUNT(*) FROM trips
        WHERE destination = %s
        AND created_at >= NOW() - INTERVAL '7 days'
    """, (destination,))
    current = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*) FROM trips
        WHERE destination = %s
        AND created_at BETWEEN NOW() - INTERVAL '14 days'
        AND NOW() - INTERVAL '7 days'
    """, (destination,))
    previous = cur.fetchone()[0]

    cur.close()
    conn.close()

    if previous == 0:
        return normalize(0.5 if current > 0 else 0)

    return normalize((current - previous) / previous)


def engagement_spike(destination):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COUNT(*)
        FROM customer_engagement ce
        JOIN itineraries i ON ce.itinerary_id = i.id
        JOIN trips t ON i.trip_id = t.id
        WHERE t.destination = %s
        AND ce.created_at >= NOW() - INTERVAL '7 days'
    """, (destination,))
    current = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM customer_engagement ce
        JOIN itineraries i ON ce.itinerary_id = i.id
        JOIN trips t ON i.trip_id = t.id
        WHERE t.destination = %s
        AND ce.created_at BETWEEN NOW() - INTERVAL '14 days'
        AND NOW() - INTERVAL '7 days'
    """, (destination,))
    previous = cur.fetchone()[0]

    cur.close()
    conn.close()

    if previous == 0:
        return normalize(0.5 if current > 0 else 0)

    return normalize((current - previous) / previous)


def business_viability(destination):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT AVG(i.margin_score), AVG(i.risk_score)
        FROM itineraries i
        JOIN trips t ON i.trip_id = t.id
        WHERE t.destination = %s
    """, (destination,))

    margin, risk = cur.fetchone()

    cur.close()
    conn.close()

    margin = float(margin or 0.5)
    risk = float(risk or 0.5)

    return normalize(0.6 * margin + 0.4 * risk)


def customer_behavior_boost(destination):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COUNT(*)
        FROM customer_rfm_scores r
        JOIN customers c ON r.customer_id = c.id
        JOIN trips t ON c.id = t.customer_id
        WHERE t.destination = %s
        AND r.segment_label = 'High Value'
    """, (destination,))

    count = cur.fetchone()[0]

    cur.close()
    conn.close()

    return normalize(count / 20)
