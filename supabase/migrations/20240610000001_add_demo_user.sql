-- Create demo user in auth.users if it doesn't exist
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 'demo@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create demo user in public.users if it doesn't exist
INSERT INTO public.users (id, email, name, created_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Demo User', now())
ON CONFLICT (id) DO NOTHING;

-- Create brand ambassador record for demo user
INSERT INTO public.brand_ambassadors (user_id, status, name, email, joined_date, kit_status, payment_id)
VALUES 
('00000000-0000-0000-0000-000000000000', 'active', 'Demo User', 'demo@example.com', now(), 'delivered', 'demo_payment_id')
ON CONFLICT (user_id) DO NOTHING;
