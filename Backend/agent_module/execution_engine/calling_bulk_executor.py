from concurrent.futures import ThreadPoolExecutor, as_completed
from execution_engine.customer_processor import fetch_customer
from execution_engine.execution_helpers import get_customer_destination
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_CALLER_ID = os.getenv("TWILIO_CALLER_ID")

client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)


# -------------------------------------------
# BUILD INTELLIGENT CONVERSATION CONTEXT
# -------------------------------------------

def build_call_context(customer, destination):

    context = f"""
Customer Name: {customer[1]}
City: {customer[3]}
Budget Preference: {customer[4]}
Risk Appetite: {customer[5]}

Trending Destination: {destination}

Objective:
Have a natural intelligent travel consultation.
Align suggestions with customer's budget.
Adapt tone based on risk appetite.
Be persuasive but not pushy.
Ask qualifying questions.
Handle objections intelligently.
"""

    return context


# -------------------------------------------
# SINGLE CUSTOMER CALL
# -------------------------------------------

def process_single_call(agent_id, customer_id):

    result = {
        "customer_id": customer_id,
        "customer_name": None,
        "destination": None,
        "call_id": None,
        "status": None,
        "error": None
    }

    print("Processing call for customer:", customer_id)

    try:
        customer = fetch_customer(customer_id)

        if not customer:
            result["error"] = "Customer not found"
            return result

        print("Fetched customer:", customer)

        result["customer_name"] = customer[1]

        destination = get_customer_destination(customer_id)

        if not destination:
            result["error"] = "No destination found"
            return result

        result["destination"] = destination

        # Build context
        context = build_call_context(customer, destination)
        print("Built context:")
        print(context)

        # Twilio outbound call
        call = client.calls.create(
            to= os.getenv("TEST_CALLER_NUMBER"),  
            from_=TWILIO_CALLER_ID,
            url=f" https://difficultly-unsmokeable-rickey.ngrok-free.dev/api/call/webhook?customer_id={customer_id}"
        )

        result["call_id"] = call.sid
        result["status"] = call.status

        print("Call initiated:", call.sid)

    except Exception as e:
        result["error"] = str(e)

    print("Result:", result)

    return result


# -------------------------------------------
# BULK CALL EXECUTOR
# -------------------------------------------

def execute_bulk_calling(agent_id, customer_ids):

    results = []

    with ThreadPoolExecutor(max_workers=5) as executor:

        futures = {
            executor.submit(process_single_call, agent_id, cid): cid
            for cid in customer_ids
        }

        for future in as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                results.append({
                    "customer_id": futures[future],
                    "error": str(e)
                })

    return {
        "total_customers": len(customer_ids),
        "processed": len(results),
        "results": results
    }