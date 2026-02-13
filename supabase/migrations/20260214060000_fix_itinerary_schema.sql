-- Migration to fix missing columns in itineraries table and reload schema cache
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}'::jsonb;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS difficulty_level TEXT;

-- Trigger a schema cache reload by adding a dummy comment
COMMENT ON TABLE itineraries IS 'Travel itineraries for the platform';

-- Ensure these columns exist as they are used in the application ranking logic
-- and detailed views.
