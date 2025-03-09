-- Fix the demo user authentication by updating the password hash

-- Update the password hash for the demo user
UPDATE auth.users
SET encrypted_password = '$2a$10$Gg/qZMUXHpIZZKr6/KJ.UOPXpkTsCdKSl.Qz9Jl7L6LnWXjQbQS4e'
WHERE email = 'demo5@example.com';

-- Ensure the user is confirmed
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'demo5@example.com';
