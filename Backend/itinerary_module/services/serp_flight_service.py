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

    try:
        response = requests.get(url, params=params, timeout=15)
        data = response.json()
    except Exception as e:
        print("Flight API error:", e)
        return []

    flights = []

    results = data.get("best_flights") or data.get("other_flights") or []

    for result in results:

        flights_data = result.get("flights", [])

        if not flights_data:
            continue

        # Count layovers safely
        layovers = max(len(flights_data) - 1, 0)

        price = result.get("price")

        # Sometimes price is string like "₹45,000"
        if isinstance(price, str):
            price = price.replace("₹", "").replace(",", "").strip()
            try:
                price = float(price)
            except:
                price = 0

        flights.append({
            "airline": flights_data[0].get("airline"),
            "price": price or 0,
            "duration": result.get("total_duration", 0),
            "layovers": layovers
        })

    print("FLIGHTS FINAL:", flights[:3])

    return flights[:10]
