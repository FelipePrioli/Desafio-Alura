/*
  # Driver Evaluation System

  1. New Tables
    - `driver_evaluations`
      - `id` (uuid, primary key)
      - `driver_id` (uuid, references drivers)
      - `item_id` (uuid, references evaluation_items)
      - `score` (integer, 0-100)
      - `evaluator_id` (uuid, references auth.users)
      - `notes` (text)
      - `evaluated_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `driver_evaluations` table
    - Add policies for authenticated users
*/

CREATE TABLE driver_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  item_id uuid REFERENCES evaluation_items(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  evaluator_id uuid REFERENCES auth.users(id),
  notes text,
  evaluated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(driver_id, item_id, evaluated_at)
);

-- Enable RLS
ALTER TABLE driver_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read evaluations"
  ON driver_evaluations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert evaluations"
  ON driver_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = evaluator_id);

-- Create indexes for better performance
CREATE INDEX idx_driver_evaluations_driver ON driver_evaluations(driver_id);
CREATE INDEX idx_driver_evaluations_item ON driver_evaluations(item_id);
CREATE INDEX idx_driver_evaluations_date ON driver_evaluations(evaluated_at);

-- Create trigger for updated_at
CREATE TRIGGER update_driver_evaluations_updated_at
  BEFORE UPDATE ON driver_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();