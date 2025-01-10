-- Add status and modification tracking to driver_evaluations
ALTER TABLE driver_evaluations
ADD COLUMN status text NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'completed', 'revised')),
ADD COLUMN revision_notes text,
ADD COLUMN revised_at timestamptz,
ADD COLUMN revised_by uuid REFERENCES auth.users(id);

-- Create evaluation_history table for audit
CREATE TABLE evaluation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL REFERENCES driver_evaluations(id) ON DELETE CASCADE,
  previous_score integer NOT NULL,
  new_score integer NOT NULL,
  previous_notes text,
  new_notes text,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS on history table
ALTER TABLE evaluation_history ENABLE ROW LEVEL SECURITY;

-- Create policies for history table
CREATE POLICY "Authenticated users can read evaluation history"
  ON evaluation_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert evaluation history"
  ON evaluation_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = changed_by);