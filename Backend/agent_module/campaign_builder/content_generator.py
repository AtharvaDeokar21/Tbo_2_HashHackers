import json
from ai.groq_client import generate_text

def generate_campaign_content(prompt_string):

    if not isinstance(prompt_string, str):
        raise ValueError("generate_campaign_content expects a prompt string.")

    response = generate_text(
        prompt_string,
        temperature=0.3,
        max_tokens=2000
    )

    if not response:
        return {
            "error": "Invalid LLM response",
            "raw": response
        }

    return response