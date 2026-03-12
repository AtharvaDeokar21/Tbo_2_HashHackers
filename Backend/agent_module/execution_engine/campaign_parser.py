def extract_call_brief(request_data):

    blueprint = request_data.get("campaign_blueprint", {})
    offer = blueprint.get("offer_structure", {})

    call_brief = {
        "destination": request_data.get("destination"),
        "discount": offer.get("discount_percent"),
        "price": offer.get("final_price_usd"),
        "bonus": offer.get("bonus_includes"),
        "urgency": blueprint.get("urgency_message"),
        "pitch": blueprint.get("positioning_angle"),
        "value_props": blueprint.get("value_proposition_stack", [])
    }

    return call_brief