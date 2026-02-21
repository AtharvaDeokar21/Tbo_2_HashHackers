from creative_engine.hybrid_image_fetcher import fetch_best_image
from creative_engine.layout_engine import apply_overlay
from creative_engine.visual_quality import passes_quality_check
import cloudinary.uploader
import requests
import io
import uuid
from PIL import Image
import json
from ai.groq_client import generate_text


def build_creative(context):

    # Step 1: Fetch image
    image_url = fetch_best_image(context)

    if not image_url:
        raise Exception("No valid image found")

    # Step 2: Download image
    response = requests.get(image_url)
    img = Image.open(io.BytesIO(response.content))

    # Step 3: Generate overlay copy
    overlay_prompt = f"""
You are a luxury travel marketing travel agents from TBO.

Create HIGH-END ad copy for:

Destination: {context['destination']}
Segment: {context['segment']}
Trend Score: {context['trend_score']}
Urgency: {context['urgency']}

Rules:
- Headline must be aspirational and specific
- Subtext must highlight exclusivity
- CTA must be action-oriented and premium
- Keep headline under 6 words
- Keep subtext under 14 words
- No emojis
- No generic phrases

Return JSON:
{{
  "headline": "...",
  "subtext": "...",
  "cta": "..."
}}
"""

    overlay_text = generate_text(overlay_prompt)
    overlay_text = overlay_text.replace("```json", "").replace("```", "").strip()
    overlay_data = json.loads(overlay_text)

    # Step 4: Apply overlay
    final_image = apply_overlay(
        img,
        overlay_data["headline"],
        overlay_data["subtext"],
        overlay_data["cta"]
    )

    # Step 5: Upload to Cloudinary
    img_bytes = io.BytesIO()
    final_image.save(img_bytes, format="PNG")
    img_bytes.seek(0)

    upload = cloudinary.uploader.upload(
        img_bytes,
        folder="campaign_assets",
        public_id=f"campaign_{uuid.uuid4()}",
        overwrite=True
    )

    return upload["secure_url"]