/*
  # Ride-sharing Platform Database Schema

  1. New Tables
    - `users`
      - Core user information and authentication
      - Profile details and account status
    - `drivers`
      - Driver-specific information
      - Vehicle and insurance details
      - Real-time status tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
*/

-- Drop existing drivers table if it exists
DROP TABLE IF EXISTS drivers;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone_number text NOT NULL,
  profile_picture_url text,
  account_status text NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'inactive')),
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number text NOT NULL,
  license_expiry_date date NOT NULL,
  vehicle_registration text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer NOT NULL,
  insurance_policy_number text NOT NULL,
  insurance_expiry_date date NOT NULL,
  background_check_status text NOT NULL DEFAULT 'pending' 
    CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
  driver_rating decimal(3,2) DEFAULT 5.00 
    CHECK (driver_rating >= 1.00 AND driver_rating <= 5.00),
  account_status text NOT NULL DEFAULT 'active' 
    CHECK (account_status IN ('active', 'inactive')),
  current_location point,
  available_status text NOT NULL DEFAULT 'offline' 
    CHECK (available_status IN ('online', 'offline', 'busy')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_license ON drivers(license_number);
CREATE INDEX idx_drivers_status ON drivers(account_status, available_status);
CREATE INDEX idx_drivers_location ON drivers USING gist(current_location);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for drivers table
CREATE POLICY "Drivers can read own data"
  ON drivers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update own data"
  ON drivers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();