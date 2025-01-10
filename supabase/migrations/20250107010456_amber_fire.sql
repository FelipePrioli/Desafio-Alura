/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text)
      - `full_name` (text)
      - `phone_number` (text, optional)
      - `profile_image_url` (text, optional)
      - `is_active` (boolean, default: true)
      - `last_login` (timestamptz, optional)
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users
    - Add unique constraint on email
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  phone_number text,
  profile_image_url text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_email_key UNIQUE (email)
);

-- Create indexes
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_is_active_idx ON users(is_active);
CREATE INDEX users_created_at_idx ON users(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();