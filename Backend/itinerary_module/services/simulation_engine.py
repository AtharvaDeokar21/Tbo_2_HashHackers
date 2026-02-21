from models.itinerary import Itinerary
from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from services.scoring_engine_v2 import resolution_agent
from services.margin_engine import calculate_margin
from services.risk_engine import calculate_risk
from services.final_score_engine import update_final_score
from database import db

def simulate_change(itinerary_id, simulation_payload):

    itinerary = Itinerary.query.get(itinerary_id)
    if not itinerary:
        return None

    flight = FlightOption.query.filter_by(itinerary_id=itinerary.id).first()
    hotel = HotelOption.query.filter_by(itinerary_id=itinerary.id).first()

    # Copy base structure
    simulated = {
        "flight": {
            "price": float(flight.price),
            "layovers": flight.max_layover_minutes
        },
        "hotel": {
            "price": float(hotel.price),
            "rating": float(hotel.rating)
        },
        "total_price": float(flight.price) + float(hotel.price)
    }

    change_type = simulation_payload.get("change_type")

    if change_type == "hotel":
        new_hotel = simulation_payload["new_hotel"]
        simulated["hotel"]["price"] = new_hotel["price"]
        simulated["hotel"]["rating"] = new_hotel["rating"]

    if change_type == "flight":
        new_flight = simulation_payload["new_flight"]
        simulated["flight"]["price"] = new_flight["price"]
        simulated["flight"]["layovers"] = new_flight["layovers"]

    simulated["total_price"] = (
        simulated["flight"]["price"] +
        simulated["hotel"]["price"]
    )

    # Recalculate scoring (deterministic multi-agent)
    simulated = resolution_agent(simulated, float(itinerary.trip.budget))

    return simulated
