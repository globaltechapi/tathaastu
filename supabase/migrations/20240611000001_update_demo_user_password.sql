-- Update the demo user's password to a known value that will work with the login

-- First, let's create the demo user if it doesn't exist
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('00000000-0000-0000-0000-000000000000', 'demo@example.com', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Demo User"}')
ON CONFLICT (id) DO UPDATE
SET email_confirmed_at = now(),
    updated_at = now();

-- Set a known password for the demo user
UPDATE auth.users
SET encrypted_password = '$2a$10$zUGjUu/qWkgSMz7smPG6/.kXjjPp9HQYhHRYs9.qZMD3QJUYKGFwW'
WHERE email = 'demo@example.com';

-- Make sure the user is also in the public.users table
INSERT INTO public.users (id, email, name, created_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Demo User', now())
ON CONFLICT (id) DO NOTHING;

-- Ensure the user is in the brand_ambassadors table
INSERT INTO public.brand_ambassadors (id, user_id, status, name, email, joined_date, kit_status, payment_id)
VALUES 
('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'active', 'Demo User', 'demo@example.com', now(), 'delivered', 'demo_payment_id')
ON CONFLICT (user_id) DO NOTHING;
