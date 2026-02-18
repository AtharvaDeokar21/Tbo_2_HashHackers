from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = db.Column(UUID(as_uuid=True), db.ForeignKey("agents.id", ondelete="CASCADE"))
    name = db.Column(db.String(150))
    email = db.Column(db.String(150))
    phone = db.Column(db.String(20))
    source_city = db.Column(db.String(100))
    budget_range = db.Column(db.String(50))
    risk_preference = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    agent = db.relationship("Agent", backref="customers")
