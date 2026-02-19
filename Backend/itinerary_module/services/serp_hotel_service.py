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
        total_price = 0

        # Extract pricing safely
        if property.get("rate_per_night"):
            price = property["rate_per_night"].get("extracted_lowest", 0)

        if property.get("total_rate"):
            total_price = property["total_rate"].get("extracted_lowest", 0)

        if property.get("extracted_price"):
            price = property.get("extracted_price", price)

        hotels.append({
            "name": property.get("name"),
            "price_per_night": price,
            "total_price": total_price,
            "rating": property.get("overall_rating", 0),
            "reviews": property.get("reviews", 0),
            "hotel_class": property.get("hotel_class", None),
            "image_url": property.get("thumbnail"),
            "latitude": property.get("gps_coordinates", {}).get("latitude"),
            "longitude": property.get("gps_coordinates", {}).get("longitude"),
            "amenities": property.get("amenities", []),
            "check_in": property.get("check_in_time"),
            "check_out": property.get("check_out_time")
        })

    print("HOTELS FINAL:", hotels[:3])

    return hotels[:10]
