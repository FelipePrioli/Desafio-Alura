/*
  # User Roles and Permissions Schema

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    - `user_roles`
      - `user_id` (uuid, foreign key)
      - `role_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for role-based access
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('director', 'Full system access with complete administrative control'),
  ('administrator', 'Full system access with administrative capabilities'),
  ('standard', 'Limited access to basic features')
ON CONFLICT (name) DO NOTHING;

-- Policies for roles table
CREATE POLICY "Roles are viewable by all authenticated users"
  ON roles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Only directors can manage roles"
  ON roles FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (SELECT id FROM roles WHERE name = 'director')
    )
  );

-- Policies for user_roles table
CREATE POLICY "User roles are viewable by directors and administrators"
  ON user_roles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (SELECT id FROM roles WHERE name IN ('director', 'administrator'))
    )
  );

CREATE POLICY "Only directors can manage user roles"
  ON user_roles FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (SELECT id FROM roles WHERE name = 'director')
    )
  );