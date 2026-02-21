import psycopg2
import os
from dotenv import load_dotenv
from ai.groq_client import generate_text
from campaign_builder.campaign_builder_service import build_campaign_package

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def fetch_customer(customer_id):
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name, phone, source_city, budget_range, risk_preference
        FROM customers
        WHERE id = %s
    """, (customer_id,))

    row = cur.fetchone()
    cur.close()
    conn.close()

    return row


def generate_personalized_message(customer, blueprint):

    prompt = f"""
You are a travel marketing expert.

Customer Name: {customer[1]}
Source City: {customer[3]}
Budget Range: {customer[4]}
Risk Preference: {customer[5]}

Campaign Positioning: {blueprint.get("positioning_angle")}
Urgency: {blueprint.get("urgency_message")}

Generate a highly personalized WhatsApp message.
Make it feel exclusive and conversational.
Keep under 120 words.
"""

    return generate_text(prompt)