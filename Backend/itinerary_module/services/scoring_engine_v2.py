def cost_agent(itinerary, budget):
    total = itinerary["total_price"]
    score = max(0, 1 - (total / budget))
    return score

def comfort_agent(itinerary):
    flight = itinerary["flight"]
    hotel = itinerary["hotel"]

    layover_penalty = min(flight.get("layovers", 0) * 0.1, 1)
    rating_score = hotel.get("rating", 0) / 5

    return max(0, (1 - layover_penalty + rating_score) / 2)

def risk_agent(itinerary):
    layover = itinerary["flight"].get("layovers", 0)
    return max(0, 1 - (layover * 0.15))

def margin_agent(itinerary):
    return 0.5  # placeholder until DB-based margin

def resolution_agent(itinerary, budget):

    cost_score = cost_agent(itinerary, budget)
    comfort_score = comfort_agent(itinerary)
    risk_score = risk_agent(itinerary)
    margin_score = margin_agent(itinerary)

    final_score = (
        0.35 * cost_score +
        0.30 * comfort_score +
        0.20 * risk_score +
        0.15 * margin_score
    )

    itinerary.update({
        "cost_score": cost_score,
        "comfort_score": comfort_score,
        "risk_score": risk_score,
        "margin_score": margin_score,
        "score": final_score
    })

    return itinerary

def rank_itineraries_v2(combinations, budget):

    scored = []

    for combo in combinations:
        scored.append(resolution_agent(combo, budget))

    return sorted(scored, key=lambda x: x["score"], reverse=True)[:3]
