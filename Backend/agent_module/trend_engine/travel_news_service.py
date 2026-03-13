from serpapi import GoogleSearch
import os

SERP_API_KEY = os.getenv("SERP_API_KEY")


def get_travel_news():

    params = {
        "engine": "google_news",
        "q": "travel tourism trends destinations",
        "api_key": SERP_API_KEY
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    news = []

    for article in results.get("news_results", [])[:3]:

        news.append({
            "title": article.get("title"),
            "source": article.get("source", {}).get("name"),
            "link": article.get("link")
        })

    return news