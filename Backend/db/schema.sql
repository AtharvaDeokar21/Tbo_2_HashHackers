CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    agency_name VARCHAR(200),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    name VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(20),
    source_city VARCHAR(100),
    budget_range VARCHAR(50),
    risk_preference VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    origin VARCHAR(10),
    destination VARCHAR(100),
    departure_date DATE,
    return_date DATE,
    duration_days INT,
    budget NUMERIC,
    travel_style VARCHAR(100),
    status VARCHAR(50) DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    total_price NUMERIC,
    cost_score NUMERIC,
    comfort_score NUMERIC,
    risk_score NUMERIC,
    margin_score NUMERIC,
    final_score NUMERIC,
    confidence_score NUMERIC,
    risk_level VARCHAR(50),
    margin_band VARCHAR(50),
    tradeoff_summary TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE flight_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    airline VARCHAR(100),
    flight_number VARCHAR(50),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    layover_minutes INT,
    price NUMERIC,
    volatility_indicator VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hotel_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    hotel_name VARCHAR(200),
    rating NUMERIC,
    location VARCHAR(200),
    room_type VARCHAR(150),
    price NUMERIC,
    inventory_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE margin_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    base_cost NUMERIC,
    markup NUMERIC,
    commission_percent NUMERIC,
    net_margin NUMERIC,
    margin_band VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE risk_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    fare_volatility_score NUMERIC,
    connection_risk_score NUMERIC,
    inventory_risk_score NUMERIC,
    overall_risk_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    destination VARCHAR(100),
    trend_score NUMERIC,
    confidence_score NUMERIC,
    momentum_indicator VARCHAR(50),
    campaign_status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50),
    entity_id UUID,
    event_type VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
