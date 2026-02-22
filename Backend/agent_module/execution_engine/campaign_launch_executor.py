import psycopg2
import os
import json
from dotenv import load_dotenv

from trend_engine.hybrid_trend_service import update_demand_signal
from targeting_engine.targeting_service import get_top_targets
from campaign_builder.prompt_templates import build_campaign_prompt
from campaign_builder.content_generator import generate_campaign_content
from creative_engine.creative_orchestrator import build_creative

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def launch_campaign_generation(agent_id, destination):

    print("Step 1: Updating Trend Signal...")
    trend_data = update_demand_signal(destination)

    print("Step 2: Getting Top Targets...")
    targets = get_top_targets(destination)

    segment = targets[0]["segment"] if targets else "General"
    urgency = "48_hours" if trend_data["final_score"] > 0.6 else "7_days"

    # STEP 3 — Build Prompt
    prompt = build_campaign_prompt({
        "destination": destination,
        "trend_score": trend_data["final_score"],
        "urgency": urgency,
        "segment": segment,
        "margin_score": trend_data.get("business", 0.5)
    })

    print("\n=== FINAL PROMPT ===")
    print(prompt)

    # STEP 4 — Call LLM
    raw_output = generate_campaign_content(prompt)

    print("\n=== RAW LLM OUTPUT ===")
    print(raw_output)

    try:
        campaign_blueprint = json.loads(raw_output)
    except Exception as e:
        print("JSON parsing failed:", e)
        raise Exception("Invalid JSON returned from LLM")

    # STEP 5 — Generate Creative
    creative_context = {
        "destination": destination,
        "segment": segment,
        "urgency": urgency,
        "trend_score": trend_data["final_score"],
        "positioning": campaign_blueprint.get("positioning_angle", "")
    }

    image_url = build_creative(creative_context)

    # STEP 6 — Save Campaign
    campaign_id = save_campaign(
        agent_id,
        destination,
        trend_data["final_score"],
        campaign_blueprint
    )

    # STEP 7 — Save Creative
    save_asset(campaign_id, image_url)

    print("Campaign generation completed.")

    return {
        "destination": destination,
        "trend_score": trend_data["final_score"],
        "image_url": image_url,
        "campaign_blueprint": campaign_blueprint
    }


# ----------------------------------------------------------
# SAVE CAMPAIGN
# ----------------------------------------------------------

def save_campaign(agent_id, destination, trend_score, blueprint):

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
        agent_id,
        destination,
        trend_score,
        trend_score,
        "Rising",
        json.dumps(blueprint)
    ))

    campaign_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return campaign_id


# ----------------------------------------------------------
# SAVE ASSET
# ----------------------------------------------------------

def save_asset(campaign_id, image_url):

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