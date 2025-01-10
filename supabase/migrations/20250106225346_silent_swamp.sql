/*
  # Create drivers table

  1. New Tables
    - `drivers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `license` (text)
      - `vehicle` (text)
      - `plate` (text)
      - `schedule` (text)
      - `status` (text)
      - `score` (integer)
      - `photo` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `drivers` table
    - Add policies for authenticated users to read and update their own data
*/

CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  license text NOT NULL,
  vehicle text,
  plate text,
  schedule text,
  status text NOT NULL DEFAULT 'Ativo',
  score integer NOT NULL DEFAULT 0,
  photo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all drivers"
  ON drivers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own data"
  ON drivers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();