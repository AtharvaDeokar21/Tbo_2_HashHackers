from pydantic import BaseModel
from typing import Optional

class StructuredIntent(BaseModel):
    origin_airport: str
    destination_airport: str
    destination_city: str
    departure_date: str
    return_date: str
    budget: float
    travel_style: Optional[str] = "Standard"
    risk_preference: Optional[str] = "Medium"

