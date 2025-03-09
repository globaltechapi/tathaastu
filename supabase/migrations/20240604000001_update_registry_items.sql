-- Add new columns to registry_items table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registry_items' AND column_name = 'platform') THEN
        ALTER TABLE registry_items ADD COLUMN platform TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registry_items' AND column_name = 'product_link') THEN
        ALTER TABLE registry_items ADD COLUMN product_link TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registry_items' AND column_name = 'variant') THEN
        ALTER TABLE registry_items ADD COLUMN variant TEXT;
    END IF;
END
$$;