from models.itinerary import Itinerary
from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from models.trip import Trip
from models.customer import Customer
from database import db

def get_itinerary_details(itinerary_id):

    itinerary = Itinerary.query.get(itinerary_id)

    if not itinerary:
        return None

    flight = FlightOption.query.filter_by(itinerary_id=itinerary.id).first()
    hotel = HotelOption.query.filter_by(itinerary_id=itinerary.id).first()

    trip = itinerary.trip
    customer = trip.customer if trip else None

    response = {
        "itinerary_id": str(itinerary.id),
        "total_price": float(itinerary.total_price),
        "scores": {
            "cost_score": float(itinerary.cost_score or 0),
            "comfort_score": float(itinerary.comfort_score or 0),
            "risk_score": float(itinerary.risk_score or 0),
            "margin_score": float(itinerary.margin_score or 0),
            "final_score": float(itinerary.final_score or 0),
            "confidence_score": float(itinerary.confidence_score or 0)
        },
        "risk_level": itinerary.risk_level,
        "margin_band": itinerary.margin_band,
        "tradeoff_summary": itinerary.tradeoff_summary,
        "flight": {
            "airline": flight.airline if flight else None,
            "flight_number": flight.flight_number if flight else None,
            "layover_minutes": flight.layover_minutes if flight else None,
            "price": float(flight.price) if flight and flight.price else None,
            "volatility_indicator": flight.volatility_indicator if flight else None
        },
        "hotel": {
            "name": hotel.hotel_name if hotel else None,
            "rating": float(hotel.rating) if hotel and hotel.rating else None,
            "price": float(hotel.price) if hotel and hotel.price else None,
            "inventory_status": hotel.inventory_status if hotel else None
        },
        "trip": {
            "origin": trip.origin_airport if trip else None,
            "destination": trip.destination_city if trip else None,
            "departure_date": trip.departure_date.strftime("%Y-%m-%d") if trip else None,
            "return_date": trip.return_date.strftime("%Y-%m-%d") if trip else None,
            "budget": float(trip.budget) if trip and trip.budget else None
        },
        "customer": {
            "name": customer.name if customer else None,
            "risk_preference": customer.risk_preference if customer else None,
            "budget_range": customer.budget_range if customer else None
        }
    }

    return response
