import os
from google import genai
import json

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_trip_plan(trip_details):

    prompt = f"""
You are a travel itinerary planner.

Create a structured day-wise travel plan in JSON format.

Destination: {trip_details['destination_city']}
Travel Dates: {trip_details['departure_date']} to {trip_details['return_date']}
Travel Style: {trip_details['travel_style']}
Budget: {trip_details['budget']}
Risk Preference: {trip_details['risk_preference']}

Return STRICT JSON in this format:

{{
  "days": [
    {{
      "day": 1,
      "title": "Short theme for the day",
      "activities": [
        "Morning activity",
        "Afternoon activity",
        "Evening activity"
      ],
      "notes": "Optional tips"
    }}
  ]
}}

Rules:
- Do not include flights or hotel info.
- Make it realistic.
- Do not hallucinate impossible attractions.
- Stay practical and feasible.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    raw = response.text.strip().replace("```json", "").replace("```", "")
    return json.loads(raw)

