-- Create a function to update user disabled status directly
CREATE OR REPLACE FUNCTION admin_update_user_disabled(p_user_id UUID, p_disabled BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- Ensure the disabled column exists
  BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                 WHERE table_schema='public' 
                 AND table_name='users' 
                 AND column_name='disabled') THEN
      ALTER TABLE public.users ADD COLUMN disabled BOOLEAN DEFAULT FALSE;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- If there's an error, return false
    RETURN FALSE;
  END;
  
  -- Update the user's disabled status
  UPDATE public.users
  SET disabled = p_disabled
  WHERE id = p_user_id;
  
  -- Check if the update was successful
  GET DIAGNOSTICS success = ROW_COUNT;
  
  RETURN success > 0;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_update_user_disabled TO authenticated;
