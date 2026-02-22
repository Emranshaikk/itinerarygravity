-- Add Wishlists Table
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, itinerary_id)
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own wishlists" ON wishlists;
    CREATE POLICY "Users can view their own wishlists" ON wishlists
      FOR SELECT USING (auth.uid()::text = user_id);
EXCEPTION WHEN undefined_table THEN
    -- Table might not be created yet in some scenarios (though it's above)
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can insert into their own wishlists" ON wishlists;
    CREATE POLICY "Users can insert into their own wishlists" ON wishlists
      FOR INSERT WITH CHECK (auth.uid()::text = user_id);
EXCEPTION WHEN undefined_table THEN
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can delete from their own wishlists" ON wishlists;
    CREATE POLICY "Users can delete from their own wishlists" ON wishlists
      FOR DELETE USING (auth.uid()::text = user_id);
EXCEPTION WHEN undefined_table THEN
END $$;
