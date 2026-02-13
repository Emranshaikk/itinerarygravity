-- Create trip_expenses table
CREATE TABLE IF NOT EXISTS trip_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT, -- 'food', 'transport', 'hotel', 'other'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can manage their own expenses" ON trip_expenses
      FOR ALL USING (auth.uid()::text = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
