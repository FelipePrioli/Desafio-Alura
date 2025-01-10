/*
  # Add driver rating and status columns

  1. Changes
    - Add rating column (0-100 scale)
    - Add status column with predefined values
    - Add indexes for performance

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 100),
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Suspenso'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_drivers_rating ON drivers(rating);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_nome ON drivers(nome);