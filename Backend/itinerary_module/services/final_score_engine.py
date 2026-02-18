from models.itinerary import Itinerary
from database import db

def update_final_score(itinerary_id):

    itinerary = Itinerary.query.get(itinerary_id)

    cost = float(itinerary.cost_score or 0)
    comfort = float(itinerary.comfort_score or 0)
    risk = float(itinerary.risk_score or 0)
    margin = float(itinerary.margin_score or 0)

    final_score = (
        0.35 * cost +
        0.30 * comfort +
        0.20 * risk +
        0.15 * margin
    )

    itinerary.final_score = final_score
    itinerary.confidence_score = min(final_score + 0.1, 1)

    db.session.commit()

    return final_score
