/*
  # Add user insert policy

  1. Changes
    - Add policy to allow users to insert their own data into users table
  
  2. Security
    - Users can only insert data with their own auth.uid()
*/

-- Policy to allow users to insert their own data
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);