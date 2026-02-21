from models.risk_snapshot import RiskSnapshot
from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from models.itinerary import Itinerary
from services.price_tracker import calculate_volatility

from database import db
import random

def calculate_risk(itinerary_id):

    itinerary = Itinerary.query.get(itinerary_id)
    if not itinerary:
        return None

    flight = FlightOption.query.filter_by(itinerary_id=itinerary.id).first()
    hotel = HotelOption.query.filter_by(itinerary_id=itinerary.id).first()

    # Connection risk
    layover = flight.max_layover_minutes if flight else 0
    connection_risk_score = min(layover / 300, 1)

    vol_data = calculate_volatility(itinerary_id)
    fare_volatility_score = vol_data["volatility_score"]


    # Inventory risk
    inventory_risk_score = 0.3 if hotel and hotel.inventory_status == "Available" else 0.7

    overall_risk = (connection_risk_score + fare_volatility_score + inventory_risk_score) / 3

    if overall_risk > 0.6:
        risk_level = "High"
    elif overall_risk > 0.3:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    snapshot = RiskSnapshot(
        itinerary_id=itinerary.id,
        fare_volatility_score=fare_volatility_score,
        connection_risk_score=connection_risk_score,
        inventory_risk_score=inventory_risk_score,
        overall_risk_level=risk_level
    )

    db.session.add(snapshot)

    itinerary.risk_score = 1 - overall_risk
    itinerary.risk_level = risk_level

    db.session.commit()

    return {
        "risk_level": risk_level,
        "risk_score": itinerary.risk_score
    }
