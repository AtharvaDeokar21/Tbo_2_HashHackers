from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey("customers.id", ondelete="CASCADE"))
    origin = db.Column(db.String(10))
    destination = db.Column(db.String(100))
    departure_date = db.Column(db.Date)
    return_date = db.Column(db.Date)
    duration_days = db.Column(db.Integer)
    budget = db.Column(db.Numeric)
    travel_style = db.Column(db.String(100))
    status = db.Column(db.String(50), default="planning")
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    customer = db.relationship("Customer", backref="trips")
