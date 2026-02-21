import time
from core.queue import pop_job
from events.event_bus import handle_event

def start_worker():
    print("Worker started...")

    while True:
        job = pop_job(block=True)

        if job:
            try:
                handle_event(job["type"], job["payload"])
            except Exception as e:
                print("Worker error:", e)

        time.sleep(0.1)
