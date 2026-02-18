from datetime import datetime
from models.trip import Trip
from database import db

def process_intent(data):

    required_fields = [
        "customer_id",
        "origin",
        "destination",
        "departure_date",
        "return_date",
        "budget"
    ]

    for field in required_fields:
        if field not in data:
            raise ValueError(f"{field} is required")

    departure_date = datetime.strptime(data["departure_date"], "%Y-%m-%d").date()
    return_date = datetime.strptime(data["return_date"], "%Y-%m-%d").date()

    duration_days = (return_date - departure_date).days

    if duration_days <= 0:
        raise ValueError("Invalid dates")
    origin = data["origin"].upper()

    if origin == "DELHI":
        origin = "DEL"

    trip = Trip(
        customer_id=data["customer_id"],
        origin=origin,
        destination=data["destination"],
        departure_date=departure_date,
        return_date=return_date,
        duration_days=duration_days,
        budget=data["budget"],
        travel_style=data.get("travel_style", "Standard")
    )

    db.session.add(trip)
    db.session.commit()

    return {
        "trip_id": str(trip.id),
        "origin": trip.origin,
        "destination": trip.destination,
        "departure_date": data["departure_date"],
        "return_date": data["return_date"],
        "budget": data["budget"],
        "duration_days": duration_days
    }
