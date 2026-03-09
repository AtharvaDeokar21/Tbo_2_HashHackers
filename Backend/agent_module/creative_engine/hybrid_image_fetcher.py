import os
import requests
from dotenv import load_dotenv
from creative_engine.query_builder import build_image_query
from creative_engine.image_quality_filter import is_valid_image

load_dotenv()

SERPAPI_KEY = os.getenv("SERP_API_KEY")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")


def fetch_from_serp(query):

    url = "https://serpapi.com/search.json"

    params = {
        "engine": "google_images",
        "q": query,
        "api_key": SERPAPI_KEY,
        "ijn": "0"
    }

    response = requests.get(url, params=params)
    data = response.json()
    # print("SerpAPI Response:", data)  # Debugging line

    images = data.get("images_results", [])

    for img in images:
        image_url = img.get("original")

        if image_url and is_valid_image(image_url):
            return image_url

    return None


def fetch_from_pexels(query):

    headers = {
        "Authorization": PEXELS_API_KEY
    }

    params = {
        "query": query,
        "per_page": 10
    }

    response = requests.get(
        "https://api.pexels.com/v1/search",
        headers=headers,
        params=params
    )

    data = response.json()
    # print("Pexels API Response:", data)  # Debugging line

    for photo in data.get("photos", []):
        image_url = photo["src"]["large"]

        if is_valid_image(image_url):
            return image_url

    return None


def fetch_best_image(context):

    query = build_image_query(context)

    # Try Serp first
    image_url = fetch_from_serp(query)

    if image_url:
        return image_url

    # Fallback to Pexels
    image_url = fetch_from_pexels(query)

    return image_url