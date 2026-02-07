-- Phase 2 Schema Updates: Reviews, Ratings, and Analytics

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(itinerary_id, user_id) -- One review per user per itinerary
);

-- Add average rating and review count to itineraries
ALTER TABLE itineraries
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS duration_days INTEGER,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging'));

-- ANALYTICS TABLE (for tracking views, purchases, etc.)
CREATE TABLE IF NOT EXISTS itinerary_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  views_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(itinerary_id)
);

-- NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_verification_updates BOOLEAN DEFAULT true,
  email_purchase_confirmations BOOLEAN DEFAULT true,
  email_new_reviews BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security for Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Users can create reviews for itineraries they purchased
CREATE POLICY "Users can create reviews for purchased itineraries" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid()::text = user_id AND
    EXISTS (
      SELECT 1 FROM purchases 
      WHERE purchases.user_id = auth.uid()::text 
      AND purchases.itinerary_id = reviews.itinerary_id
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid()::text = user_id);

-- Row Level Security for Analytics
ALTER TABLE itinerary_analytics ENABLE ROW LEVEL SECURITY;

-- Creators can view analytics for their own itineraries
CREATE POLICY "Creators can view their itinerary analytics" ON itinerary_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = itinerary_analytics.itinerary_id 
      AND itineraries.creator_id = auth.uid()::text
    )
  );

-- Admins can view all analytics
CREATE POLICY "Admins can view all analytics" ON itinerary_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid()::text 
      AND profiles.role = 'admin'
    )
  );

-- Function to update itinerary rating when a review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_itinerary_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE itineraries
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE itinerary_id = COALESCE(NEW.itinerary_id, OLD.itinerary_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE itinerary_id = COALESCE(NEW.itinerary_id, OLD.itinerary_id)
    )
  WHERE id = COALESCE(NEW.itinerary_id, OLD.itinerary_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update ratings
DROP TRIGGER IF EXISTS update_rating_on_review_change ON reviews;
CREATE TRIGGER update_rating_on_review_change
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_itinerary_rating();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_itinerary_views(itinerary_uuid UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO itinerary_analytics (itinerary_id, views_count)
  VALUES (itinerary_uuid, 1)
  ON CONFLICT (itinerary_id)
  DO UPDATE SET 
    views_count = itinerary_analytics.views_count + 1,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update purchase analytics
CREATE OR REPLACE FUNCTION update_purchase_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO itinerary_analytics (itinerary_id, purchases_count, total_revenue)
  VALUES (NEW.itinerary_id, 1, NEW.amount)
  ON CONFLICT (itinerary_id)
  DO UPDATE SET 
    purchases_count = itinerary_analytics.purchases_count + 1,
    total_revenue = itinerary_analytics.total_revenue + NEW.amount,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update analytics on purchase
DROP TRIGGER IF EXISTS update_analytics_on_purchase ON purchases;
CREATE TRIGGER update_analytics_on_purchase
AFTER INSERT ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_purchase_analytics();
