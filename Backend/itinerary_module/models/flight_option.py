from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class FlightOption(db.Model):
    __tablename__ = "flight_options"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = db.Column(UUID(as_uuid=True), db.ForeignKey("itineraries.id", ondelete="CASCADE"))

    airline = db.Column(db.String(100))
    flight_number = db.Column(db.String(50))
    departure_time = db.Column(db.DateTime)
    arrival_time = db.Column(db.DateTime)
    layover_minutes = db.Column(db.Integer)
    price = db.Column(db.Numeric)
    volatility_indicator = db.Column(db.String(50))

    itinerary = db.relationship("Itinerary", backref="flight_option")
