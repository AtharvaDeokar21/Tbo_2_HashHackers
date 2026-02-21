import os
from dotenv import load_dotenv
from hybrid_trend_service import update_demand_signal
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
sys.path.append(BASE_DIR)

load_dotenv()

DESTINATIONS = [
    "Bali",
    "Dubai",
    "Thailand",
    "Singapore",
    "Maldives",
    "Paris",
    "Tokyo",
    "Goa"
]

for dest in DESTINATIONS:
    result = update_demand_signal(dest)
    print(f"\n===== {dest} =====")
    for k, v in result.items():
        print(f"{k}: {v}")
