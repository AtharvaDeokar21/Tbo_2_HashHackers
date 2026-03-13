from trend_engine.travel_news_service import get_travel_news
from trend_engine.trending_destinations import get_trending_destinations


def build_agent_dashboard():

    news = get_travel_news()
    destinations = get_trending_destinations()

    return {
        "travel_news": news,
        "trending_destinations": destinations,
    }