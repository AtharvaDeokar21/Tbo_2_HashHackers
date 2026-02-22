from unittest import result

from flask import Blueprint, request, jsonify
from execution_engine.whatsapp_bulk_executor import execute_bulk_whatsapp
from execution_engine.campaign_launch_executor import launch_campaign_generation
from trend_engine.hybrid_trend_service import update_demand_signal
from targeting_engine.targeting_service import get_top_targets
import psycopg2
import os
from dotenv import load_dotenv

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

    if not agent_id or not customer_ids:
        return jsonify({"error": "agent_id and customer_ids required"}), 400

    result = execute_bulk_whatsapp(agent_id, customer_ids)

    return jsonify(result)