-- Add priority support fields to itineraries
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS has_priority_support BOOLEAN DEFAULT false;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS priority_support_price DECIMAL(10,2) DEFAULT 0;

-- Create itinerary_chats table
CREATE TABLE IF NOT EXISTS itinerary_chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    buyer_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    creator_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    messages_remaining INTEGER DEFAULT 3,
    status TEXT DEFAULT 'active', -- 'active', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create itinerary_messages table
CREATE TABLE IF NOT EXISTS itinerary_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES itinerary_chats(id) ON DELETE CASCADE,
    sender_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE itinerary_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_messages ENABLE ROW LEVEL SECURITY;

-- Policies for itinerary_chats
DO $$ BEGIN
    CREATE POLICY "Users can view their own chats" ON itinerary_chats
        FOR SELECT USING (auth.uid()::text = buyer_id OR auth.uid()::text = creator_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Policies for itinerary_messages
DO $$ BEGIN
    CREATE POLICY "Users can view messages in their chats" ON itinerary_messages
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM itinerary_chats 
                WHERE itinerary_chats.id = chat_id 
                AND (itinerary_chats.buyer_id = auth.uid()::text OR itinerary_chats.creator_id = auth.uid()::text)
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can send messages to their active chats" ON itinerary_messages
        FOR INSERT WITH CHECK (
            EXISTS (
                SELECT 1 FROM itinerary_chats 
                WHERE itinerary_chats.id = chat_id 
                AND (itinerary_chats.buyer_id = auth.uid()::text OR itinerary_chats.creator_id = auth.uid()::text)
                AND itinerary_chats.status = 'active'
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
