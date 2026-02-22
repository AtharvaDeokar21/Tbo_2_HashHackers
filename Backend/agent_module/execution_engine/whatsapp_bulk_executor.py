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

    result = {
        "customer_id": customer_id,
        "customer_name": None,
        "destination": None,
        "message": None,
        "image_url": None,
        "twilio_sid": None,
        "status": None,
        "error": None
    }

    try:
        customer = fetch_customer(customer_id)
        if not customer:
            result["error"] = "Customer not found"
            return result

        result["customer_name"] = customer[1]

        destination = get_customer_destination(customer_id)
        if not destination:
            result["error"] = "No destination found"
            return result

        result["destination"] = destination

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
        result["image_url"] = image_url

        # Personalized message
        message = generate_personalized_message(customer, trend_data, destination)
        result["message"] = message

        # Send WhatsApp (safe number only)
        sid, status = send_whatsapp_message(
            message,
            image_url
        )

        result["twilio_sid"] = sid
        result["status"] = status

        log_communication(customer_id, message, status)

    except Exception as e:
        result["error"] = str(e)

    return result


def execute_bulk_whatsapp(agent_id, customer_ids):

    print(f"Starting bulk WhatsApp execution for {len(customer_ids)} customers")

    results = []

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {
            executor.submit(process_single_customer, agent_id, cid): cid
            for cid in customer_ids
        }

        for future in as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                results.append({
                    "customer_id": futures[future],
                    "error": str(e)
                })

    print("Bulk execution completed.")

    return {
        "total_customers": len(customer_ids),
        "processed": len(results),
        "results": results
    }