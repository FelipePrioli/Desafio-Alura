/*
  # Fix roles policies final version

  1. Changes
    - Remove all complex role checks
    - Implement basic CRUD policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view roles" ON roles;
DROP POLICY IF EXISTS "Directors can manage roles" ON roles;
DROP POLICY IF EXISTS "Anyone can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Directors can manage user roles" ON user_roles;

-- Simple read-only policy for roles
CREATE POLICY "Read roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- Simple read-only policy for user_roles
CREATE POLICY "Read user roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to manage their own role assignments
CREATE POLICY "Manage own user roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (user_id = auth.uid());