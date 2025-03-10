-- Create admin function to update user status
CREATE OR REPLACE FUNCTION admin_update_user_status(user_id UUID, is_disabled BOOLEAN)
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
GRANT EXECUTE ON FUNCTION admin_update_user_status TO authenticated;
