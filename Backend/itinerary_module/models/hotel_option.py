from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.dialects.postgresql import JSONB


class HotelOption(db.Model):
    __tablename__ = "hotel_options"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("itineraries.id", ondelete="CASCADE")
    )

    hotel_name = db.Column(db.String(200))
    rating = db.Column(db.Numeric)
    reviews = db.Column(db.Integer)
    hotel_class = db.Column(db.Integer)

    location = db.Column(db.String(200))
    room_type = db.Column(db.String(150))

    price = db.Column(db.Numeric)
    total_price = db.Column(db.Numeric)

    inventory_status = db.Column(db.String(50))

    image_url = db.Column(db.String(500))

    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    amenities = db.Column(JSONB)

    check_in = db.Column(db.String(50))
    check_out = db.Column(db.String(50))

    itinerary = db.relationship("Itinerary", backref="hotel_option")
