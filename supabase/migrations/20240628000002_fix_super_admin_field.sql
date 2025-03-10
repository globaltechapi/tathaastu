-- Add is_super_admin field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Create a super admin user if it doesn't exist
DO $$
BEGIN
  -- Check if the super admin user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@tathaastu.com') THEN
    -- Insert the user into auth.users
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'admin@tathaastu.com',
      -- This is a hashed version of 'SuperAdmin@123'
      crypt('SuperAdmin@123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
    
    -- Get the ID of the newly created user
    WITH new_user AS (
      SELECT id FROM auth.users WHERE email = 'admin@tathaastu.com' LIMIT 1
    )
    -- Insert the user into public.users with super admin privileges
    INSERT INTO public.users (id, email, name, is_super_admin, created_at)
    SELECT id, 'admin@tathaastu.com', 'Super Admin', true, now()
    FROM new_user;
  ELSE
    -- Update existing user to have super admin privileges
    WITH existing_user AS (
      SELECT id FROM auth.users WHERE email = 'admin@tathaastu.com' LIMIT 1
    )
    -- Update or insert the user in public.users
    INSERT INTO public.users (id, email, name, is_super_admin, created_at)
    SELECT id, 'admin@tathaastu.com', 'Super Admin', true, now()
    FROM existing_user
    ON CONFLICT (id) DO UPDATE SET is_super_admin = true;
  END IF;
END
$$;