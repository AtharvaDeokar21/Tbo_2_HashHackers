import json
from ai.groq_client import generate_text

def generate_campaign_content(prompt):

    response = generate_text(prompt)

    try:
        clean = response.strip().replace("```json", "").replace("```", "")
        return json.loads(clean)
    except:
        return {
            "error": "Invalid LLM response",
            "raw": response
        }
