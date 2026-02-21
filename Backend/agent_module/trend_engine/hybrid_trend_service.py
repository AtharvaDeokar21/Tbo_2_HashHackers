from trend_engine.internal_signals import (
    search_spike,
    engagement_spike,
    business_viability,
    customer_behavior_boost
)
from trend_engine.external_signals import (
    google_trend_signal,
    ad_activity_signal,
    related_query_signal
)
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")



def compute_hybrid_trend(destination):

    internal_search = search_spike(destination)
    engagement = engagement_spike(destination)
    business = business_viability(destination)
    customer_boost = customer_behavior_boost(destination)

    google_trend = google_trend_signal(destination)
    ad_signal = ad_activity_signal(destination)
    related_signal = related_query_signal(destination)

    final_score = (
        0.35 * internal_search +
        0.20 * engagement +
        0.15 * business +
        0.10 * customer_boost +
        0.10 * google_trend +
        0.05 * ad_signal +
        0.05 * related_signal
    )

    return {
        "destination": destination,
        "internal_search": internal_search,
        "engagement": engagement,
        "business": business,
        "customer_boost": customer_boost,
        "google_trend": google_trend,
        "ad_signal": ad_signal,
        "related_signal": related_signal,
        "final_score": round(final_score, 3)
    }


def update_demand_signal(destination):

    data = compute_hybrid_trend(destination)

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Check if destination exists
    cur.execute("""
        SELECT id FROM demand_signals
        WHERE destination = %s
        ORDER BY updated_at DESC
        LIMIT 1
    """, (destination,))

    existing = cur.fetchone()

    if existing:
        # Update latest record
        cur.execute("""
            UPDATE demand_signals
            SET booking_surge_percent = %s,
                search_spike_percent = %s,
                volatility_index = %s,
                momentum_indicator = %s,
                updated_at = NOW()
            WHERE id = %s
        """, (
            data["internal_search"],
            data["engagement"],
            data["google_trend"],
            "Rising" if data["final_score"] > 0.6 else "Stable",
            existing[0]
        ))
    else:
        # Insert new record
        cur.execute("""
            INSERT INTO demand_signals
            (destination,
             booking_surge_percent,
             search_spike_percent,
             avg_price_change_percent,
             volatility_index,
             momentum_indicator,
             updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """, (
            destination,
            data["internal_search"],
            data["engagement"],
            data["business"],
            data["google_trend"],
            "Rising" if data["final_score"] > 0.6 else "Stable"
        ))

    conn.commit()
    cur.close()
    conn.close()

    return data
