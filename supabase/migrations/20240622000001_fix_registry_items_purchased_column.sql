-- Ensure the purchased column has a default value of false
ALTER TABLE registry_items ALTER COLUMN purchased SET DEFAULT false;

-- Add an index on the purchased column to improve query performance
CREATE INDEX IF NOT EXISTS idx_registry_items_purchased ON registry_items(purchased);

-- Add an index on registry_id and purchased to improve query performance for finding purchased items in a registry
CREATE INDEX IF NOT EXISTS idx_registry_items_registry_purchased ON registry_items(registry_id, purchased);
