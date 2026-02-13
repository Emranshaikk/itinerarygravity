-- Add slug column to itineraries for SEO friendly URLs
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create an index for fast lookups by slug
CREATE INDEX IF NOT EXISTS idx_itineraries_slug ON itineraries(slug);

-- Update existing itineraries to have a slug if they don't have one
-- This is a simple fallback, better slugs will be generated on next save/creation
UPDATE itineraries 
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Ensure slugs are unique (append ID prefix if needed in practice, but for now we keep it simple)
UPDATE itineraries
SET slug = slug || '-' || substring(id::text, 1, 4)
WHERE slug IN (
    SELECT slug 
    FROM itineraries 
    GROUP BY slug 
    HAVING count(*) > 1
);
