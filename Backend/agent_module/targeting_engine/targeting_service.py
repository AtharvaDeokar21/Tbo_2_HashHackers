import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")

from targeting_engine.behavior_service import get_behavior_score
from targeting_engine.affinity_service import get_destination_affinity



def get_top_targets(destination, limit=20):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT c.id, r.segment_label
        FROM customers c
        JOIN customer_rfm_scores r ON c.id = r.customer_id
    """)

    customers = cur.fetchall()

    scored = []

    for customer_id, segment in customers:

        behavior = get_behavior_score(customer_id, destination)
        affinity = get_destination_affinity(customer_id, destination)

        rfm_weight = 1 if segment == "High Value" else 0.6

        lead_score = (
            0.4 * behavior +
            0.3 * affinity +
            0.3 * rfm_weight
        )

        scored.append({
            "customer_id": customer_id,
            "segment": segment,
            "lead_score": round(lead_score, 3)
        })

    cur.close()
    conn.close()

    scored.sort(key=lambda x: x["lead_score"], reverse=True)

    return scored[:limit]
