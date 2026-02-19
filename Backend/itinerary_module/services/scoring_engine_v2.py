def cost_agent(itinerary, budget):
    total = itinerary.get("total_price", 0)
    if budget == 0:
        return 0
    return max(0, 1 - (total / budget))


def comfort_agent(itinerary):

    flight = itinerary["flight"]
    hotel = itinerary["hotel"]

    layovers = flight.get("layovers", 0)
    layover_penalty = min(layovers * 0.1, 1)

    rating = hotel.get("rating", 0)
    rating_score = rating / 5 if rating else 0

    hotel_class = hotel.get("hotel_class")
    if isinstance(hotel_class, str):
        if "5" in hotel_class:
            hotel_class_score = 1
        elif "4" in hotel_class:
            hotel_class_score = 0.8
        else:
            hotel_class_score = 0.6
    else:
        hotel_class_score = 0.7

    reviews = hotel.get("reviews", 0)
    review_score = min(reviews / 5000, 1)

    comfort = (
        (1 - layover_penalty) * 0.3 +
        rating_score * 0.3 +
        hotel_class_score * 0.2 +
        review_score * 0.2
    )

    return max(0, comfort)


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

    if not combinations:
        print("No combinations available")
        return []

    scored = []

    for combo in combinations:
        scored.append(resolution_agent(combo, budget))

    ranked = sorted(scored, key=lambda x: x["score"], reverse=True)

    print("TOP SCORES:", [r["score"] for r in ranked[:3]])

    return ranked[:3]
