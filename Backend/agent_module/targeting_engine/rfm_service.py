import psycopg2
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def compute_rfm_scores():

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT c.id,
               MAX(t.created_at),
               COUNT(t.id),
               COALESCE(SUM(i.total_price), 0)
        FROM customers c
        LEFT JOIN trips t ON c.id = t.customer_id
        LEFT JOIN itineraries i ON t.id = i.trip_id
        GROUP BY c.id
    """)

    rows = cur.fetchall()

    for row in rows:
        customer_id, last_trip, frequency, monetary = row

        # ---- Recency ----
        recency_score = 0.3
        if last_trip:
            days_diff = (datetime.now() - last_trip).days
            if days_diff <= 30:
                recency_score = 1
            elif days_diff <= 60:
                recency_score = 0.7
            else:
                recency_score = 0.4

        # ---- Frequency ----
        frequency_score = min(frequency / 5, 1)

        # ---- Monetary ----
        monetary_score = min(float(monetary) / 500000, 1)

        # ---- Segment ----
        if recency_score > 0.8 and monetary_score > 0.7:
            segment = "High Value"
        elif frequency_score > 0.6:
            segment = "Repeat"
        else:
            segment = "Low Value"

        # Check if record exists
        cur.execute("""
            SELECT id FROM customer_rfm_scores
            WHERE customer_id = %s
        """, (customer_id,))

        exists = cur.fetchone()

        if exists:
            cur.execute("""
                UPDATE customer_rfm_scores
                SET recency_score=%s,
                    frequency_score=%s,
                    monetary_score=%s,
                    segment_label=%s,
                    updated_at=NOW()
                WHERE customer_id=%s
            """, (
                recency_score,
                frequency_score,
                monetary_score,
                segment,
                customer_id
            ))
        else:
            cur.execute("""
                INSERT INTO customer_rfm_scores
                (customer_id, recency_score, frequency_score,
                 monetary_score, segment_label)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                customer_id,
                recency_score,
                frequency_score,
                monetary_score,
                segment
            ))

    conn.commit()
    cur.close()
    conn.close()

    print("RFM computed successfully.")
