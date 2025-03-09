-- Ensure all required columns exist in registry_items table
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

-- Disable RLS temporarily to fix any issues
ALTER TABLE registry_items DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE registry_items ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Users can view items in their own registries" ON registry_items;
CREATE POLICY "Users can view items in their own registries"
  ON registry_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can view items in public registries" ON registry_items;
CREATE POLICY "Users can view items in public registries"
  ON registry_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.is_private = false
  ));

DROP POLICY IF EXISTS "Users can create items in their own registries" ON registry_items;
CREATE POLICY "Users can create items in their own registries"
  ON registry_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update items in their own registries" ON registry_items;
CREATE POLICY "Users can update items in their own registries"
  ON registry_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete items in their own registries" ON registry_items;
CREATE POLICY "Users can delete items in their own registries"
  ON registry_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM registries
    WHERE registries.id = registry_items.registry_id
    AND registries.user_id = auth.uid()
  ));
