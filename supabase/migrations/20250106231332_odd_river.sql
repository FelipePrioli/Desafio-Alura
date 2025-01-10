/*
  # Add insert policy for drivers table

  1. Changes
    - Add RLS policy to allow authenticated users to insert new drivers
*/

CREATE POLICY "Users can insert drivers"
  ON drivers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);