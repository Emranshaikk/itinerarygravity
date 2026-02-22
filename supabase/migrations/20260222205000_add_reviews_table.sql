-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(itinerary_id, user_id)
);

-- RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Reviews are viewable by everyone" ON reviews
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create their own reviews" ON reviews
      FOR INSERT WITH CHECK (auth.uid()::text = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own reviews" ON reviews
      FOR UPDATE USING (auth.uid()::text = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete their own reviews" ON reviews
      FOR DELETE USING (auth.uid()::text = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
