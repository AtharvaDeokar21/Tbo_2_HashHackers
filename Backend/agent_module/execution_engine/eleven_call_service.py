import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
ELEVEN_AGENT_ID = os.getenv("ELEVEN_AGENT_ID")
ELEVEN_PHONE_NUMBER_ID = os.getenv("ELEVEN_PHONE_NUMBER_ID")


def initiate_eleven_call(phone_number, dynamic_context):

    url = "https://api.elevenlabs.io/v1/telephony/phone_numbers"

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "agent_id": ELEVEN_AGENT_ID,
        "to": phone_number,
        "from_phone_number_id": ELEVEN_PHONE_NUMBER_ID,
        "conversation_config": {
            "dynamic_variables": {
                "customer_context": dynamic_context
            }
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    print("Status:", response.status_code)
    print("Body:", response.text)

    if response.status_code not in [200, 201]:
        raise Exception(response.text)

    return response.json()