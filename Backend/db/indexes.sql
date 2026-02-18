CREATE INDEX IF NOT EXISTS idx_itinerary_trip_id 
ON itineraries(trip_id);

CREATE INDEX IF NOT EXISTS idx_flight_itinerary_id 
ON flight_options(itinerary_id);

CREATE INDEX IF NOT EXISTS idx_hotel_itinerary_id 
ON hotel_options(itinerary_id);
