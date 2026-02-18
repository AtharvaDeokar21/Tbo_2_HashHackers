import requests
import os
from dotenv import load_dotenv
load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

def fetch_flights(origin, destination, departure_date, return_date):
    url = "https://serpapi.com/search.json"
    
    params = {
        "engine": "google_flights",
        "departure_id": origin,
        "arrival_id": destination,
        "outbound_date": departure_date,
        "return_date": return_date,
        "currency": "INR",
        "api_key": SERP_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    flights = []

    for result in data.get("best_flights", []):
        flights.append({
            "airline": result["flights"][0]["airline"],
            "price": result["price"],
            "duration": result["total_duration"],
            "layovers": result.get("layovers", 0)
        })

    return flights[:10]  # Limit for combinatorial control
