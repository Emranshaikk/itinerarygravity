-- PROFILES TABLE (linked to Clerk userId)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- Clerk User ID
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'buyer', -- 'buyer', 'influencer', 'admin'
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ITINERARIES TABLE
CREATE TABLE itineraries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id TEXT REFERENCES profiles(id),
  title TEXT NOT NULL,
  location TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  refund_policy TEXT,
  is_published BOOLEAN DEFAULT false,
  image_url TEXT,
  content JSONB DEFAULT '{}'::jsonb, -- NEW: Stores all detailed days, logistics, safety info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PURCHASES TABLE
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id),
  itinerary_id UUID REFERENCES itineraries(id),
  amount DECIMAL(10,2) NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) - Basic Example
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Allow users to read all itineraries
CREATE POLICY "Public itineraries are viewable by everyone" ON itineraries
  FOR SELECT USING (true);

-- Allow creators to manage their own itineraries
CREATE POLICY "Users can manage their own itineraries" ON itineraries
  FOR ALL USING (auth.uid()::text = creator_id);
