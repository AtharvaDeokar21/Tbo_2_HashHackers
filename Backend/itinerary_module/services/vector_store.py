import os
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
load_dotenv()
# Load embedding model locally (free)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("itinerary-index")
print(index.describe_index_stats())


def store_itinerary_embedding(itinerary_id, text):

    vector = embedding_model.encode(text).tolist()

    index.upsert([
        {
            "id": str(itinerary_id),
            "values": vector,
            "metadata": {
                "itinerary_id": str(itinerary_id),
                "summary": text
            }
        }
    ])


def retrieve_similar_context(query, top_k=3):

    query_vector = embedding_model.encode(query).tolist()

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )

    contexts = []
    for match in results["matches"]:
        contexts.append(match["metadata"].get("summary", ""))


    return contexts
