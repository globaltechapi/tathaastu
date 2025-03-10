-- Create function to get table information
CREATE OR REPLACE FUNCTION get_table_info(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' AND 
    c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
END;
$$;

-- Ensure the disabled column exists with the correct type
DO $$ 
BEGIN
  -- Check if the column exists
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
               WHERE table_schema='public' 
               AND table_name='users' 
               AND column_name='disabled') THEN
    -- Add the column if it doesn't exist
    ALTER TABLE public.users ADD COLUMN disabled BOOLEAN DEFAULT FALSE;
  ELSE
    -- If it exists but is not a boolean, try to convert it
    BEGIN
      ALTER TABLE public.users ALTER COLUMN disabled TYPE BOOLEAN USING disabled::boolean;
    EXCEPTION WHEN OTHERS THEN
      -- If conversion fails, drop and recreate the column
      ALTER TABLE public.users DROP COLUMN disabled;
      ALTER TABLE public.users ADD COLUMN disabled BOOLEAN DEFAULT FALSE;
    END;
  END IF;

  -- Make sure the column has a default value
  ALTER TABLE public.users ALTER COLUMN disabled SET DEFAULT FALSE;
  
  -- Update any NULL values to FALSE
  UPDATE public.users SET disabled = FALSE WHERE disabled IS NULL;
 END $$;
