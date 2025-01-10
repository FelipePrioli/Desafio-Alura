/*
  # Update Drivers Table Schema

  1. Changes
    - Drop existing drivers table
    - Create new drivers table with simplified schema
    - Add required constraints and validations

  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Drop existing table
DROP TABLE IF EXISTS drivers CASCADE;

-- Create new drivers table
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  situacao VARCHAR(7) NOT NULL CHECK (situacao IN ('Ativo', 'Inativo')) DEFAULT 'Ativo'
);

-- Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert drivers"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update drivers"
  ON drivers FOR UPDATE
  TO authenticated
  USING (true);