from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class TripPlan(db.Model):
    __tablename__ = "trip_plans"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = db.Column(UUID(as_uuid=True), db.ForeignKey("trips.id", ondelete="CASCADE"))
    structured_plan = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
