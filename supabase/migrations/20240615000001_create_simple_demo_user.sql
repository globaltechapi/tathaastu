-- Create a simple demo user with a known password

-- First, let's make sure we have a clean slate for this user
DELETE FROM auth.users WHERE email = 'demo4@example.com';

-- Create the user in auth.users with a known password
INSERT INTO auth.users 
(id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
('44444444-4444-4444-4444-444444444444', 
'demo4@example.com', 
-- This is the encrypted form of 'password123'
'$2a$10$Jq.2c8JZ.Ywvs6xyvOBCo.qP1dXEw2Cdh.MJHNJoWWANZvlQgYKQm',
now(), now(), now(), 
'{"provider":"email","providers":["email"]}',
'{"name":"Demo User 4"}');

-- Make sure the user is also in the public.users table
INSERT INTO public.users (id, email, name, created_at)
VALUES 
('44444444-4444-4444-4444-444444444444', 'demo4@example.com', 'Demo User 4', now());

-- Create a brand ambassador record for this user
INSERT INTO public.brand_ambassadors 
(id, user_id, status, name, email, joined_date, kit_status, payment_id)
VALUES 
('44444444-4444-4444-4444-444444444444', 
'44444444-4444-4444-4444-444444444444', 
'active', 'Demo User 4', 'demo4@example.com', now(), 'delivered', 'demo_payment_id');
