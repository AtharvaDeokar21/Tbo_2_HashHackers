from models.price_history import PriceHistory
from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from models.itinerary import Itinerary
from database import db
import statistics

def record_price_snapshot(itinerary_id):

    itinerary = Itinerary.query.get(itinerary_id)
    if not itinerary:
        return None

    flight = FlightOption.query.filter_by(itinerary_id=itinerary.id).first()
    hotel = HotelOption.query.filter_by(itinerary_id=itinerary.id).first()

    if not flight or not hotel:
        return None

    snapshot = PriceHistory(
        itinerary_id=itinerary.id,
        flight_price=flight.price,
        hotel_price=hotel.price,
        total_price=float(flight.price) + float(hotel.price)
    )

    db.session.add(snapshot)
    db.session.commit()

    return snapshot


def calculate_volatility(itinerary_id):

    history = PriceHistory.query.filter_by(
        itinerary_id=itinerary_id
    ).order_by(PriceHistory.created_at.asc()).all()

    if len(history) < 2:
        return {
            "volatility_score": 0.1,
            "momentum": "Stable"
        }

    prices = [float(h.total_price) for h in history]

    # % change between first and last
    percent_change = (prices[-1] - prices[0]) / prices[0]

    # Standard deviation normalized
    std_dev = statistics.stdev(prices)
    normalized_volatility = min(std_dev / prices[0], 1)

    # Momentum classification
    if percent_change > 0.05:
        momentum = "Rising"
    elif percent_change < -0.05:
        momentum = "Dropping"
    else:
        momentum = "Stable"

    volatility_score = min(abs(percent_change) + normalized_volatility, 1)

    return {
        "volatility_score": volatility_score,
        "momentum": momentum
    }
