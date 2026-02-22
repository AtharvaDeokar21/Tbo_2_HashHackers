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


def generate_personalized_message(customer, trend_data, destination):
    
    prompt = f"""
You are a high-conversion luxury travel copywriter.

DO NOT repeat raw database fields.
DO NOT mention trend score numbers.
DO NOT mention risk preference directly.

Customer Profile:
Name: {customer[1]}
City: {customer[3]}
Budget Tier: {customer[4]}
Travel Comfort Preference: {customer[5]}

Destination: {destination}
Destination Momentum: {"High demand" if trend_data["final_score"] > 0.6 else "Growing interest"}

Task:
Write a persuasive WhatsApp message tailored to this customer.

Guidelines:
- Adapt tone based on budget tier:
    * Luxury/Premium → refined, exclusive, curated language
    * Mid → smart-value premium
    * Budget → exciting, energetic, affordable framing
- Translate risk preference into emotional tone (secure vs adventurous) WITHOUT mentioning it
- Create subtle urgency (inventory tightening, seasonal spike, limited suites)
- Make it feel like a personal concierge message
- Keep under 90 words
- Add a strong conversational CTA

Return ONLY the message text.
"""

    message = generate_text(prompt, temperature=0.85)

    if not message:
        message = f"""
Hi {customer[1]} ✨

We’ve identified a travel opportunity in {destination} that aligns beautifully with your preferences. 
Availability is tightening, and I’d love to share the curated details before premium spots fill up.

Shall I send you the itinerary preview?
"""

    return message.strip()