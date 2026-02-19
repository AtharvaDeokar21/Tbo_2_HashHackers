import os
from google import genai
from typing import TypedDict
from models.chat_memory import ChatMemory
from langgraph.graph import StateGraph, END
from database import db
from services.decision_agents import run_multi_agent_decision
from services.agent_tools import (
    tool_get_itinerary,
    tool_calculate_margin,
    tool_calculate_risk,
    tool_simulate
)
from services.trip_context_service import get_trip_context
from services.vector_store import retrieve_similar_context
from models.trip_plan import TripPlan

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class AgentState(TypedDict):
    question: str
    itinerary_id: str
    response: str


def agent_node(state: AgentState):

    itinerary_id = state["itinerary_id"]
    question = state["question"]

    # Retrieve semantic memory
    related_contexts = retrieve_similar_context(question)
    print("Retrieved Contexts:", related_contexts)

    trip_context = get_trip_context(itinerary_id)
    if not trip_context:
        return {"response": "Itinerary not found."}

    itinerary_data = trip_context["selected"]

    
    trip_plan = None
    if trip_context and trip_context.get("selected"):
        trip_plan_record = TripPlan.query.filter_by(
            trip_id=trip_context["selected"]["trip_id"]
        ).first()

        if trip_plan_record:
            trip_plan = trip_plan_record.structured_plan
    
    is_plan_query = any(word in question.lower() for word in [
        "day", "plan", "schedule", "activity", "itinerary for day"
    ])

    # Tool routing
    if any(word in question.lower() for word in ["what if", "upgrade", "change", "modify"]):
        simulation_result = tool_simulate(itinerary_id, {"change_type": "hotel"})
        itinerary_data["simulation_result"] = simulation_result

    if any(word in question.lower() for word in ["margin", "profit", "markup"]):
        margin = tool_calculate_margin(itinerary_id)
        itinerary_data["margin_update"] = margin

    if any(word in question.lower() for word in ["risk", "safe", "volatile", "price increase"]):
        risk = tool_calculate_risk(itinerary_id)
        itinerary_data["risk_update"] = risk

    # Retrieve chat memory
    memory = ChatMemory.query.filter_by(
        itinerary_id=itinerary_id
    ).order_by(ChatMemory.created_at.asc()).limit(3).all()

    conversation_history = ""
    for m in memory:
        conversation_history += f"{m.role}: {m.message}\n"
    debate = run_multi_agent_decision(itinerary_data)

    prompt = f"""
You are a grounded itinerary assistant.

Itinerary Data:
{itinerary_data}

Trip Context:
Selected Option:
{trip_context["selected"]}

All Available Options:
{trip_context["all_options"]}

Day-wise Trip Plan:
{trip_plan}

Related Context:
{related_contexts}

Conversation History:
{conversation_history}

Multi-Agent Debate Output:
{debate}

User Question:
{question}

Rules:
- Use itinerary data and trip plan only.
- Do NOT hallucinate.
- If risk question → explain using layover, volatility, and inventory signals.
- If margin question → explain profitability implications.
- If simulation requested → explain simulation result.
- If decision explanation requested → use multi-agent reasoning.
- If comparison requested → use trip context.
- If day-specific question → use the Day-wise Trip Plan strictly.
- Be analytical, not minimal.
- Stay factual.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    answer = response.text if hasattr(response, "text") else response.candidates[0].content.parts[0].text

    # Store conversation
    db.session.add(ChatMemory(
        itinerary_id=itinerary_id,
        role="user",
        message=question
    ))

    db.session.add(ChatMemory(
        itinerary_id=itinerary_id,
        role="assistant",
        message=answer
    ))

    db.session.commit()

    return {"response": answer}



graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.set_entry_point("agent")
graph.add_edge("agent", END)

agent_executor = graph.compile()


def run_query_bot(itinerary_id, question):

    result = agent_executor.invoke({
        "itinerary_id": itinerary_id,
        "question": question
    })

    return result["response"]
