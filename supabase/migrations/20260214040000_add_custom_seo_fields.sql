-- Add custom SEO fields to itineraries
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Initialize them with NULL so our logic falls back to defaults, 
-- or we could pre-fill them if we wanted to.
