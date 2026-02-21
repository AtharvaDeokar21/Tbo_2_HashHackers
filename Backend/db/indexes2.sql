-- Campaign lookups
CREATE INDEX IF NOT EXISTS idx_campaign_agent_id
ON campaigns(agent_id);

CREATE INDEX IF NOT EXISTS idx_campaign_destination
ON campaigns(destination);

CREATE INDEX IF NOT EXISTS idx_campaign_status
ON campaigns(campaign_status);

-- Campaign assets
CREATE INDEX IF NOT EXISTS idx_campaign_assets_campaign_id
ON campaign_assets(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_assets_platform
ON campaign_assets(platform);

-- Customer engagement
CREATE INDEX IF NOT EXISTS idx_customer_engagement_customer_id
ON customer_engagement(customer_id);

CREATE INDEX IF NOT EXISTS idx_customer_engagement_itinerary_id
ON customer_engagement(itinerary_id);

CREATE INDEX IF NOT EXISTS idx_customer_engagement_last_contacted
ON customer_engagement(last_contacted_at);

-- RFM scoring
CREATE INDEX IF NOT EXISTS idx_rfm_customer_id
ON customer_rfm_scores(customer_id);

-- Demand signals
CREATE INDEX IF NOT EXISTS idx_demand_destination
ON demand_signals(destination);

CREATE INDEX IF NOT EXISTS idx_demand_updated_at
ON demand_signals(updated_at);

-- Communication logs
CREATE INDEX IF NOT EXISTS idx_communication_customer
ON communication_logs(customer_id);

CREATE INDEX IF NOT EXISTS idx_communication_channel
ON communication_logs(channel);
