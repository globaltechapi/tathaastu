-- Update the super admin user credentials
DO $$
BEGIN
  -- Check if the super admin user exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@tathaastu.com') THEN
    -- Update the password for the existing user
    UPDATE auth.users
    SET encrypted_password = crypt('SuperAdmin@123', gen_salt('bf'))
    WHERE email = 'admin@tathaastu.com';
    
    -- Ensure the user has super admin privileges
    UPDATE public.users
    SET is_super_admin = true
    WHERE email = 'admin@tathaastu.com';
  ELSE
    -- Insert a new super admin user if it doesn't exist
    WITH new_user AS (
      INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
      VALUES (
        'admin@tathaastu.com',
        crypt('SuperAdmin@123', gen_salt('bf')),
        now(),
        now(),
        now()
      )
      RETURNING id
    )
    INSERT INTO public.users (id, email, name, is_super_admin, created_at)
    SELECT id, 'admin@tathaastu.com', 'Super Admin', true, now()
    FROM new_user;
  END IF;
END
$$;