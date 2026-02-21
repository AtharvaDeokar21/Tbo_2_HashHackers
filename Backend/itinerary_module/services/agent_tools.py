from services.itinerary_detail_service import get_itinerary_details
from services.margin_engine import calculate_margin
from services.risk_engine import calculate_risk
from services.simulation_engine import simulate_change

def tool_get_itinerary(itinerary_id):
    return get_itinerary_details(itinerary_id)

def tool_calculate_margin(itinerary_id):
    return calculate_margin(itinerary_id)

def tool_calculate_risk(itinerary_id):
    return calculate_risk(itinerary_id)

def tool_simulate(itinerary_id, payload):
    return simulate_change(itinerary_id, payload)
