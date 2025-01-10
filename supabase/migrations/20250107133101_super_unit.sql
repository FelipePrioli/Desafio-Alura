/*
  # Create drivers table with basic structure
  
  1. New Table
    - `drivers` table with essential fields
    - Timestamps and audit fields
    - Status tracking
  
  2. Security
    - Enable RLS
    - Basic access policies
*/

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data_cadastro TIMESTAMPTZ DEFAULT now(),
  situacao VARCHAR(7) NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT situacao_check CHECK (situacao IN ('Ativo', 'Inativo'))
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