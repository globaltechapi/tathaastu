-- Create a fresh demo user with a working password

-- Create the demo user in auth.users with a known password
INSERT INTO auth.users 
(id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('33333333-3333-3333-3333-333333333333', 
'demo3@example.com', 
-- This is the encrypted form of 'password123'
'$2a$10$Jq.2c8JZ.Ywvs6xyvOBCo.qP1dXEw2Cdh.MJHNJoWWANZvlQgYKQm',
now(), now(), now(), 
'{"provider":"email","providers":["email"]}',
'{"name":"Demo User 3"}')
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = '$2a$10$Jq.2c8JZ.Ywvs6xyvOBCo.qP1dXEw2Cdh.MJHNJoWWANZvlQgYKQm',
  email_confirmed_at = now(),
  updated_at = now();

-- Make sure the user is also in the public.users table
INSERT INTO public.users (id, email, name, created_at)
VALUES 
('33333333-3333-3333-3333-333333333333', 'demo3@example.com', 'Demo User 3', now())
ON CONFLICT (id) DO NOTHING;

-- Ensure the user is in the brand_ambassadors table
INSERT INTO public.brand_ambassadors 
(id, user_id, status, name, email, joined_date, kit_status, payment_id)
VALUES 
('33333333-3333-3333-3333-333333333333', 
'33333333-3333-3333-3333-333333333333', 
'active', 'Demo User 3', 'demo3@example.com', now(), 'delivered', 'demo_payment_id')
ON CONFLICT (user_id) DO NOTHING;
