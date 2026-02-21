from ai.groq_client import generate_text
import json

def build_image_query(context):

    prompt = f"""
You are an expert in Google Images and stock photography search optimization.

Generate a HIGH-PERFORMANCE image search query for:

Destination: {context['destination']}
Segment: {context['segment']}
Trend Score: {context.get('trend_score', 0.5)}
Urgency: {context.get('urgency', 'Medium')}
Margin Band: {context.get('margin_band', 'Standard')}

Rules:
- Return ONLY a keyword string (no sentences)
- Include famous landmarks if relevant
- Include environment type (villa, skyline, desert, resort, marina, beach)
- Max 15 words
- No commas
- No full sentences

Return JSON:
{{ "query": "..." }}
"""

    response = generate_text(prompt)
    response = response.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(response)
        query = data["query"]
    except:
        query = f"{context['destination']} luxury travel"

    # Enhancement layer
    query += " high resolution landscape photography"

    if context.get("trend_score", 0) > 0.7:
        query += " trending travel destination"

    if context.get("urgency", "").lower() == "high":
        query += " dramatic sunset lighting"

    return query