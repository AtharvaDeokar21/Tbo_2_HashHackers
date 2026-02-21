import requests
import os

SERP_API_KEY = os.getenv("SERP_API_KEY")


def normalize(value):
    return max(min(value, 1), 0)


def google_trend_signal(destination):
    params = {
        "engine": "google_trends",
        "q": destination,
        "data_type": "TIMESERIES",
        "api_key": SERP_API_KEY
    }

    try:
        res = requests.get("https://serpapi.com/search", params=params, timeout=5)
        data = res.json()

        values = data.get("interest_over_time", {}).get("timeline_data", [])

        if not values:
            return 0.3

        latest = values[-1]["values"][0]["value"]

        return normalize(latest / 100)

    except:
        return 0.3


def ad_activity_signal(destination):
    params = {
        "engine": "google",
        "q": f"{destination} holiday package ad",
        "api_key": SERP_API_KEY
    }

    try:
        res = requests.get("https://serpapi.com/search", params=params, timeout=5)
        data = res.json()

        ads = data.get("ads", [])
        return normalize(len(ads) / 10)

    except:
        return 0.2


def related_query_signal(destination):
    params = {
        "engine": "google",
        "q": f"{destination} packages",
        "api_key": SERP_API_KEY
    }

    try:
        res = requests.get("https://serpapi.com/search", params=params, timeout=5)
        data = res.json()

        related = data.get("related_searches", [])
        return normalize(len(related) / 20)

    except:
        return 0.2
