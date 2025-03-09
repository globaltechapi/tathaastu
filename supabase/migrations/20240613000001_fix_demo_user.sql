-- Create a new demo user without deleting the existing one

-- Create the demo user in auth.users with a known password
INSERT INTO auth.users 
(id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('22222222-2222-2222-2222-222222222222', 
'demo2@example.com', 
-- This is the encrypted form of 'demo123'
'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
now(), now(), now(), 
'{"provider":"email","providers":["email"]}',
'{"name":"Demo User 2"}');

-- Make sure the user is also in the public.users table
INSERT INTO public.users (id, email, name, created_at)
VALUES 
('22222222-2222-2222-2222-222222222222', 'demo2@example.com', 'Demo User 2', now())
ON CONFLICT (id) DO NOTHING;

-- Ensure the user is in the brand_ambassadors table
INSERT INTO public.brand_ambassadors 
(id, user_id, status, name, email, joined_date, kit_status, payment_id)
VALUES 
('22222222-2222-2222-2222-222222222222', 
'22222222-2222-2222-2222-222222222222', 
'active', 'Demo User 2', 'demo2@example.com', now(), 'delivered', 'demo_payment_id')
ON CONFLICT (user_id) DO NOTHING;

-- Update the existing demo user's password if it exists
UPDATE auth.users
SET encrypted_password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    email_confirmed_at = now(),
    updated_at = now()
WHERE email = 'demo@example.com';
