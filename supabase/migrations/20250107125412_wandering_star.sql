/*
  # Update Drivers Table Schema

  1. Changes
    - Create drivers table if not exists
    - Add required columns for driver registration
    - Add validation functions and triggers

  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create or update drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  cpf text UNIQUE NOT NULL,
  admission_date date NOT NULL,
  driver_status text NOT NULL DEFAULT 'Ativo'
    CHECK (driver_status IN ('Ativo', 'Inativo', 'Afastado', 'Férias')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Add CPF format validation
CREATE OR REPLACE FUNCTION validate_cpf() 
RETURNS trigger AS $$
BEGIN
  IF NEW.cpf !~ '^\d{11}$' THEN
    RAISE EXCEPTION 'CPF must contain exactly 11 digits';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for CPF validation
DROP TRIGGER IF EXISTS validate_cpf_trigger ON drivers;
CREATE TRIGGER validate_cpf_trigger
  BEFORE INSERT OR UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION validate_cpf();

-- Add admission date validation
CREATE OR REPLACE FUNCTION validate_admission_date() 
RETURNS trigger AS $$
BEGIN
  IF NEW.admission_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Admission date cannot be in the future';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admission date validation
DROP TRIGGER IF EXISTS validate_admission_date_trigger ON drivers;
CREATE TRIGGER validate_admission_date_trigger
  BEFORE INSERT OR UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION validate_admission_date();

-- Add RLS policies
CREATE POLICY "Users can view all drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert drivers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own driver record"
  ON drivers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);