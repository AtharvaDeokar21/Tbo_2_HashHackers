import os
import json
from groq import Groq
from dotenv import load_dotenv
from services.intent_schema import StructuredIntent
import re

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_INTENT_KEY"))

SYSTEM_PROMPT = """
You are a travel intent extraction engine.

Extract structured travel data from user input.

Return ONLY valid JSON in this exact format:

{
  "origin": "...",
  "destination": "...",
  "departure_date": "YYYY-MM-DD",
  "return_date": "YYYY-MM-DD",
  "budget": number,
  "travel_style": "Budget/Standard/Luxury",
  "risk_preference": "Low/Medium/High"
}

Rules:
- Convert "1.8 lakhs" → 180000
- If user says "April" assume reasonable 6-day trip in April 2026
- If minimal layovers → risk_preference = "Low"
- Do NOT explain anything
- Return JSON only
"""

def extract_intent(user_text):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_text}
        ],
        temperature=0
    )

    raw_output = response.choices[0].message.content.strip()

    try:
        json_match = re.search(r"\{.*\}", raw_output, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON found in model output")

        parsed = json.loads(json_match.group())
        validated = StructuredIntent(**parsed)
        return validated.model_dump()
    except Exception as e:
        raise ValueError("Intent parsing failed: " + str(e))
