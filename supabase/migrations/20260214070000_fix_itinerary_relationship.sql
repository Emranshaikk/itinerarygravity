-- Migration to explicitly fix the relationship between itineraries and profiles
-- This resolves the PGRST200 "Could not find a relationship" error

-- 1. Ensure the creator_id column exists
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS creator_id TEXT;

-- 2. Drop any existing constraint if we want to be clean (optional but safer)
ALTER TABLE itineraries DROP CONSTRAINT IF EXISTS itineraries_creator_id_fkey;

-- 3. Re-add the foreign key constraint with a clear name
ALTER TABLE itineraries
ADD CONSTRAINT itineraries_creator_id_fkey
FOREIGN KEY (creator_id) 
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 4. Create an index for faster joins
CREATE INDEX IF NOT EXISTS idx_itineraries_creator_id ON itineraries(creator_id);

-- 5. Trigger a schema cache reload
COMMENT ON TABLE itineraries IS 'Travel itineraries for the platform';
COMMENT ON TABLE profiles IS 'User profiles for buyers and creators';
