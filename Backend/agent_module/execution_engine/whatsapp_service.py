import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

client = Client(
    os.getenv("TWILIO_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)

FROM_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")
SAFE_NUMBER = "+918149534654"


def send_whatsapp_message(message_text, image_url):

    message = client.messages.create(
        from_=FROM_NUMBER,
        body=message_text,
        media_url=[image_url],  
        to=f"whatsapp:{SAFE_NUMBER}"  
    )

    return message.sid, message.status