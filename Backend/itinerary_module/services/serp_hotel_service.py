import requests
import os
from dotenv import load_dotenv
load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

def fetch_hotels(destination, check_in, check_out):
    url = "https://serpapi.com/search.json"

    params = {
        "engine": "google_hotels",
        "q": destination,
        "check_in_date": check_in,
        "check_out_date": check_out,
        "currency": "INR",
        "api_key": SERP_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    hotels = []

    for property in data.get("properties", []):
        hotels.append({
            "name": property["name"],
            "price": property.get("price", 0),
            "rating": property.get("overall_rating", 0)
        })

    return hotels[:10]
