import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found.")

client = Groq(api_key=api_key.strip())

MODEL_NAME = "openai/gpt-oss-120b"


def generate_text(prompt, temperature=0.7, max_tokens=1200):

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": "You are a strategic AI assistant. Always return valid clean JSON when JSON is requested."
                },
                {
                    "role": "user",
                    "content": str(prompt)
                }
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )

        return response.choices[0].message.content

    except Exception as e:
        print("Groq Error:", e)
        return None