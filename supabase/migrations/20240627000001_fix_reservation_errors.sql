-- Fix issues with gift reservations

-- Add a trigger to ensure purchased_at is set when an item is marked as purchased
CREATE OR REPLACE FUNCTION set_purchased_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.purchased = true AND NEW.purchased_at IS NULL THEN
    NEW.purchased_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_purchased_timestamp ON registry_items;
CREATE TRIGGER ensure_purchased_timestamp
BEFORE INSERT OR UPDATE ON registry_items
FOR EACH ROW
EXECUTE FUNCTION set_purchased_timestamp();

-- Ensure purchaser details are properly set
CREATE OR REPLACE FUNCTION ensure_purchaser_details()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.purchased = true THEN
    -- If purchaser_name is NULL but we have purchased_by, try to get the name from users table
    IF NEW.purchaser_name IS NULL AND NEW.purchased_by IS NOT NULL THEN
      SELECT name INTO NEW.purchaser_name FROM users WHERE id = NEW.purchased_by;
    END IF;
    
    -- Set default values if still NULL
    IF NEW.purchaser_name IS NULL THEN
      NEW.purchaser_name := 'Guest';
    END IF;
    
    IF NEW.purchaser_email IS NULL THEN
      NEW.purchaser_email := 'guest@example.com';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_purchaser_details_trigger ON registry_items;
CREATE TRIGGER ensure_purchaser_details_trigger
BEFORE INSERT OR UPDATE ON registry_items
FOR EACH ROW
EXECUTE FUNCTION ensure_purchaser_details();
