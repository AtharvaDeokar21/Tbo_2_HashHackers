def score_itinerary(itinerary, budget):
    cost_score = max(0, 1 - (itinerary["total_price"] / budget))
    
    comfort_score = (
        (1 - itinerary["flight"]["layovers"] * 0.1) +
        (itinerary["hotel"]["rating"] / 5)
    ) / 2

    risk_score = 1 - (itinerary["flight"]["layovers"] * 0.1)

    final_score = (
        0.4 * cost_score +
        0.4 * comfort_score +
        0.2 * risk_score
    )

    return final_score

def rank_itineraries(combinations, budget):
    scored = []

    for combo in combinations:
        score = score_itinerary(combo, budget)
        combo["score"] = score
        scored.append(combo)

    ranked = sorted(scored, key=lambda x: x["score"], reverse=True)

    return ranked[:3]
