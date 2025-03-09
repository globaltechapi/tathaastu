-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create registries table
CREATE TABLE IF NOT EXISTS registries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  occasion_type TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  is_private BOOLEAN DEFAULT false,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create registry_items table
CREATE TABLE IF NOT EXISTS registry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  note TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  purchased BOOLEAN DEFAULT false,
  purchased_by UUID REFERENCES users(id),
  purchased_at TIMESTAMP WITH TIME ZONE,
  platform TEXT,
  product_link TEXT,
  variant TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create registry_views table
CREATE TABLE IF NOT EXISTS registry_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Registries table policies
ALTER TABLE registries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registries"
  ON registries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public registries"
  ON registries FOR SELECT
  USING (is_private = false);

CREATE POLICY "Users can create registries"
  ON registries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registries"
  ON registries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registries"
  ON registries FOR DELETE
  USING (auth.uid() = user_id);

-- Registry items table policies
ALTER TABLE registry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in their own registries"
  ON registry_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));

CREATE POLICY "Users can view items in public registries"
  ON registry_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.is_private = false
  ));

CREATE POLICY "Users can create items in their own registries"
  ON registry_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));

CREATE POLICY "Users can update items in their own registries"
  ON registry_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items in their own registries"
  ON registry_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));

-- Registry views table policies
ALTER TABLE registry_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view registry views for their own registries"
  ON registry_views FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_views.registry_id
    AND registries.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create registry views"
  ON registry_views FOR INSERT
  WITH CHECK (true);
