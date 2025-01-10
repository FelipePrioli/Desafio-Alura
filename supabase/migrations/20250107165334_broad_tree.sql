/*
  # Fix Driver Evaluations Schema

  1. Changes
    - Drop and recreate evaluation tables with proper relationships
    - Add proper indexes and constraints
    - Update RLS policies

  2. Tables Created/Modified
    - evaluation_items
    - driver_evaluations
    - evaluation_history
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS evaluation_history CASCADE;
DROP TABLE IF EXISTS driver_evaluations CASCADE;
DROP TABLE IF EXISTS evaluation_items CASCADE;

-- Create evaluation items table
CREATE TABLE evaluation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  weight integer NOT NULL DEFAULT 1 CHECK (weight >= 1 AND weight <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create driver evaluations table
CREATE TABLE driver_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  evaluation_item_id uuid REFERENCES evaluation_items(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  notes text,
  evaluator_id uuid REFERENCES auth.users(id),
  evaluated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(driver_id, evaluation_item_id, evaluated_at)
);

-- Create evaluation history table
CREATE TABLE evaluation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid REFERENCES driver_evaluations(id) ON DELETE CASCADE,
  previous_score integer NOT NULL,
  new_score integer NOT NULL,
  previous_notes text,
  new_notes text,
  modified_by uuid REFERENCES auth.users(id),
  modified_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE evaluation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "evaluation_items_select_policy" 
  ON evaluation_items FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "driver_evaluations_select_policy" 
  ON driver_evaluations FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "driver_evaluations_insert_policy"
  ON driver_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = evaluator_id);

CREATE POLICY "evaluation_history_select_policy"
  ON evaluation_history FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_driver_evaluations_driver ON driver_evaluations(driver_id);
CREATE INDEX idx_driver_evaluations_item ON driver_evaluations(evaluation_item_id);
CREATE INDEX idx_driver_evaluations_date ON driver_evaluations(evaluated_at);
CREATE INDEX idx_evaluation_history_evaluation ON evaluation_history(evaluation_id);

-- Insert default evaluation items
INSERT INTO evaluation_items (name, description, weight) VALUES
('Pontualidade', 'Avaliação do cumprimento dos horários', 5),
('Cordialidade', 'Avaliação do atendimento e relacionamento', 4),
('Direção', 'Avaliação da habilidade e segurança na direção', 5),
('Limpeza', 'Avaliação da conservação e limpeza do veículo', 3);