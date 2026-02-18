def risk_perspective(itinerary):

    risk_score = itinerary.get("risk_score", 0)
    total_price = itinerary.get("total_price", 0)

    if risk_score < 0.4:
        stance = "High operational risk"
        reasoning = "Multiple layovers or volatile pricing detected."
    elif risk_score < 0.7:
        stance = "Moderate risk"
        reasoning = "Acceptable volatility with some connection sensitivity."
    else:
        stance = "Low risk"
        reasoning = "Stable pricing and low connection risk."

    return {
        "agent": "RiskAgent",
        "stance": stance,
        "reasoning": reasoning,
        "score": risk_score
    }

def value_perspective(itinerary):

    margin_score = itinerary.get("margin_score", 0)
    total_price = itinerary.get("total_price", 0)

    if margin_score > 0.8:
        stance = "Strong profitability"
        reasoning = "High markup and commission alignment."
    elif margin_score > 0.5:
        stance = "Balanced profitability"
        reasoning = "Healthy margin without overpricing."
    else:
        stance = "Low profitability"
        reasoning = "Limited margin potential."

    return {
        "agent": "ValueAgent",
        "stance": stance,
        "reasoning": reasoning,
        "score": margin_score
    }

def resolution_agent_debate(risk_view, value_view):

    if risk_view["score"] < 0.4:
        decision = "Flag for caution"
        explanation = "RiskAgent signals operational concern despite value."
    elif value_view["score"] > 0.7:
        decision = "Recommend"
        explanation = "ValueAgent confidence outweighs moderate risk."
    else:
        decision = "Conditional Recommend"
        explanation = "Balanced risk and profitability profile."

    return {
        "final_decision": decision,
        "explanation": explanation
    }

def run_multi_agent_decision(itinerary):

    risk_view = risk_perspective(itinerary)
    value_view = value_perspective(itinerary)

    resolution = resolution_agent_debate(risk_view, value_view)

    return {
        "risk_view": risk_view,
        "value_view": value_view,
        "resolution": resolution
    }
