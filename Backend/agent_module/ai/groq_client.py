import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables.")

client = Groq(api_key=api_key.strip())

MODEL_NAME = "openai/gpt-oss-120b"

def generate_text(prompt, temperature=0.7):

    if not isinstance(prompt, str):
        prompt = str(prompt)

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": "You are an intelligent structured output assistant. Always return clean JSON when requested."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=temperature,
            max_tokens=800
        )

        return response.choices[0].message.content

    except Exception as e:
        print("Groq Error:", e)
        return None