import psycopg2
import os
from dotenv import load_dotenv
from trend_engine.hybrid_trend_service import update_demand_signal
from targeting_engine.targeting_service import get_top_targets
from campaign_builder.campaign_builder_service import build_campaign_package
from creative_engine.creative_orchestrator import build_creative

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def launch_campaign_generation(agent_id, destination):

    print("Step 1: Updating Trend Signal...")
    trend_data = update_demand_signal(destination)

    print("Step 2: Getting Top Targets...")
    targets = get_top_targets(destination)

    print("Step 3: Building Campaign Content...")
    trend_data["agent_id"] = agent_id
    campaign_content = build_campaign_package(trend_data, targets)

    print("Step 4: Generating Creative Image...")
    creative_context = {
        "destination": destination,
        "segment": targets[0]["segment"] if targets else "General",
        "urgency": "48_hours" if trend_data["final_score"] > 0.6 else "7_days",
        "trend_score": trend_data["final_score"],
        "positioning": campaign_content.get("positioning_angle", "")
    }

    image_url = build_creative(creative_context)

    print("Step 5: Storing Final Creative Asset...")

    store_final_creative(destination, image_url)

    print("Campaign generation completed.")

    return {
        "destination": destination,
        "trend_score": trend_data["final_score"],
        "image_url": image_url,
        "segment": creative_context["segment"]
    }


def store_final_creative(destination, image_url):

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Get latest campaign for that destination
    cur.execute("""
        SELECT id FROM campaigns
        WHERE destination = %s
        ORDER BY created_at DESC
        LIMIT 1
    """, (destination,))

    campaign = cur.fetchone()

    if not campaign:
        conn.close()
        return

    campaign_id = campaign[0]

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