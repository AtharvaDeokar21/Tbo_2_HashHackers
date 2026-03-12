import requests
import os

VAPI_URL = "https://api.vapi.ai/call"

def create_vapi_call(phone, metadata):

    print("CALL METADATA:", metadata)

    payload = {
        "assistantId": os.getenv("ASSISTANT_ID"),
        "phoneNumberId": os.getenv("VAPI_PHONE_NUMBER_ID"),
        "customer": {
            "number": os.getenv("TEST_CALLER_NUMBER")
        },
        "assistantOverrides": {
            "variableValues": {
                "destination": metadata.get("destination"),
                "discount": metadata.get("discount"),
                "price": metadata.get("price"),
                "bonus": metadata.get("bonus"),
                "urgency": metadata.get("urgency"),
                "pitch": metadata.get("pitch"),
                "value_props": metadata.get("value_props")
            }
        }
    }

    headers = {
        "Authorization": f"Bearer {os.getenv('VAPI_API_KEY')}",
        "Content-Type": "application/json"
    }

    response = requests.post(VAPI_URL, json=payload, headers=headers)

    try:
        result = response.json()
    except Exception:
        result = {"error": "Invalid response from Vapi", "raw": response.text}

    print("VAPI RESPONSE:", result)

    return result