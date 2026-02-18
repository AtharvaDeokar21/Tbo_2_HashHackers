from services.vector_store import store_itinerary_embedding
from services.itinerary_detail_service import get_itinerary_details

def embed_itinerary(itinerary_id):

    details = get_itinerary_details(itinerary_id)

    if not details:
        return

    summary = f"""
    Destination: {details['trip']['destination']}
    Total Price: {details['total_price']}
    Risk: {details['risk_level']}
    Margin: {details['margin_band']}
    Tradeoff: {details['tradeoff_summary']}
    Hotel: {details['hotel']['name']} ({details['hotel']['rating']})
    Flight: {details['flight']['airline']} with {details['flight']['layover_minutes']} min layover
    """


    print("Embedding summary:", summary)  # DEBUG
    store_itinerary_embedding(itinerary_id, summary)
