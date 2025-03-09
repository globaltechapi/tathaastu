-- Create brand_ambassadors table
CREATE TABLE IF NOT EXISTS brand_ambassadors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  tshirt_size TEXT NOT NULL,
  kit_status TEXT NOT NULL DEFAULT 'processing',
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE brand_ambassadors ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own ambassador data" ON brand_ambassadors;
CREATE POLICY "Users can view their own ambassador data"
  ON brand_ambassadors FOR SELECT
  USING (auth.uid() = user_id);

-- Add to realtime publication
alter publication supabase_realtime add table brand_ambassadors;
