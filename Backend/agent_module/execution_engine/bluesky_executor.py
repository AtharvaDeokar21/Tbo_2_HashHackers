from concurrent.futures import ThreadPoolExecutor, as_completed
from trend_engine.hybrid_trend_service import update_demand_signal
from targeting_engine.targeting_service import get_top_targets
from creative_engine.creative_orchestrator import build_creative
from execution_engine.bluesky_service import post_to_bluesky
from execution_engine.bluesky_content_generator import generate_bluesky_caption
import requests
import tempfile


def process_single_destination(destination):

    result = {
        "destination": destination,
        "post_uri": None,
        "caption": None,
        "image_url": None,
        "error": None
    }

    try:
        trend_data = update_demand_signal(destination)
        targets = get_top_targets(destination)

        segment = targets[0]["segment"] if targets else "General"

        # Generate caption
        caption = generate_bluesky_caption(
            destination,
            trend_data["final_score"],
            segment
        )

        result["caption"] = caption

        # Generate image
        creative_context = {
            "destination": destination,
            "segment": segment,
            "urgency": "48_hours" if trend_data["final_score"] > 0.6 else "Limited Period",
            "trend_score": trend_data["final_score"]
        }

        image_url = build_creative(creative_context)
        result["image_url"] = image_url

        # Download image temporarily
        response = requests.get(image_url)
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        temp_file.write(response.content)
        temp_file.close()

        # Post to Bluesky
        post = post_to_bluesky(caption, temp_file.name)

        result["post_uri"] = post["uri"]

    except Exception as e:
        result["error"] = str(e)

    return result


def execute_bluesky_posting(destinations):

    results = []

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(process_single_destination, d): d
            for d in destinations
        }

        for future in as_completed(futures):
            results.append(future.result())

    return {
        "total": len(destinations),
        "results": results
    }