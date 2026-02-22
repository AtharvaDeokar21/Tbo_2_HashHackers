import psycopg2
import os
from dotenv import load_dotenv
from execution_engine.campaign_launch_executor import launch_campaign_generation

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def get_customer_destination(customer_id):
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT t.destination
        FROM trips t
        JOIN customers c ON t.customer_id = c.id
        WHERE c.id = %s
        ORDER BY t.created_at DESC
        LIMIT 1
    """, (customer_id,))

    row = cur.fetchone()
    cur.close()
    conn.close()

    return row[0] if row else None


def log_communication(customer_id, message, status):
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO communication_logs
        (customer_id, channel, message_text, response_text)
        VALUES (%s, 'whatsapp', %s, %s)
    """, (customer_id, message, status))

    conn.commit()
    cur.close()
    conn.close()


def get_campaign_image(destination):
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT ca.image_url
        FROM campaigns c
        JOIN campaign_assets ca ON c.id = ca.campaign_id
        WHERE c.destination = %s
        ORDER BY c.created_at DESC
        LIMIT 1
    """, (destination,))

    row = cur.fetchone()
    cur.close()
    conn.close()

    return row[0] if row else None