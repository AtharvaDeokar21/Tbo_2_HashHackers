import os
import json
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_edit_intent(message, itinerary_map):

    prompt = f"""
You are interpreting a travel agent's request to customize an itinerary.

Available itineraries:
{itinerary_map}

User message:
{message}

Extract which itinerary provides the flight and which provides the hotel.

Return STRICT JSON:

{{
 "flight_source": 1,
 "hotel_source": 2
}}

Numbers refer to itinerary numbers above.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    raw = response.text.strip()
    raw = raw.replace("```json","").replace("```","").strip()

    return json.loads(raw)