from concurrent.futures import ThreadPoolExecutor, as_completed
from execution_engine.customer_processor import (
    fetch_customer,
    generate_personalized_message
)
from execution_engine.execution_helpers import (
    get_customer_destination,
    log_communication
)
from execution_engine.whatsapp_service import send_whatsapp_message

from trend_engine.hybrid_trend_service import update_demand_signal
from creative_engine.creative_orchestrator import build_creative


def process_single_customer(agent_id, customer_id):

    customer = fetch_customer(customer_id)
    if not customer:
        print(f"Customer {customer_id} not found")
        return

    destination = get_customer_destination(customer_id)
    if not destination:
        print(f"No destination for {customer_id}")
        return

    print(f"Generating campaign for {customer[1]} → {destination}")

    # Trend
    trend_data = update_demand_signal(destination)

    # Creative
    creative_context = {
        "destination": destination,
        "segment": customer[4],
        "urgency": "48_hours" if trend_data["final_score"] > 0.6 else "Limited Period",
        "trend_score": trend_data["final_score"]
    }

    image_url = build_creative(creative_context)

    # Personalized message
    message = generate_personalized_message(customer, trend_data, destination)

    # Send WhatsApp (safe number only)
    sid, status = send_whatsapp_message(
        message,
        image_url
    )

    print(f"WhatsApp sent for {customer[1]} | SID: {sid}")

    log_communication(customer_id, message, status)


def execute_bulk_whatsapp(agent_id, customer_ids):

    print(f"Starting bulk WhatsApp execution for {len(customer_ids)} customers")

    futures = []

    with ThreadPoolExecutor(max_workers=6) as executor:
        for customer_id in customer_ids:
            futures.append(
                executor.submit(process_single_customer, agent_id, customer_id)
            )

        # Wait for all to finish
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                print("Thread error:", e)

    print("Bulk execution completed.")