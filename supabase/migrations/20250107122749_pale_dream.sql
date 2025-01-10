/*
  # Add access level and create admin user

  1. Changes
    - Add access_level column to users table
    - Create admin user with default credentials
    
  2. Security
    - Password will be handled by Supabase Auth
    - Access level is restricted through RLS policies
*/

-- Add access_level column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'access_level'
  ) THEN
    ALTER TABLE users 
    ADD COLUMN access_level text NOT NULL DEFAULT 'standard'
    CHECK (access_level IN ('admin', 'standard', 'guest'));
  END IF;
END $$;

-- Create admin user if it doesn't exist
DO $$ 
DECLARE 
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@sistema.com'
  ) THEN
    -- Create user in auth.users (handled by Supabase)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      last_sign_in_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@sistema.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      NOW()
    ) RETURNING id INTO admin_user_id;

    -- Create user profile
    INSERT INTO users (
      id,
      email,
      full_name,
      is_active,
      access_level,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'admin@sistema.com',
      'Administrador do Sistema',
      true,
      'admin',
      NOW(),
      NOW()
    );
  END IF;
END $$;