-- Create a more reliable function to update user status
CREATE OR REPLACE FUNCTION public.update_user_disabled_status(user_id UUID, is_disabled BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET disabled = is_disabled
  WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_disabled_status TO authenticated;

-- Ensure the disabled column exists
DO $$ 
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
               WHERE table_schema='public' 
               AND table_name='users' 
               AND column_name='disabled') THEN
    ALTER TABLE public.users ADD COLUMN disabled BOOLEAN DEFAULT FALSE;
  END IF;
END $$;
