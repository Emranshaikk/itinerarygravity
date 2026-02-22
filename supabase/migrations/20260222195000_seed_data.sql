-- 0. Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Fix Schema: Add missing columns if they don't exist
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS difficulty_level TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Ensure creator_id is linked to profiles
-- (This might already be done, but ensures consistency)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'itineraries_creator_id_fkey') THEN
        ALTER TABLE itineraries 
        ADD CONSTRAINT itineraries_creator_id_fkey 
        FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Seed Creators (Profiles)
-- Note: Using placeholder IDs. In a real scenario, these would be Auth IDs.
-- For local testing, we'll use these static IDs.
INSERT INTO profiles (id, full_name, username, email, role, is_verified)
VALUES 
  ('creator_a_id', 'Sarah Travels', 'sarah_travels', 'sarah@example.com', 'influencer', true),
  ('creator_b_id', 'WanderJohn', 'wander_john', 'john@example.com', 'influencer', true),
  ('creator_c_id', 'Bali Explorer', 'bali_explorer', 'bali@example.com', 'influencer', true)
ON CONFLICT (id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  is_verified = EXCLUDED.is_verified;

-- 4. Seed Itineraries
-- Creator A (Sarah): 2 Itineraries
INSERT INTO itineraries (id, creator_id, title, location, price, currency, image_url, is_published, is_approved, tags, duration_days, difficulty_level, average_rating, review_count)
VALUES 
  (gen_random_uuid(), 'creator_a_id', 'Kyoto Cultural Gems', 'Kyoto, Japan', 45.00, 'USD', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', true, true, ARRAY['Culture', 'Walking', 'Photography'], 5, 'Easy', 4.9, 124),
  (gen_random_uuid(), 'creator_a_id', 'Tokyo Street Food Guide', 'Tokyo, Japan', 29.00, 'USD', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800', true, true, ARRAY['Food', 'Nightlife', 'Urban'], 3, 'Medium', 4.8, 89)
ON CONFLICT (id) DO NOTHING;

-- Creator B (John): 1 Itinerary
INSERT INTO itineraries (id, creator_id, title, location, price, currency, image_url, is_published, is_approved, tags, duration_days, difficulty_level, average_rating, review_count)
VALUES 
  (gen_random_uuid(), 'creator_b_id', 'Paris Romantic Getaway', 'Paris, France', 55.00, 'USD', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800', true, true, ARRAY['Romance', 'Luxury', 'Art'], 4, 'Easy', 4.7, 56)
ON CONFLICT (id) DO NOTHING;

-- Creator C (Bali): 1 Itinerary
INSERT INTO itineraries (id, creator_id, title, location, price, currency, image_url, is_published, is_approved, tags, duration_days, difficulty_level, average_rating, review_count)
VALUES 
  (gen_random_uuid(), 'creator_c_id', 'Ultimate Bali Adventure', 'Bali, Indonesia', 39.00, 'USD', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800', true, true, ARRAY['Adventure', 'Nature', 'Surf'], 7, 'Hard', 4.9, 210)
ON CONFLICT (id) DO NOTHING;
