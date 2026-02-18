from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class PriceHistory(db.Model):
    __tablename__ = "price_history"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    itinerary_id = db.Column(UUID(as_uuid=True), db.ForeignKey("itineraries.id", ondelete="CASCADE"))

    flight_price = db.Column(db.Numeric)
    hotel_price = db.Column(db.Numeric)
    total_price = db.Column(db.Numeric)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    itinerary = db.relationship("Itinerary", backref="price_history")
