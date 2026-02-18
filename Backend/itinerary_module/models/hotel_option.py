from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class HotelOption(db.Model):
    __tablename__ = "hotel_options"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = db.Column(UUID(as_uuid=True), db.ForeignKey("itineraries.id", ondelete="CASCADE"))

    hotel_name = db.Column(db.String(200))
    rating = db.Column(db.Numeric)
    location = db.Column(db.String(200))
    room_type = db.Column(db.String(150))
    price = db.Column(db.Numeric)
    inventory_status = db.Column(db.String(50))

    itinerary = db.relationship("Itinerary", backref="hotel_option")
