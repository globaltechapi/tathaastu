-- Add purchaser_name and purchaser_email columns to registry_items table
ALTER TABLE registry_items
ADD COLUMN purchaser_name TEXT,
ADD COLUMN purchaser_email TEXT;

-- Update the markItemAsPurchased function to store purchaser details
CREATE OR REPLACE FUNCTION mark_item_as_purchased(
  item_id UUID,
  user_id UUID,
  p_name TEXT,
  p_email TEXT
) RETURNS SETOF registry_items AS $$
BEGIN
  RETURN QUERY
  UPDATE registry_items
  SET 
    purchased = TRUE,
    purchased_by = user_id,
    purchased_at = NOW(),
    purchaser_name = p_name,
    purchaser_email = p_email
  WHERE id = item_id
  RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Add realtime support for registry_items
alter publication supabase_realtime add table registry_items;
