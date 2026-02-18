from models.margin_snapshot import MarginSnapshot
from models.itinerary import Itinerary
from database import db

def calculate_margin(itinerary_id, markup_percent=10, commission_percent=5):

    itinerary = Itinerary.query.get(itinerary_id)
    if not itinerary:
        return None

    base_cost = float(itinerary.total_price)

    markup = base_cost * (markup_percent / 100)
    commission = base_cost * (commission_percent / 100)

    net_margin = markup + commission

    # Define margin bands
    if net_margin > base_cost * 0.15:
        margin_band = "High"
        margin_score = 1.0
    elif net_margin > base_cost * 0.08:
        margin_band = "Medium"
        margin_score = 0.7
    else:
        margin_band = "Low"
        margin_score = 0.4

    snapshot = MarginSnapshot(
        itinerary_id=itinerary.id,
        base_cost=base_cost,
        markup=markup,
        commission_percent=commission_percent,
        net_margin=net_margin,
        margin_band=margin_band
    )

    db.session.add(snapshot)

    # Update itinerary margin score
    itinerary.margin_score = margin_score
    itinerary.margin_band = margin_band

    db.session.commit()

    return {
        "net_margin": net_margin,
        "margin_band": margin_band,
        "margin_score": margin_score
    }
