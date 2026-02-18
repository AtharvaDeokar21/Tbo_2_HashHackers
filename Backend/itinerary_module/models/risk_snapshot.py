from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class RiskSnapshot(db.Model):
    __tablename__ = "risk_snapshots"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = db.Column(UUID(as_uuid=True), db.ForeignKey("itineraries.id", ondelete="CASCADE"))

    fare_volatility_score = db.Column(db.Numeric)
    connection_risk_score = db.Column(db.Numeric)
    inventory_risk_score = db.Column(db.Numeric)
    overall_risk_level = db.Column(db.String(50))

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    itinerary = db.relationship("Itinerary", backref="risk_snapshot")
