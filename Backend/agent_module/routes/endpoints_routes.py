from unittest import result
from execution_engine.customer_processor import fetch_customer
from execution_engine.execution_helpers import get_customer_destination
from execution_engine.calling_bulk_executor import build_call_context, execute_bulk_calling
from flask import Blueprint, request, jsonify
from execution_engine.whatsapp_bulk_executor import execute_bulk_whatsapp
from execution_engine.campaign_launch_executor import launch_campaign_generation
from trend_engine.hybrid_trend_service import update_demand_signal
from targeting_engine.targeting_service import get_top_targets
from execution_engine.bluesky_executor import execute_bluesky_posting
import psycopg2
import os
from dotenv import load_dotenv
from flask import request, Response

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

campaign_bp = Blueprint("campaign", __name__)

@campaign_bp.route("/trend/<destination>", methods=["GET"])
def get_trend(destination):

    trend_data = update_demand_signal(destination)

    return jsonify({
        "destination": destination,
        "trend_score": trend_data["final_score"],
        "raw_data": trend_data
    })

@campaign_bp.route("/targets/<destination>", methods=["GET"])
def get_targets(destination):

    targets = get_top_targets(destination)

    return jsonify({
        "destination": destination,
        "top_segments": targets
    })

@campaign_bp.route("/campaign/launch", methods=["POST"])
def launch_campaign():

    data = request.json
    agent_id = data.get("agent_id")
    destination = data.get("destination")

    if not agent_id or not destination:
        return jsonify({"error": "agent_id and destination required"}), 400

    result = launch_campaign_generation(agent_id, destination)

    return jsonify(result)

@campaign_bp.route("/campaign/<destination>", methods=["GET"])
def get_campaign(destination):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT c.id, c.trend_score, ca.image_url, ca.created_at
        FROM campaigns c
        JOIN campaign_assets ca ON c.id = ca.campaign_id
        WHERE c.destination = %s
        ORDER BY c.created_at DESC
        LIMIT 5
    """, (destination,))

    rows = cur.fetchall()

    cur.close()
    conn.close()

    campaigns = []

    for row in rows:
        campaigns.append({
            "campaign_id": row[0],
            "trend_score": float(row[1]),
            "image_url": row[2],
            "created_at": row[3]
        })

    return jsonify({
        "destination": destination,
        "campaigns": campaigns
    })

@campaign_bp.route("/campaign/blueprint/<destination>", methods=["GET"])
def get_campaign_blueprint(destination):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT campaign_blueprint
        FROM campaigns
        WHERE destination = %s
        ORDER BY created_at DESC
        LIMIT 1
    """, (destination,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": "No campaign found"}), 404

    return jsonify(row[0])

@campaign_bp.route("/campaign/full/<destination>", methods=["GET"])
def get_full_campaign(destination):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT c.trend_score,
               c.campaign_blueprint,
               ca.image_url
        FROM campaigns c
        JOIN campaign_assets ca ON c.id = ca.campaign_id
        WHERE c.destination = %s
        ORDER BY c.created_at DESC
        LIMIT 1
    """, (destination,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": "No campaign found"}), 404

    return jsonify({
        "trend_score": float(row[0]),
        "blueprint": row[1],
        "image_url": row[2]
    })

@campaign_bp.route("/campaign/list", methods=["GET"])
def list_campaigns():

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT id, destination, trend_score, created_at
        FROM campaigns
        ORDER BY created_at DESC
        LIMIT 20
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    campaigns = []

    for row in rows:
        campaigns.append({
            "campaign_id": row[0],
            "destination": row[1],
            "trend_score": float(row[2]),
            "created_at": row[3]
        })

    return jsonify({"campaigns": campaigns})

@campaign_bp.route("/execution/whatsapp", methods=["POST"])
def bulk_whatsapp():

    data = request.json
    agent_id = data.get("agent_id")
    customer_ids = data.get("customer_ids")
    city = data.get("city")

    if not agent_id or not customer_ids or not city:
        return jsonify({"error": "agent_id, customer_ids, and city required"}), 400

    result = execute_bulk_whatsapp(agent_id, customer_ids, city)

    return jsonify(result)

@campaign_bp.route("/call/context", methods=["POST"])
def eleven_context_webhook():

    customer_id = request.args.get("customer_id")

    if not customer_id:
        return jsonify({"error": "customer_id missing"}), 400

    customer = fetch_customer(customer_id)
    destination = get_customer_destination(customer_id)

    context = build_call_context(customer, destination)

    return jsonify({
        "conversation_initiation_client_data": {
            "dynamic_variables": {
                "customer_context": context
            }
        }
    })

@campaign_bp.route("/execution/calling", methods=["POST"])
def bulk_calling():

    data = request.json

    if not data:
        return jsonify({"error": "JSON body required"}), 400

    agent_id = data.get("agent_id")
    customer_ids = data.get("customer_ids")

    if not agent_id or not customer_ids:
        return jsonify({"error": "agent_id and customer_ids required"}), 400

    try:
        result = execute_bulk_calling(agent_id, customer_ids)
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": "Calling execution failed",
            "details": str(e)
        }), 500
    
@campaign_bp.route("/call/webhook", methods=["GET", "POST"])
def call_webhook():

    customer_id = request.args.get("customer_id")

    twiml = f"""
<Response>
    <Connect>
        <Stream url="wss://api.elevenlabs.io/v1/agent-stream?customer_id={customer_id}" />
    </Connect>
</Response>
"""
    return Response(twiml, mimetype="text/xml")

@campaign_bp.route("/execution/bluesky", methods=["POST"])
def bluesky_posting():

    data = request.json

    if not data or not data.get("destinations"):
        return jsonify({"error": "destinations required"}), 400

    result = execute_bluesky_posting(data["destinations"])

    return jsonify(result)