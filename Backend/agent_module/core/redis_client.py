import redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    raise Exception("REDIS_URL not found in .env")

redis_client = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True
)

def get_redis():
    return redis_client
