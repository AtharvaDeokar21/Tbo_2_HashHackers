from database import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class ChatMemory(db.Model):
    __tablename__ = "chat_memory"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = db.Column(UUID(as_uuid=True))
    role = db.Column(db.String(20))  # user / assistant
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
