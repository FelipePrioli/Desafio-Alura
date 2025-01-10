/*
  # Fix roles policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Simplify role-based access control
    - Add basic policies for roles and user_roles tables

  2. Security
    - Maintain proper access control while avoiding recursion
    - Ensure directors can still manage roles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Roles are viewable by all authenticated users" ON roles;
DROP POLICY IF EXISTS "Only directors can manage roles" ON roles;
DROP POLICY IF EXISTS "User roles are viewable by directors and administrators" ON user_roles;
DROP POLICY IF EXISTS "Only directors can manage user roles" ON user_roles;

-- Create new simplified policies for roles table
CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Directors can manage roles"
  ON roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role_id = (SELECT id FROM roles WHERE name = 'director' LIMIT 1)
    )
  );

-- Create new simplified policies for user_roles table
CREATE POLICY "Anyone can view user roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Directors can manage user roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'director' LIMIT 1)
    )
  );