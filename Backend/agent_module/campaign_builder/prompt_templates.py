def build_campaign_prompt(data, itinerary_info=None, customer_insights=None):

    prompt = f"""
You are an expert travel growth strategist.

Generate a structured campaign strategy for:

Destination: {data['destination']}
Trend Score: {data['trend_score']}
Urgency Window: {data['urgency']}
Target Segment: {data['segment']}
Margin Strength: {data['margin_score']}

Return structured JSON with:

1. campaign_identity (string)  
   - This must be ONLY the campaign title. 
   - Do NOT return an object.
   - Do NOT include tagline, objective, KPIs, or any nested fields.
2. positioning_angle
3. emotional_hook
4. customer_psychology_insight
5. value_proposition_stack (array)
6. urgency_message
7. offer_structure (object)
8. 7_day_plan (array of 7 objects with: day, format, caption, cta)
9. content_themes (array)
10. recommended_channels (array)
11. tone_guidelines
12. conversion_triggers (array)
13. retargeting_strategy
14. agent_notes

15. simple_agent_playbook

This field is for travel agents with little marketing knowledge.
Explain the campaign in **very simple language** so a basic agent can execute it.

Structure it as:

simple_agent_playbook:
{{
  "campaign_summary": "...simple explanation of the campaign idea...",
  "who_to_target": "...which customers to focus on...",
  "how_to_pitch": "...how the agent should talk to customers...",
  "daily_actions": [
      "Day 1: ...simple step...",
      "Day 2: ...simple step...",
      "Day 3: ...simple step...",
      "Day 4: ...simple step...",
      "Day 5: ...simple step...",
      "Day 6: ...simple step...",
      "Day 7: ...simple step..."
  ],
  "quick_sales_tips": [
      "...easy persuasion tip...",
      "...how to handle hesitation...",
      "...how to close booking..."
  ]
}}

Return ONLY valid JSON.
Do not include explanation.
Do not include markdown.
Do not include backticks.
"""

    return prompt