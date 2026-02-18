from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Agent(db.Model):
    __tablename__ = "agents"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    agency_name = db.Column(db.String(200))
    city = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
