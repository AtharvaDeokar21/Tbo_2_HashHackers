import os
from google import genai
from typing import TypedDict
from models.chat_memory import ChatMemory
from langgraph.graph import StateGraph, END
from database import db

from services.agent_tools import (
    tool_get_itinerary,
    tool_calculate_margin,
    tool_calculate_risk,
    tool_simulate
)

from services.vector_store import retrieve_similar_context

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

    itinerary_data = tool_get_itinerary(itinerary_id)

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

    prompt = f"""
You are a grounded itinerary assistant.

Itinerary Data:
{itinerary_data}

Related Context:
{related_contexts}

Conversation History:
{conversation_history}

User Question:
{question}

Rules:
- Use itinerary data only
- Do NOT hallucinate
- If risk question → explain using layover, volatility, and inventory signals.
- Be analytical, not minimal.
- If margin question → explain margin
- If simulation requested → explain simulation result
- Stay factual
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
