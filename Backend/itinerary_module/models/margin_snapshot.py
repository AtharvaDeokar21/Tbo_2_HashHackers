from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class MarginSnapshot(db.Model):
    __tablename__ = "margin_snapshots"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = db.Column(UUID(as_uuid=True), db.ForeignKey("itineraries.id", ondelete="CASCADE"))

    base_cost = db.Column(db.Numeric)
    markup = db.Column(db.Numeric)
    commission_percent = db.Column(db.Numeric)
    net_margin = db.Column(db.Numeric)
    margin_band = db.Column(db.String(50))

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    itinerary = db.relationship("Itinerary", backref="margin_snapshot")
