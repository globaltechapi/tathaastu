-- Create a direct SQL update function that bypasses all checks
CREATE OR REPLACE FUNCTION public.direct_sql_update_user_status(p_user_id UUID, p_disabled BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- First ensure the column exists
  BEGIN
    EXECUTE 'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS disabled BOOLEAN DEFAULT FALSE';
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors
  END;
  
  -- Use raw SQL with parameters to update the user status
  BEGIN
    EXECUTE 'UPDATE public.users SET disabled = $1 WHERE id = $2' USING p_disabled, p_user_id;
    GET DIAGNOSTICS success = ROW_COUNT;
    RETURN success > 0;
  EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
  END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.direct_sql_update_user_status TO authenticated;
