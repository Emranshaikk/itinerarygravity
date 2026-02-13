-- Add is_approved to itineraries
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_itineraries_approved ON itineraries(is_approved);

-- Add fee tracking to purchases
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS creator_earnings DECIMAL(10,2) DEFAULT 0;

-- Create affiliate_products table
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  creator_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  product_url TEXT NOT NULL,
  image_url TEXT,
  price_display TEXT, -- e.g. "$45"
  category TEXT, -- 'Gear', 'Hotel', 'Insurance', 'Activity'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for affiliate products
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Affiliate products are viewable by everyone" ON affiliate_products
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Creators can manage their own affiliate products" ON affiliate_products
      FOR ALL USING (auth.uid()::text = creator_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update RLS for itineraries to restrict public view to approved ones (except for creators)
DROP POLICY IF EXISTS "Public itineraries are viewable by everyone" ON itineraries;
CREATE POLICY "Public itineraries must be approved or owned by user" ON itineraries
  FOR SELECT USING (is_approved = true OR auth.uid()::text = creator_id);
