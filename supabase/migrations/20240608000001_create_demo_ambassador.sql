-- Create a demo brand ambassador account

-- First, create the brand_ambassadors table if it doesn't exist
CREATE TABLE IF NOT EXISTS brand_ambassadors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  tshirt_size TEXT,
  kit_status TEXT DEFAULT 'processing',
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Then create a demo user and ambassador
DO $$
DECLARE
  demo_user_id uuid;
  user_exists boolean;
BEGIN
  -- Check if user already exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sandeep@gmail.com') INTO user_exists;
  
  -- If user doesn't exist, create it
  IF NOT user_exists THEN
    -- Generate a new UUID
    demo_user_id := gen_random_uuid();
    
    -- Insert into auth.users
    INSERT INTO auth.users (
      id, 
      email, 
      raw_user_meta_data,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      encrypted_password
    ) VALUES (
      demo_user_id,
      'sandeep@gmail.com',
      '{"name":"Sandeep Kumar"}',
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      -- Password: Utuhtuhu@123
      '$2a$10$Xt9Hn5QDG.hiEwNvjSrMxeQqYnUAlKwLcaStKT9uYXoYQW7b5jMFe'
    );
    
    -- Insert into public.users
    INSERT INTO public.users (id, email, name, created_at)
    VALUES (demo_user_id, 'sandeep@gmail.com', 'Sandeep Kumar', now());
    
    -- Insert into brand_ambassadors
    INSERT INTO brand_ambassadors (
      user_id,
      payment_id,
      status,
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      tshirt_size,
      kit_status,
      joined_date
    ) VALUES (
      demo_user_id,
      'demo_payment_123456',
      'active',
      'Sandeep Kumar',
      'sandeep@gmail.com',
      '9876543210',
      '123 Demo Street',
      'Mumbai',
      'Maharashtra',
      '400001',
      'L',
      'delivered',
      now() - interval '30 days'
    );
  ELSE
    -- Get the user ID if it already exists
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'sandeep@gmail.com';
    
    -- Check if user exists in public.users
    IF NOT EXISTS(SELECT 1 FROM public.users WHERE id = demo_user_id) THEN
      -- Insert into public.users
      INSERT INTO public.users (id, email, name, created_at)
      VALUES (demo_user_id, 'sandeep@gmail.com', 'Sandeep Kumar', now());
    END IF;
    
    -- Check if user exists in brand_ambassadors
    IF NOT EXISTS(SELECT 1 FROM brand_ambassadors WHERE user_id = demo_user_id) THEN
      -- Insert into brand_ambassadors
      INSERT INTO brand_ambassadors (
        user_id,
        payment_id,
        status,
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        tshirt_size,
        kit_status,
        joined_date
      ) VALUES (
        demo_user_id,
        'demo_payment_123456',
        'active',
        'Sandeep Kumar',
        'sandeep@gmail.com',
        '9876543210',
        '123 Demo Street',
        'Mumbai',
        'Maharashtra',
        '400001',
        'L',
        'delivered',
        now() - interval '30 days'
      );
    END IF;
  END IF;
END
$$;