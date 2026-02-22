from campaign_builder.content_generator import generate_text

def generate_bluesky_caption(destination, trend_score, segment):

    prompt = f"""
You are a travel marketing expert.

Create a highly engaging Bluesky post for:

Destination: {destination}
Trend Score: {trend_score}
Target Segment: {segment}

Requirements:
- Max 250 characters
- Conversational
- Emotional hook
- Include subtle urgency
- Include 2–3 relevant hashtags
- Do NOT exceed 300 characters
Return only the post text.
"""

    return generate_text(prompt, temperature=0.6)