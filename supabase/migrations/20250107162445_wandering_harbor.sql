-- Create monthly evaluations table
CREATE TABLE avaliacoes_mensais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  mes_ano date NOT NULL,
  nota numeric(4,2) NOT NULL CHECK (nota >= 0 AND nota <= 10),
  comentarios text,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  UNIQUE(driver_id, mes_ano)
);

-- Create indexes
CREATE INDEX idx_avaliacoes_mensais_driver ON avaliacoes_mensais(driver_id);
CREATE INDEX idx_avaliacoes_mensais_data ON avaliacoes_mensais(mes_ano);
CREATE INDEX idx_avaliacoes_mensais_status ON avaliacoes_mensais(status);

-- Enable RLS
ALTER TABLE avaliacoes_mensais ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "avaliacoes_mensais_select_policy" 
  ON avaliacoes_mensais FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "avaliacoes_mensais_insert_policy"
  ON avaliacoes_mensais FOR INSERT
  TO authenticated
  WITH CHECK (true);