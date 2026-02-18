from models.itinerary import Itinerary
from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from database import db

def persist_itineraries(trip_id, ranked_itineraries):

    saved_itineraries = []

    for item in ranked_itineraries:

        itinerary = Itinerary(
            trip_id=trip_id,
            total_price=item["total_price"],
            cost_score=item.get("cost_score", 0),
            comfort_score=item.get("comfort_score", 0),
            risk_score=item.get("risk_score", 0),
            margin_score=item.get("margin_score", 0),
            final_score=item["score"],
            confidence_score=item.get("confidence_score", 0.8),
            risk_level="Medium",
            margin_band="Standard",
            tradeoff_summary="Balanced cost and comfort"
        )

        db.session.add(itinerary)
        db.session.flush()  # Get itinerary.id before commit

        # Save flight snapshot
        flight = item["flight"]
        flight_record = FlightOption(
            itinerary_id=itinerary.id,
            airline=flight.get("airline"),
            flight_number=flight.get("flight_number", "N/A"),
            layover_minutes=flight.get("layovers", 0),
            price=flight.get("price"),
            volatility_indicator="Stable"
        )

        db.session.add(flight_record)

        # Save hotel snapshot
        hotel = item["hotel"]
        hotel_record = HotelOption(
            itinerary_id=itinerary.id,
            hotel_name=hotel.get("name"),
            rating=hotel.get("rating"),
            location="Unknown",
            room_type="Standard",
            price=hotel.get("price"),
            inventory_status="Available"
        )

        db.session.add(hotel_record)

        saved_itineraries.append(itinerary)

    db.session.commit()

    return saved_itineraries
