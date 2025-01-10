-- Drop existing policies
DROP POLICY IF EXISTS "evaluation_items_select_policy" ON evaluation_items;
DROP POLICY IF EXISTS "evaluation_items_insert_policy" ON evaluation_items;
DROP POLICY IF EXISTS "evaluation_items_update_policy" ON evaluation_items;

-- Create comprehensive RLS policies
CREATE POLICY "evaluation_items_select_policy" 
  ON evaluation_items FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "evaluation_items_insert_policy"
  ON evaluation_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "evaluation_items_update_policy"
  ON evaluation_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "evaluation_items_delete_policy"
  ON evaluation_items FOR DELETE
  TO authenticated
  USING (true);