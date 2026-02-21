from models.itinerary import Itinerary
from services.itinerary_detail_service import get_itinerary_details

def get_trip_context(itinerary_id):

    selected = get_itinerary_details(itinerary_id)
    if not selected:
        return None

    trip_id = selected["trip_id"]

    siblings = Itinerary.query.filter_by(trip_id=trip_id).all()

    comparisons = []

    for it in siblings:
        comparisons.append({
            "itinerary_id": str(it.id),
            "total_price": float(it.total_price),
            "final_score": float(it.final_score),
            "risk_score": float(it.risk_score),
            "margin_score": float(it.margin_score)
        })

    return {
        "selected": selected,
        "all_options": comparisons
    }
