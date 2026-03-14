import os
import json
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# In-memory store for conversations
conversation_store = {}


DEFAULT_INTENT = {
    "origin_city": None,
    "destination_city": None,
    "duration_days": None,
    "departure_month": None,
    "budget_level": None,
    "hotel_preference": None,
    "layover_preference": None
}


def update_intent_state(session_id, user_message):

    # Load existing conversation state
    intent = conversation_store.get(session_id, DEFAULT_INTENT.copy())

    prompt = f"""
You are an AI travel planning assistant.

Your job is to collect travel intent information through natural conversation.

Current known intent fields:
{intent}

User message:
{user_message}

Update the intent fields if possible.

Important:
- Do NOT overwrite existing fields unless user changes them.
- Ask a natural follow-up question if information is missing.
- Once you have enough information to plan a trip, generate a final travel prompt.

Required fields to proceed:
origin_city
destination_city
duration_days
departure_month
budget_level

Return STRICT JSON in this format:

If more information is needed:

{{
 "intent": {{
  "origin_city": "...",
  "destination_city": "...",
  "duration_days": "...",
  "departure_month": "...",
  "budget_level": "...",
  "hotel_preference": "...",
  "layover_preference": "..."
 }},
 "intent_ready": false,
 "reply": "Your next natural question to the user"
}}

If intent is complete:

{{
 "intent": {{
  "origin_city": "...",
  "destination_city": "...",
  "duration_days": "...",
  "departure_month": "...",
  "budget_level": "...",
  "hotel_preference": "...",
  "layover_preference": "..."
 }},
 "intent_ready": true,
 "prompt": "Client wants ..."
}}

Do not return text outside JSON.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    raw = response.text.strip()

    # Clean possible markdown wrapping
    raw = raw.replace("```json", "").replace("```", "").strip()

    result = json.loads(raw)

    # Update memory store
    conversation_store[session_id] = result["intent"]
    conversation_store.pop(session_id, None) if result["intent_ready"] else None
    return result