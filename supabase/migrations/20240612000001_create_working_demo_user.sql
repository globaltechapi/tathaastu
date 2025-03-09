-- Create a new demo user with a working password

-- First, delete any existing demo user to avoid conflicts
DELETE FROM auth.users WHERE email = 'demo@example.com';

-- Create the demo user in auth.users with a known password
INSERT INTO auth.users 
(id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('11111111-1111-1111-1111-111111111111', 
'demo@example.com', 
-- This is the encrypted form of 'demo123'
'$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
now(), now(), now(), 
'{"provider":"email","providers":["email"]}',
'{"name":"Demo User"}');

-- Make sure the user is also in the public.users table
INSERT INTO public.users (id, email, name, created_at)
VALUES 
('11111111-1111-1111-1111-111111111111', 'demo@example.com', 'Demo User', now())
ON CONFLICT (id) DO NOTHING;

-- Ensure the user is in the brand_ambassadors table
INSERT INTO public.brand_ambassadors 
(id, user_id, status, name, email, joined_date, kit_status, payment_id)
VALUES 
('11111111-1111-1111-1111-111111111111', 
'11111111-1111-1111-1111-111111111111', 
'active', 'Demo User', 'demo@example.com', now(), 'delivered', 'demo_payment_id')
ON CONFLICT (user_id) DO NOTHING;
