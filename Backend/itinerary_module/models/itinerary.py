from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Itinerary(db.Model):
    __tablename__ = "itineraries"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = db.Column(UUID(as_uuid=True), db.ForeignKey("trips.id", ondelete="CASCADE"))

    total_price = db.Column(db.Numeric)
    cost_score = db.Column(db.Numeric)
    comfort_score = db.Column(db.Numeric)
    risk_score = db.Column(db.Numeric)
    margin_score = db.Column(db.Numeric)
    final_score = db.Column(db.Numeric)
    confidence_score = db.Column(db.Numeric)
    risk_level = db.Column(db.String(50))
    margin_band = db.Column(db.String(50))
    tradeoff_summary = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    trip = db.relationship("Trip", backref="itineraries")
