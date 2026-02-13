-- Create traveler_photos table
CREATE TABLE IF NOT EXISTS traveler_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE traveler_photos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Anyone can view traveler photos" ON traveler_photos
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Buyers can upload photos for their purchased itineraries" ON traveler_photos
      FOR INSERT WITH CHECK (
        auth.uid()::text = user_id AND
        EXISTS (
          SELECT 1 FROM purchases 
          WHERE purchases.user_id = auth.uid()::text 
          AND purchases.itinerary_id = traveler_photos.itinerary_id
        )
      );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create storage bucket for traveler photos (if SQL approach is supported)
-- Note: This usually requires the storage extension to be active.
INSERT INTO storage.buckets (id, name, public)
VALUES ('traveler-photos', 'traveler-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- 1. Anyone can view photos
INSERT INTO storage.policies (name, bucket_id, definition, operation)
VALUES ('Public Access', 'traveler-photos', '(bucket_id = ''traveler-photos''::text)', 'SELECT')
ON CONFLICT DO NOTHING;

-- 2. Authenticated users can upload to this bucket
INSERT INTO storage.policies (name, bucket_id, definition, operation)
VALUES ('All Authenticated users can upload', 'traveler-photos', '(bucket_id = ''traveler-photos''::text)', 'INSERT')
ON CONFLICT DO NOTHING;
