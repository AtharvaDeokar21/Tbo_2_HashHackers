import psycopg2
import random
from faker import Faker
from datetime import datetime, timedelta
from uuid import uuid4
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")

fake = Faker()

DESTINATIONS = [
    "Bali", "Dubai", "Thailand", "Singapore",
    "Maldives", "Paris", "Tokyo", "Goa"
]

AIRPORTS = ["DEL", "BOM", "BLR", "MAA", "HYD", "PNQ", "CCU"]

def random_date_within(days=90):
    return datetime.now() - timedelta(days=random.randint(0, days))

def connect():
    return psycopg2.connect(DATABASE_URL)


# -------------------------
#  SEED AGENTS
# -------------------------
def seed_agents(conn):
    cur = conn.cursor()
    agent_ids = []

    for _ in range(9):
        agent_id = str(uuid4())
        agent_ids.append(agent_id)

        cur.execute("""
            INSERT INTO agents (id, name, email, phone, agency_name, city)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            agent_id,
            fake.name(),
            fake.unique.email(),
            fake.msisdn()[:15],
            fake.company(),
            fake.city()
        ))

    conn.commit()
    cur.close()
    return agent_ids


# -------------------------
#  SEED CUSTOMERS
# -------------------------
def random_budget_range():
    ranges = [
        "50k-1L", "1L-2L", "2L-5L", "5L-10L"
    ]
    return random.choice(ranges)

def seed_customers(conn, agent_ids):
    cur = conn.cursor()
    customer_ids = []

    for _ in range(300):
        customer_id = str(uuid4())
        customer_ids.append(customer_id)

        cur.execute("""
            INSERT INTO customers
            (id, agent_id, name, email, phone, source_city,
             budget_range, risk_preference, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            customer_id,
            random.choice(agent_ids),
            fake.name(),
            fake.unique.email(),
            fake.msisdn()[:15],
            fake.city(),
            random_budget_range(),
            random.choice(["Conservative", "Balanced", "Aggressive"]),
            random_date_within()
        ))

    conn.commit()
    cur.close()
    return customer_ids


# -------------------------
#  SEED TRIPS  (FIXED)
# -------------------------
def seed_trips(conn, customer_ids):
    cur = conn.cursor()
    trip_ids = []

    for _ in range(600):
        trip_id = str(uuid4())
        trip_ids.append(trip_id)

        departure = random_date_within()
        return_date = departure + timedelta(days=random.randint(3, 10))

        origin_airport = random.choice(AIRPORTS)
        destination_airport = random.choice(AIRPORTS)
        destination_city = random.choice(DESTINATIONS)

        cur.execute("""
            INSERT INTO trips
            (id, customer_id, origin_airport, destination_airport,
             destination_city, departure_date, return_date,
             duration_days, budget, travel_style, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            trip_id,
            random.choice(customer_ids),
            origin_airport,
            destination_airport,
            destination_city,
            departure,
            return_date,
            (return_date - departure).days,
            random.randint(50000, 300000),
            random.choice(["Luxury", "Budget", "Family"]),
            random_date_within()
        ))

    conn.commit()
    cur.close()
    return trip_ids


# -------------------------
#  SEED ITINERARIES
# -------------------------
def seed_itineraries(conn, trip_ids):
    cur = conn.cursor()
    itinerary_ids = []

    for trip_id in trip_ids:
        for _ in range(2):  # 2 itineraries per trip
            itinerary_id = str(uuid4())
            itinerary_ids.append(itinerary_id)

            cur.execute("""
                INSERT INTO itineraries
                (id, trip_id, total_price, cost_score, comfort_score,
                 risk_score, margin_score, final_score, confidence_score,
                 risk_level, margin_band, tradeoff_summary, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s)
            """, (
                itinerary_id,
                trip_id,
                random.randint(60000, 400000),
                random.random(),
                random.random(),
                random.random(),
                random.random(),
                random.random(),
                random.random(),
                random.choice(["Low", "Medium", "High"]),
                random.choice(["Low", "Medium", "High"]),
                "Auto-generated tradeoff summary",
                random_date_within()
            ))

    conn.commit()
    cur.close()
    return itinerary_ids


# -------------------------
#  SEED ENGAGEMENT
# -------------------------
def seed_engagement(conn, customer_ids, itinerary_ids):
    cur = conn.cursor()

    for _ in range(1000):
        cur.execute("""
            INSERT INTO customer_engagement
            (customer_id, itinerary_id, viewed_at, saved_at,
             inquiry_sent, abandoned_at, last_contacted_at,
             engagement_score, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            random.choice(customer_ids),
            random.choice(itinerary_ids),
            random_date_within(),
            random_date_within(),
            random.choice([True, False]),
            None,
            random_date_within(),
            random.random(),
            random_date_within()
        ))

    conn.commit()
    cur.close()


# -------------------------
#  SEED MARGIN & RISK
# -------------------------
def seed_margin_and_risk(conn, itinerary_ids):
    cur = conn.cursor()

    for itinerary_id in itinerary_ids:
        cur.execute("""
            INSERT INTO margin_snapshots
            (itinerary_id, base_cost, markup,
             commission_percent, net_margin, margin_band)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            itinerary_id,
            random.randint(30000, 200000),
            random.randint(5000, 40000),
            random.uniform(5, 20),
            random.uniform(0.2, 0.8),
            random.choice(["Low", "Medium", "High"])
        ))

        cur.execute("""
            INSERT INTO risk_snapshots
            (itinerary_id, fare_volatility_score,
             connection_risk_score, inventory_risk_score,
             overall_risk_level)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            itinerary_id,
            random.random(),
            random.random(),
            random.random(),
            random.choice(["Low", "Medium", "High"])
        ))

    conn.commit()
    cur.close()


# -------------------------
#  MAIN
# -------------------------
def main():
    conn = connect()

    print("Seeding agents...")
    agent_ids = seed_agents(conn)

    print("Seeding customers...")
    customer_ids = seed_customers(conn, agent_ids)

    print("Seeding trips...")
    trip_ids = seed_trips(conn, customer_ids)

    print("Seeding itineraries...")
    itinerary_ids = seed_itineraries(conn, trip_ids)

    print("Seeding engagement...")
    seed_engagement(conn, customer_ids, itinerary_ids)

    print("Seeding margin & risk snapshots...")
    seed_margin_and_risk(conn, itinerary_ids)

    conn.close()

    print("Database seeded successfully!")

if __name__ == "__main__":
    main()