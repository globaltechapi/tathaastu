-- Create a direct SQL function to update user disabled status
CREATE OR REPLACE FUNCTION public.direct_user_disable(user_id UUID, is_disabled BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure the disabled column exists
  BEGIN
    EXECUTE 'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS disabled BOOLEAN DEFAULT FALSE';
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors
  END;
  
  -- Direct SQL update using EXECUTE to bypass any potential issues
  EXECUTE 'UPDATE public.users SET disabled = $1 WHERE id = $2' USING is_disabled, user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.direct_user_disable TO authenticated;
