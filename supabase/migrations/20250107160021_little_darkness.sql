/*
  # Fix evaluation items table structure

  1. Changes
    - Drop existing table if exists to avoid conflicts
    - Create evaluation_items table with proper constraints
    - Add RLS policies for security
    - Create indexes for better performance

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS evaluation_items CASCADE;

-- Create evaluation_items table
CREATE TABLE evaluation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  importance integer NOT NULL CHECK (importance >= 1 AND importance <= 3),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE evaluation_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read evaluation items"
  ON evaluation_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert evaluation items"
  ON evaluation_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_evaluation_items_importance ON evaluation_items(importance);
CREATE INDEX idx_evaluation_items_name ON evaluation_items(name);

-- Create updated_at trigger
CREATE TRIGGER update_evaluation_items_updated_at
  BEFORE UPDATE ON evaluation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();