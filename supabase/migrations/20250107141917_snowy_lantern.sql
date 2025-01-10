/*
  # Create evaluation items table and relations

  1. New Tables
    - evaluation_items
      - id (uuid, primary key)
      - name (text, required)
      - importance (integer 1-10, required)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE evaluation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  importance integer NOT NULL CHECK (importance >= 1 AND importance <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE evaluation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read evaluation items"
  ON evaluation_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert evaluation items"
  ON evaluation_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_evaluation_items_updated_at
  BEFORE UPDATE ON evaluation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();