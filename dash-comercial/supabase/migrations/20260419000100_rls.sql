-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE closers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION — is_admin()
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- profiles: admin lê próprio + todos admins; ninguém modifica direto
-- ============================================
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- teams: leitura pública (dashboard TV); escrita só admin
-- ============================================
CREATE POLICY teams_select_all ON teams
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY teams_insert_admin ON teams
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY teams_update_admin ON teams
  FOR UPDATE USING (is_admin());

-- Soft delete via UPDATE; não permitir DELETE real
CREATE POLICY teams_delete_admin ON teams
  FOR DELETE USING (is_admin());

-- ============================================
-- products: idem teams
-- ============================================
CREATE POLICY products_select_all ON products
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY products_insert_admin ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY products_update_admin ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY products_delete_admin ON products
  FOR DELETE USING (is_admin());

-- ============================================
-- closers: idem
-- ============================================
CREATE POLICY closers_select_all ON closers
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY closers_insert_admin ON closers
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY closers_update_admin ON closers
  FOR UPDATE USING (is_admin());

CREATE POLICY closers_delete_admin ON closers
  FOR DELETE USING (is_admin());

-- ============================================
-- sales: leitura via VIEW (public); tabela raw só admin
-- ============================================
CREATE POLICY sales_select_admin ON sales
  FOR SELECT USING (is_admin());

CREATE POLICY sales_insert_admin ON sales
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY sales_update_admin ON sales
  FOR UPDATE USING (is_admin());

CREATE POLICY sales_delete_admin ON sales
  FOR DELETE USING (is_admin());

-- ============================================
-- monthly_metrics: leitura pública (dashboard agrega); escrita admin
-- ============================================
CREATE POLICY metrics_select_all ON monthly_metrics
  FOR SELECT USING (true);

CREATE POLICY metrics_insert_admin ON monthly_metrics
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY metrics_update_admin ON monthly_metrics
  FOR UPDATE USING (is_admin());

CREATE POLICY metrics_delete_admin ON monthly_metrics
  FOR DELETE USING (is_admin());

-- ============================================
-- goals: leitura pública; escrita admin
-- ============================================
CREATE POLICY goals_select_all ON goals
  FOR SELECT USING (true);

CREATE POLICY goals_insert_admin ON goals
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY goals_update_admin ON goals
  FOR UPDATE USING (is_admin());

CREATE POLICY goals_delete_admin ON goals
  FOR DELETE USING (is_admin());
