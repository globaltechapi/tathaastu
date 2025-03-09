-- Create a working demo user with a simple password

-- First, delete any existing user with this email to avoid conflicts
-- Delete from brand_ambassadors first to avoid foreign key constraint issues
DELETE FROM public.brand_ambassadors WHERE user_id = '55555555-5555-5555-5555-555555555555';
DELETE FROM public.users WHERE id = '55555555-5555-5555-5555-555555555555';
DELETE FROM auth.users WHERE email = 'demo5@example.com';

-- Create the user with a simple password
INSERT INTO auth.users 
(id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_sso_user)
VALUES 
('55555555-5555-5555-5555-555555555555', 
'demo5@example.com', 
-- This is 'demo123' encrypted
'$2a$10$Gg/qZMUXHpIZZKr6/KJ.UOPXpkTsCdKSl.Qz9Jl7L6LnWXjQbQS4e',
now(), now(), now(), 
'{"provider":"email","providers":["email"]}',
'{"name":"Demo Ambassador"}',
false);

-- Create the user in the public.users table
INSERT INTO public.users (id, email, name, created_at)
VALUES 
('55555555-5555-5555-5555-555555555555', 'demo5@example.com', 'Demo Ambassador', now());

-- Create the brand ambassador record
INSERT INTO public.brand_ambassadors 
(id, user_id, status, name, email, joined_date, kit_status, payment_id)
VALUES 
('55555555-5555-5555-5555-555555555555', 
'55555555-5555-5555-5555-555555555555', 
'active', 'Demo Ambassador', 'demo5@example.com', now(), 'delivered', 'demo_payment_id');
