-- Fix the registry_activity view to properly show purchased items
DROP VIEW IF EXISTS registry_activity;

CREATE VIEW registry_activity AS
SELECT 
  ri.id,
  ri.registry_id,
  ri.name AS item_name,
  ri.purchased_at,
  ri.purchased_by,
  ri.purchaser_name,
  ri.purchaser_email,
  'purchase' AS activity_type
FROM 
  registry_items ri
WHERE 
  ri.purchased = true;
