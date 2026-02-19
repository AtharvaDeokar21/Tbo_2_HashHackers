from flask import Flask, request, jsonify
from services.margin_engine import calculate_margin
from services.risk_engine import calculate_risk
from services.final_score_engine import update_final_score
from services.intent_service import process_intent
from services.serp_flight_service import fetch_flights
from services.serp_hotel_service import fetch_hotels
# from services.combination_engine import generate_combinations
from services.combination_engine_v2 import generate_combinations_v2 as generate_combinations
from services.scoring_engine_v2 import rank_itineraries_v2 as rank_itineraries
# from services.scoring_engine import rank_itineraries
from services.itinerary_service import persist_itineraries
from services.itinerary_detail_service import get_itinerary_details
from apscheduler.schedulers.background import BackgroundScheduler
from services.price_tracker import record_price_snapshot
from services.simulation_engine import simulate_change
from services.intent_agent import extract_intent
from services.intent_service import process_intent
from services.decision_agents import run_multi_agent_decision
from services.query_bot import run_query_bot
from services.embedding_service import embed_itinerary
from services.trip_plan_generator import generate_trip_plan
from models.trip_plan import TripPlan



from config import Config
from database import db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

# Import models AFTER db init
from models.agent import Agent
from models.customer import Customer
from models.trip import Trip
from models.itinerary import Itinerary
from models.flight_option import FlightOption
from models.hotel_option import HotelOption
from models.margin_snapshot import MarginSnapshot
from models.risk_snapshot import RiskSnapshot
from models.price_history import PriceHistory

with app.app_context():
    db.create_all()

@app.route("/seed", methods=["POST"])
def seed_data():
    from models.agent import Agent
    from models.customer import Customer
    from database import db

    agent = Agent(
        name="Test Agent",
        email="agent@test.com",
        agency_name="Demo Travels",
        city="Delhi"
    )

    db.session.add(agent)
    db.session.commit()

    customer = Customer(
        agent_id=agent.id,
        name="Test Customer",
        email="customer@test.com",
        source_city="Delhi"
    )

    db.session.add(customer)
    db.session.commit()

    return {
        "agent_id": str(agent.id),
        "customer_id": str(customer.id)
    }


@app.route("/generate-itinerary", methods=["POST"])
def generate_itinerary():

    data = request.json

    try:
        structured = process_intent(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    flights = fetch_flights(
        structured["origin_airport"],
        structured["destination_airport"],
        structured["departure_date"],
        structured["return_date"]
    )

    hotels = fetch_hotels(
        structured["destination_city"],
        structured["departure_date"],
        structured["return_date"]
    )

    combinations = generate_combinations(flights, hotels)
    top_three = rank_itineraries(combinations, structured["budget"])
    print("Flights count:", len(flights))
    print("Hotels count:", len(hotels))
    print("Combinations:", len(combinations))
    print("Top 3:", len(top_three))

    saved = persist_itineraries(structured["trip_id"], top_three)
    for itinerary in saved:
        calculate_margin(itinerary.id)
        calculate_risk(itinerary.id)
        update_final_score(itinerary.id)
        embed_itinerary(itinerary.id)
    # Generate trip-level day-wise plan (only once)
    existing_plan = TripPlan.query.filter_by(trip_id=structured["trip_id"]).first()

    if not existing_plan:

        trip_details = {
            "destination_city": structured["destination_city"],
            "departure_date": structured["departure_date"],
            "return_date": structured["return_date"],
            "travel_style": structured.get("travel_style", "Standard"),
            "budget": structured["budget"],
            "risk_preference": structured.get("risk_preference", "Medium")
        }

        try:
            plan_json = generate_trip_plan(trip_details)

            trip_plan = TripPlan(
                trip_id=structured["trip_id"],
                structured_plan=plan_json
            )

            db.session.add(trip_plan)
            db.session.commit()

        except Exception as e:
            print("Trip plan generation failed:", e)
    trip_plan = TripPlan.query.filter_by(trip_id=structured["trip_id"]).first()

    return jsonify({
        "trip_id": structured["trip_id"],
        "itineraries": [
            {
                "itinerary_id": str(i.id),
                "total_price": float(i.total_price),
                "final_score": float(i.final_score),
                "confidence_score": float(i.confidence_score)
            }
            for i in saved
        ],
        "day_wise_plan": trip_plan.structured_plan if trip_plan else None
    })

@app.route("/itinerary/<uuid:itinerary_id>/decision", methods=["GET"])
def itinerary_decision(itinerary_id):

    details = get_itinerary_details(itinerary_id)

    if not details:
        return jsonify({"error": "Not found"}), 404

    result = run_multi_agent_decision(details["scores"] | details)

    return jsonify(result)


@app.route("/itinerary/<uuid:itinerary_id>", methods=["GET"])
def fetch_itinerary(itinerary_id):

    result = get_itinerary_details(itinerary_id)

    if not result:
        return jsonify({"error": "Itinerary not found"}), 404
    
    trip_plan = TripPlan.query.filter_by(trip_id=result["trip_id"]).first()

    result["day_wise_plan"] = trip_plan.structured_plan if trip_plan else None

    return jsonify(result)


@app.route("/itinerary/<uuid:itinerary_id>/simulate", methods=["POST"])
def simulate_itinerary(itinerary_id):

    payload = request.json

    result = simulate_change(itinerary_id, payload)

    if not result:
        return jsonify({"error": "Itinerary not found"}), 404

    return jsonify(result)

@app.route("/generate-itinerary-from-text", methods=["POST"])
def generate_from_text():

    data = request.json
    user_text = data.get("prompt")

    if not user_text:
        return jsonify({"error": "Prompt required"}), 400

    try:
        structured_intent = extract_intent(user_text)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # Attach customer_id manually for now
    structured_intent["customer_id"] = data.get("customer_id")

    structured = process_intent(structured_intent)

    flights = fetch_flights(
        structured["origin_airport"],
        structured["destination_airport"],
        structured["departure_date"],
        structured["return_date"]
    )

    hotels = fetch_hotels(
        structured["destination_city"],
        structured["departure_date"],
        structured["return_date"]
    )

    combinations = generate_combinations(flights, hotels, structured["budget"])
    top_three = rank_itineraries(combinations, structured["budget"])

    saved = persist_itineraries(structured["trip_id"], top_three)
    for itinerary in saved:
        calculate_margin(itinerary.id)
        calculate_risk(itinerary.id)
        update_final_score(itinerary.id)
        embed_itinerary(itinerary.id)
    # Generate trip-level day-wise plan (only once)
    existing_plan = TripPlan.query.filter_by(trip_id=structured["trip_id"]).first()

    if not existing_plan:

        trip_details = {
            "destination_city": structured["destination_city"],
            "departure_date": structured["departure_date"],
            "return_date": structured["return_date"],
            "travel_style": structured.get("travel_style", "Standard"),
            "budget": structured["budget"],
            "risk_preference": structured.get("risk_preference", "Medium")
        }

        try:
            plan_json = generate_trip_plan(trip_details)

            trip_plan = TripPlan(
                trip_id=structured["trip_id"],
                structured_plan=plan_json
            )

            db.session.add(trip_plan)
            db.session.commit()

        except Exception as e:
            print("Trip plan generation failed:", e)
    trip_plan = TripPlan.query.filter_by(trip_id=structured["trip_id"]).first()
    return jsonify({
        "trip_id": structured["trip_id"],
        "structured_intent": structured_intent,
        "itineraries": [
            {
                "itinerary_id": str(i.id),
                "total_price": float(i.total_price),
                "final_score": float(i.final_score)
            }
            for i in saved
        ],
        "day_wise_plan": trip_plan.structured_plan if trip_plan else None
    })

@app.route("/itinerary/<uuid:itinerary_id>/query", methods=["POST"])
def itinerary_query(itinerary_id):

    data = request.json
    question = data.get("question")

    if not question:
        return jsonify({"error": "Question required"}), 400

    response = run_query_bot(str(itinerary_id), question)

    return jsonify({
        "answer": response
    })


scheduler = BackgroundScheduler()

def poll_prices():
    with app.app_context():
        itineraries = Itinerary.query.all()

        for itinerary in itineraries:
            try:
                record_price_snapshot(itinerary.id)
            except Exception as e:
                print(f"Price polling failed for {itinerary.id}: {e}")

scheduler.add_job(poll_prices, "interval", minutes=15)

if __name__ == "__main__":
    scheduler.start()
    app.run(debug=True)

