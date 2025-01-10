-- Drop existing tables if they exist
DROP TABLE IF EXISTS avaliacoes_mensais_historico CASCADE;
DROP TABLE IF EXISTS avaliacoes_mensais CASCADE;

-- Create monthly evaluations table
CREATE TABLE avaliacoes_mensais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  mes_ano date NOT NULL,
  nota numeric(4,2) NOT NULL CHECK (nota >= 0 AND nota <= 10),
  comentarios text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'preenchida')),
  UNIQUE(driver_id, mes_ano)
);

-- Create audit history table
CREATE TABLE avaliacoes_mensais_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliacao_id uuid NOT NULL REFERENCES avaliacoes_mensais(id) ON DELETE CASCADE,
  nota_anterior numeric(4,2),
  nova_nota numeric(4,2),
  comentarios_anteriores text,
  novos_comentarios text,
  modificado_por uuid REFERENCES auth.users(id),
  data_modificacao timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_avaliacoes_mensais_driver ON avaliacoes_mensais(driver_id);
CREATE INDEX idx_avaliacoes_mensais_data ON avaliacoes_mensais(mes_ano);
CREATE INDEX idx_avaliacoes_mensais_status ON avaliacoes_mensais(status);
CREATE INDEX idx_avaliacoes_historico_avaliacao ON avaliacoes_mensais_historico(avaliacao_id);
CREATE INDEX idx_avaliacoes_historico_data ON avaliacoes_mensais_historico(data_modificacao);

-- Enable RLS
ALTER TABLE avaliacoes_mensais ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_mensais_historico ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for avaliacoes_mensais
CREATE POLICY "avaliacoes_mensais_select_policy" 
  ON avaliacoes_mensais FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "avaliacoes_mensais_insert_policy"
  ON avaliacoes_mensais FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "avaliacoes_mensais_update_policy"
  ON avaliacoes_mensais FOR UPDATE
  TO authenticated
  USING (true);

-- Create RLS policies for history table
CREATE POLICY "avaliacoes_historico_select_policy"
  ON avaliacoes_mensais_historico FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "avaliacoes_historico_insert_policy"
  ON avaliacoes_mensais_historico FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = modificado_por);

-- Create trigger for updated_at
CREATE TRIGGER update_avaliacoes_mensais_updated_at
  BEFORE UPDATE ON avaliacoes_mensais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();