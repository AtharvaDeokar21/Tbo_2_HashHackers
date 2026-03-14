from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from models.itinerary import Itinerary
from database import db

from services.margin_engine import calculate_margin
from services.risk_engine import calculate_risk
from services.final_score_engine import update_final_score


def create_custom_itinerary(trip_id, flight_itinerary_id, hotel_itinerary_id):

    # fetch selected components
    flight = FlightOption.query.filter_by(itinerary_id=flight_itinerary_id).first()
    hotel = HotelOption.query.filter_by(itinerary_id=hotel_itinerary_id).first()

    if not flight or not hotel:
        return None

    total_price = float(flight.price) + float(hotel.total_price)

    # create itinerary row
    new_itinerary = Itinerary(
        trip_id=trip_id,
        total_price=total_price
    )

    db.session.add(new_itinerary)
    db.session.flush()

    # copy flight
    new_flight = FlightOption(
        itinerary_id=new_itinerary.id,
        airline=flight.airline,
        flight_number=flight.flight_number,
        departure_airport=flight.departure_airport,
        arrival_airport=flight.arrival_airport,
        departure_time=flight.departure_time,
        arrival_time=flight.arrival_time,
        travel_class=flight.travel_class,
        aircraft=flight.aircraft,
        legroom=flight.legroom,
        duration_minutes=flight.duration_minutes,
        layover_count=flight.layover_count,
        max_layover_minutes=flight.max_layover_minutes,
        overnight_layover=flight.overnight_layover,
        carbon_emissions=flight.carbon_emissions,
        emission_delta_percent=flight.emission_delta_percent,
        booking_token=flight.booking_token,
        price=flight.price,
        volatility_indicator=flight.volatility_indicator
    )

    db.session.add(new_flight)

    # copy hotel
    new_hotel = HotelOption(
        itinerary_id=new_itinerary.id,
        hotel_name=hotel.hotel_name,
        rating=hotel.rating,
        price=hotel.price,
        inventory_status=hotel.inventory_status,
        image_url=hotel.image_url,
        reviews=hotel.reviews,
        hotel_class=hotel.hotel_class,
        location=hotel.location,
        room_type=hotel.room_type,
        total_price=hotel.total_price,
        amenities=hotel.amenities,
        latitude=hotel.latitude,
        longitude=hotel.longitude,
        check_in=hotel.check_in,
        check_out=hotel.check_out
    )

    db.session.add(new_hotel)

    db.session.commit()

    # reuse your scoring engines
    calculate_margin(new_itinerary.id)
    calculate_risk(new_itinerary.id)
    update_final_score(new_itinerary.id)

    return new_itinerary.id