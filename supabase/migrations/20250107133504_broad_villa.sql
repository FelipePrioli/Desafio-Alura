/*
  # Fix drivers table structure
  
  1. Changes
    - Drop and recreate table with correct columns
    - Add proper constraints
    - Enable RLS policies
  
  2. Fields
    - nome (full name)
    - cpf (with validation)
    - data_admissao (admission date)
    - situacao (status with options)
    - created_at (creation timestamp)
    - updated_at (update timestamp)
*/

-- Drop existing table
DROP TABLE IF EXISTS drivers CASCADE;

-- Create new drivers table
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data_admissao DATE NOT NULL,
  situacao VARCHAR(10) NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT situacao_check CHECK (situacao IN ('Ativo', 'Inativo', 'Afastado', 'Férias')),
  CONSTRAINT data_admissao_check CHECK (data_admissao <= CURRENT_DATE)
);

-- Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "drivers_select_policy" 
  ON drivers FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "drivers_insert_policy"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "drivers_update_policy"
  ON drivers FOR UPDATE
  TO authenticated
  USING (true);