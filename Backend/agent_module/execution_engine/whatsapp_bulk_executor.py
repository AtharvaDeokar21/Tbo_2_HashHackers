from concurrent.futures import ThreadPoolExecutor
from execution_engine.customer_processor import (
    fetch_customer,
    generate_personalized_message,
    get_or_create_campaign
)
from execution_engine.execution_helpers import (
    get_customer_destination,
    log_communication,
    get_or_create_campaign
)
from execution_engine.whatsapp_service import send_whatsapp_message
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def process_single_customer(agent_id, customer_id):

    customer = fetch_customer(customer_id)
    if not customer:
        return

    destination = get_customer_destination(customer_id)

    campaign_id, blueprint = get_or_create_campaign(agent_id, destination)

    message = generate_personalized_message(customer, blueprint)

    sid, status = send_whatsapp_message(customer[2], message)

    log_communication(customer_id, message, status)


def execute_bulk_whatsapp(agent_id, customer_ids):

    with ThreadPoolExecutor(max_workers=10) as executor:
        for customer_id in customer_ids:
            executor.submit(process_single_customer, agent_id, customer_id)