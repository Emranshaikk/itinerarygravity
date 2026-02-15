-- Migration to add currency column to itineraries table
-- This fixes the "Could not find the 'currency' column" error

ALTER TABLE itineraries 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

COMMENT ON COLUMN itineraries.currency IS 'Currency code for the itinerary price (e.g., USD, EUR, INR)';

-- Update the schema cache
COMMENT ON TABLE itineraries IS 'Travel itineraries for the platform - updated with currency column';
