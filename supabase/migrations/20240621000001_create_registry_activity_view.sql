-- First check if purchaser_name and purchaser_email columns exist, if not add them
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registry_items' AND column_name = 'purchaser_name') THEN
    ALTER TABLE registry_items ADD COLUMN purchaser_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registry_items' AND column_name = 'purchaser_email') THEN
    ALTER TABLE registry_items ADD COLUMN purchaser_email TEXT;
  END IF;
END $$;

-- Create a view to easily fetch registry activity data
CREATE VIEW registry_activity AS
SELECT 
  ri.id,
  ri.registry_id,
  ri.name AS item_name,
  ri.purchased_at,
  ri.purchased_by,
  COALESCE(ri.purchaser_name, 'Guest') AS purchaser_name,
  COALESCE(ri.purchaser_email, 'guest@example.com') AS purchaser_email,
  'purchase' AS activity_type
FROM registry_items ri
WHERE ri.purchased = true;

-- Views cannot be added to realtime publication, so we'll skip that part
