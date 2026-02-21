import json
from core.redis_client import get_redis

QUEUE_NAME = "event_queue"

def push_job(job_type, payload):
    r = get_redis()
    job = {
        "type": job_type,
        "payload": payload
    }
    r.rpush(QUEUE_NAME, json.dumps(job))


def pop_job(block=True):
    r = get_redis()

    if block:
        result = r.blpop(QUEUE_NAME, timeout=5)
        if result:
            _, job = result
            return json.loads(job)
        return None
    else:
        job = r.lpop(QUEUE_NAME)
        if job:
            return json.loads(job)
        return None
