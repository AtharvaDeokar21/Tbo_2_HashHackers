import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

client = Client(
    os.getenv("TWILIO_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)

FROM_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")


def send_whatsapp_message(to_number, message_text):

    message = client.messages.create(
        from_=FROM_NUMBER,
        body=message_text,
        to=f"whatsapp:{to_number}"
    )

    return message.sid, message.status