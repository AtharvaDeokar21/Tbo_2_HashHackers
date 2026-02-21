CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS demand_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination VARCHAR(100) UNIQUE,
    booking_surge_percent NUMERIC,
    search_spike_percent NUMERIC,
    avg_price_change_percent NUMERIC,
    volatility_index NUMERIC,
    momentum_indicator VARCHAR(50),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    asset_type VARCHAR(50),
    platform VARCHAR(50) CHECK (platform IN ('instagram','facebook','google','whatsapp','email')),
    content_text TEXT,
    image_url TEXT,
    scheduled_at TIMESTAMP,
    engagement_metrics JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_engagement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP,
    saved_at TIMESTAMP,
    inquiry_sent BOOLEAN DEFAULT FALSE,
    abandoned_at TIMESTAMP,
    last_contacted_at TIMESTAMP,
    engagement_score NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_rfm_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    recency_score NUMERIC,
    frequency_score NUMERIC,
    monetary_score NUMERIC,
    segment_label VARCHAR(100),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (customer_id)
);


CREATE TABLE IF NOT EXISTS communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('whatsapp','email','call')),
    message_text TEXT,
    response_text TEXT,
    call_transcript TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
