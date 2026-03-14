from serpapi import GoogleSearch
import os

SERP_API_KEY = os.getenv("SERP_API_KEY")


POPULAR_DESTINATIONS = [
    "Dubai",
    "Bali",
    "Thailand",
    "Japan",
    "Switzerland",
    "Maldives",
    "Vietnam",
    "Turkey"
]


def get_trending_destinations():

    destinations = []

    for place in POPULAR_DESTINATIONS:

        params = {
            "engine": "google_images",
            "q": f"{place} travel destination tourism",
            "api_key": SERP_API_KEY
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        image = None

        if results.get("images_results"):
            image = results["images_results"][0]["original"]

        destinations.append({
            "destination": place,
            "description": f"Trending international travel destination with high tourism demand.",
            "image": image
        })

    return destinations