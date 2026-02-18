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

    response = requests.get(url, params=params, timeout=15)
    data = response.json()

    hotels = []

    for property in data.get("properties", []):
        price = 0

        # Case 1: Standard hotels
        if property.get("rate_per_night"):
            price = property["rate_per_night"].get("extracted_lowest", 0)

        # Case 2: extracted_price exists
        elif property.get("extracted_price"):
            price = property.get("extracted_price", 0)

        hotels.append({
            "name": property.get("name"),
            "price": price,
            "rating": property.get("overall_rating", 0)
        })

    print("HOTELS FINAL:", hotels[:3])

    return hotels[:10]
