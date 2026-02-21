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

        legs = result.get("flights", [])
        layover_info = result.get("layovers", [])

        if not legs:
            continue

        first_leg = legs[0]
        last_leg = legs[-1]

        # Layover stats
        layover_count = len(layover_info)
        max_layover = max([l.get("duration", 0) for l in layover_info], default=0)
        overnight_layover = any(l.get("overnight") for l in layover_info)

        flights.append({
            "airline": first_leg.get("airline"),
            "flight_number": first_leg.get("flight_number"),
            "departure_airport": first_leg.get("departure_airport", {}).get("id"),
            "arrival_airport": last_leg.get("arrival_airport", {}).get("id"),
            "departure_time": first_leg.get("departure_airport", {}).get("time"),
            "arrival_time": last_leg.get("arrival_airport", {}).get("time"),
            "travel_class": first_leg.get("travel_class"),
            "aircraft": first_leg.get("airplane"),
            "legroom": first_leg.get("legroom"),
            "duration": result.get("total_duration"),
            "layovers": layover_count,
            "max_layover_minutes": max_layover,
            "overnight_layover": overnight_layover,
            "carbon_emissions": result.get("carbon_emissions", {}).get("this_flight"),
            "emission_delta_percent": result.get("carbon_emissions", {}).get("difference_percent"),
            "price": result.get("price"),
            "booking_token": result.get("booking_token")
        })

    print("FLIGHTS FINAL:", flights[:3])
    return flights[:10]

