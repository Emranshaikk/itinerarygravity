-- Simple migration to add currency column only
-- Run this in Supabase SQL Editor

ALTER TABLE itineraries 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

COMMENT ON COLUMN itineraries.currency IS 'Currency code for the itinerary price (e.g., USD, EUR, INR)';
