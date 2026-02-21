import psycopg2
import os
import json
from dotenv import load_dotenv

from campaign_builder.content_generator import generate_campaign_content
from creative_engine.creative_orchestrator import build_creative

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def build_campaign_package(trend_data, targeting_data):

    segment = targeting_data[0]["segment"] if targeting_data else "General"

    urgency = "48_hours" if trend_data["final_score"] > 0.6 else "7_days"

    # 🔥 Generate Strategic Blueprint (NEW CORE)
    campaign_blueprint = generate_campaign_content({
        "destination": trend_data["destination"],
        "trend_score": trend_data["final_score"],
        "urgency": urgency,
        "segment": segment,
        "margin_score": trend_data.get("business", 0.5)
    })

    # 🔥 Generate Creative Image using blueprint positioning
    creative_context = {
        "destination": trend_data["destination"],
        "segment": segment,
        "urgency": urgency,
        "trend_score": trend_data["final_score"],
        "positioning": campaign_blueprint.get("positioning_angle", "")
    }

    image_url = build_creative(creative_context)

    # 🔥 Save Campaign with Blueprint
    campaign_id = save_campaign(trend_data, campaign_blueprint)

    # 🔥 Save Creative Asset Only
    save_assets(campaign_id, image_url)

    return {
        "campaign_blueprint": campaign_blueprint,
        "image_url": image_url
    }


# ----------------------------------------------------------
# SAVE CAMPAIGN
# ----------------------------------------------------------

def save_campaign(trend_data, campaign_blueprint):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO campaigns (
            agent_id,
            destination,
            trend_score,
            confidence_score,
            momentum_indicator,
            campaign_status,
            campaign_blueprint
        )
        VALUES (%s, %s, %s, %s, %s, 'draft', %s)
        RETURNING id
    """, (
        trend_data["agent_id"],
        trend_data["destination"],
        trend_data["final_score"],
        trend_data["final_score"],
        "Rising",
        json.dumps(campaign_blueprint)
    ))

    campaign_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return campaign_id


# ----------------------------------------------------------
# SAVE ASSETS (Simplified)
# ----------------------------------------------------------

def save_assets(campaign_id, image_url):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO campaign_assets
        (campaign_id, asset_type, platform, image_url)
        VALUES (%s, %s, %s, %s)
    """, (
        campaign_id,
        "creative_image",
        "instagram",
        image_url
    ))

    conn.commit()
    cur.close()
    conn.close()