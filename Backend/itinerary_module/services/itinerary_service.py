from models.itinerary import Itinerary
from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from database import db
from datetime import datetime


def parse_datetime(dt_string):
    if not dt_string:
        return None
    return datetime.strptime(dt_string, "%Y-%m-%d %H:%M")


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

        # -----------------
        # Save flight snapshot
        # -----------------
        flight = item["flight"]

        flight_record = FlightOption(
            itinerary_id=itinerary.id,
            airline=flight.get("airline"),
            flight_number=flight.get("flight_number"),

            departure_airport=flight.get("departure_airport"),
            arrival_airport=flight.get("arrival_airport"),

            departure_time=parse_datetime(flight.get("departure_time")),
            arrival_time=parse_datetime(flight.get("arrival_time")),

            travel_class=flight.get("travel_class"),
            aircraft=flight.get("aircraft"),
            legroom=flight.get("legroom"),

            duration_minutes=flight.get("duration"),

            layover_count=flight.get("layovers"),
            max_layover_minutes=flight.get("max_layover_minutes"),
            overnight_layover=flight.get("overnight_layover"),

            carbon_emissions=flight.get("carbon_emissions"),
            emission_delta_percent=flight.get("emission_delta_percent"),

            booking_token=flight.get("booking_token"),

            price=flight.get("price"),
            volatility_indicator="Stable"
        )


        db.session.add(flight_record)

        # -----------------
        # Save hotel snapshot (UPDATED)
        # -----------------
        hotel = item["hotel"]

        hotel_record = HotelOption(
            itinerary_id=itinerary.id,
            hotel_name=hotel.get("name"),
            rating=hotel.get("rating"),
            reviews=hotel.get("reviews"),
            hotel_class=hotel.get("hotel_class"),
            location="Unknown",
            room_type="Standard",
            price=hotel.get("price_per_night"),
            total_price=hotel.get("total_price"),
            inventory_status="Available",
            image_url=hotel.get("image_url"),
            latitude=hotel.get("latitude"),
            longitude=hotel.get("longitude"),
            amenities=hotel.get("amenities"),
            check_in=hotel.get("check_in"),
            check_out=hotel.get("check_out")
        )

        db.session.add(hotel_record)

        saved_itineraries.append(itinerary)

    db.session.commit()

    return saved_itineraries
