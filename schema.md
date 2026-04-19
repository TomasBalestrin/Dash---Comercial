> 💚 Hulk | 19/04/2026 | v1.0

# Schema — Dash Comercial

## 1. Diagrama de relacionamentos

```
auth.users 1──1 profiles
teams      1──N closers       (ON DELETE SET NULL em closers)
closers    1──N sales         (ON DELETE SET NULL em sales)
products   1──N sales         (ON DELETE SET NULL em sales)
closers    1──N monthly_metrics (ON DELETE CASCADE)
goals      (standalone, UNIQUE month)
```

Storage buckets: `team-banners`, `closer-photos`.

## 2. Migration order

1. Extensions
2. Enums
3. Functions (trigger helpers)
4. Tabelas sem FK (teams, products, goals)
5. Tabelas com FK (profiles, closers, sales, monthly_metrics)
6. Indexes
7. Triggers
8. RLS policies
9. Views
10. Storage buckets
11. Seed

---

## 3. `20260419000000_init.sql` — Extensions, Enums, Functions, Tables, Indexes, Triggers

```sql
-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('admin');
CREATE TYPE gradient_preset AS ENUM ('blue', 'coral', 'green', 'purple');
CREATE TYPE team_shape AS ENUM ('triangle', 'chevron', 'hexagon');

-- ============================================
-- FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Handler para criar profile ao registrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name)
  VALUES (NEW.id, 'admin', COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TABLES
-- ============================================

-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'admin',
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  banner_url TEXT,
  accent_color TEXT NOT NULL DEFAULT '#F5B942',
  gradient_preset gradient_preset NOT NULL DEFAULT 'blue',
  shape team_shape NOT NULL DEFAULT 'triangle',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- closers
CREATE TABLE closers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo_url TEXT,
  initials TEXT NOT NULL,
  accent_color TEXT NOT NULL DEFAULT '#F5B942',
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT initials_length CHECK (char_length(initials) BETWEEN 1 AND 3)
);

-- sales
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  closer_id UUID REFERENCES closers(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  sale_date DATE NOT NULL,
  value_total NUMERIC(12,2) NOT NULL CHECK (value_total > 0),
  value_entrada NUMERIC(12,2) NOT NULL CHECK (value_entrada >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT entrada_lte_total CHECK (value_entrada <= value_total),
  CONSTRAINT sale_date_not_future CHECK (sale_date <= CURRENT_DATE)
);

-- monthly_metrics (calls + conversão por closer × mês)
CREATE TABLE monthly_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  closer_id UUID NOT NULL REFERENCES closers(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  calls INT NOT NULL DEFAULT 0 CHECK (calls >= 0),
  conversion_pct NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_pct BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(closer_id, month),
  CONSTRAINT month_is_first_day CHECK (EXTRACT(DAY FROM month) = 1)
);

-- goals (meta mensal global)
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month DATE NOT NULL UNIQUE,
  target_value NUMERIC(12,2) NOT NULL CHECK (target_value > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT goal_month_is_first_day CHECK (EXTRACT(DAY FROM month) = 1)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_closers_team_id ON closers(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_closers_display_order ON closers(display_order) WHERE deleted_at IS NULL;

CREATE INDEX idx_sales_closer_id ON sales(closer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_sales_product_id ON sales(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_sales_sale_date ON sales(sale_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_sales_created_at ON sales(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_sales_client_trgm ON sales USING gin (client_name gin_trgm_ops) WHERE deleted_at IS NULL;

CREATE INDEX idx_monthly_metrics_month ON monthly_metrics(month);
CREATE INDEX idx_monthly_metrics_closer_month ON monthly_metrics(closer_id, month);

CREATE INDEX idx_goals_month ON goals(month DESC);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER closers_updated_at BEFORE UPDATE ON closers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER sales_updated_at BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER monthly_metrics_updated_at BEFORE UPDATE ON monthly_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger para criar profile ao registrar user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 4. `20260419000100_rls.sql` — Row Level Security

```sql
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
```

---

## 5. `20260419000200_views.sql` — Views agregadas

```sql
-- ============================================
-- Mês corrente no timezone São Paulo
-- ============================================
CREATE OR REPLACE FUNCTION current_month_sp()
RETURNS DATE AS $$
BEGIN
  RETURN DATE_TRUNC('month', (NOW() AT TIME ZONE 'America/Sao_Paulo'))::DATE;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- v_closer_monthly — totais por closer × mês
-- ============================================
CREATE OR REPLACE VIEW v_closer_monthly AS
SELECT
  c.id AS closer_id,
  c.name,
  c.photo_url,
  c.initials,
  c.accent_color,
  c.team_id,
  c.display_order,
  DATE_TRUNC('month', s.sale_date)::DATE AS month,
  COALESCE(SUM(s.value_total), 0)::NUMERIC(12,2) AS total_vendas,
  COALESCE(SUM(s.value_entrada), 0)::NUMERIC(12,2) AS total_entrada,
  COUNT(s.id)::INT AS num_vendas
FROM closers c
LEFT JOIN sales s
  ON s.closer_id = c.id
  AND s.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.name, c.photo_url, c.initials, c.accent_color, c.team_id, c.display_order, DATE_TRUNC('month', s.sale_date);

-- ============================================
-- v_team_monthly — totais por time × mês
-- ============================================
CREATE OR REPLACE VIEW v_team_monthly AS
SELECT
  t.id AS team_id,
  t.name,
  t.banner_url,
  t.accent_color,
  t.gradient_preset,
  t.shape,
  t.display_order,
  m.month,
  COALESCE(SUM(cm.total_vendas), 0)::NUMERIC(12,2) AS total_vendas,
  COALESCE(SUM(cm.total_entrada), 0)::NUMERIC(12,2) AS total_entrada,
  COUNT(DISTINCT cm.closer_id) FILTER (WHERE cm.num_vendas > 0)::INT AS active_closers
FROM teams t
LEFT JOIN v_closer_monthly cm ON cm.team_id = t.id
CROSS JOIN LATERAL (SELECT DISTINCT cm2.month FROM v_closer_monthly cm2) m
WHERE t.deleted_at IS NULL
  AND (cm.month = m.month OR cm.month IS NULL)
GROUP BY t.id, t.name, t.banner_url, t.accent_color, t.gradient_preset, t.shape, t.display_order, m.month;

-- ============================================
-- v_product_monthly — totais por produto × mês
-- ============================================
CREATE OR REPLACE VIEW v_product_monthly AS
SELECT
  p.id AS product_id,
  p.name,
  DATE_TRUNC('month', s.sale_date)::DATE AS month,
  COALESCE(SUM(s.value_total), 0)::NUMERIC(12,2) AS total_vendas,
  COUNT(s.id)::INT AS num_vendas
FROM products p
LEFT JOIN sales s
  ON s.product_id = p.id
  AND s.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, DATE_TRUNC('month', s.sale_date);

-- ============================================
-- v_latest_sales_public — últimas 20, SEM client_name pro público
-- ============================================
CREATE OR REPLACE VIEW v_latest_sales_public AS
SELECT
  s.id,
  s.closer_id,
  c.name AS closer_name,
  c.initials AS closer_initials,
  c.accent_color AS closer_accent,
  s.product_id,
  p.name AS product_name,
  -- Cliente mascarado: "Maria S." -> "Maria S."; "João" -> "João"
  -- No dashboard o design original mostra nome parcial ("Gabriel S.") — OK expor apenas primeiro nome + inicial sobrenome
  CASE
    WHEN position(' ' in sa.client_name) > 0 THEN
      split_part(sa.client_name, ' ', 1) || ' ' || upper(substring(split_part(sa.client_name, ' ', 2) from 1 for 1)) || '.'
    ELSE sa.client_name
  END AS client_name_masked,
  s.sale_date,
  s.created_at
FROM sales s
JOIN closers c ON c.id = s.closer_id
JOIN products p ON p.id = s.product_id
CROSS JOIN LATERAL (SELECT s.client_name) sa
WHERE s.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND p.deleted_at IS NULL
ORDER BY s.created_at DESC
LIMIT 20;
```

---

## 6. `20260419000300_storage.sql` — Buckets

```sql
-- ============================================
-- Buckets
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('team-banners', 'team-banners', true, 2097152, ARRAY['image/png','image/jpeg','image/webp']),
  ('closer-photos', 'closer-photos', true, 2097152, ARRAY['image/png','image/jpeg','image/webp']);

-- ============================================
-- Storage RLS — upload só admin, leitura pública
-- ============================================
CREATE POLICY "team_banners_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-banners');

CREATE POLICY "team_banners_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'team-banners' AND is_admin());

CREATE POLICY "team_banners_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'team-banners' AND is_admin());

CREATE POLICY "team_banners_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'team-banners' AND is_admin());

CREATE POLICY "closer_photos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'closer-photos');

CREATE POLICY "closer_photos_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'closer-photos' AND is_admin());

CREATE POLICY "closer_photos_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'closer-photos' AND is_admin());

CREATE POLICY "closer_photos_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'closer-photos' AND is_admin());
```

---

## 7. `20260419000400_seed.sql` — Seed dev

```sql
-- ============================================
-- SEED — apenas dev. Comentar antes de rodar em prod.
-- ============================================

-- Times
INSERT INTO teams (id, name, accent_color, gradient_preset, shape, display_order)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'ATLAS', '#58A6FF', 'blue', 'triangle', 0),
  ('22222222-2222-2222-2222-222222222222', 'APEX', '#E8724A', 'coral', 'chevron', 1);

-- Produtos
INSERT INTO products (name) VALUES
  ('Elite Premium'),
  ('Pro Starter'),
  ('Growth Plan'),
  ('Launch Pack'),
  ('Mentoria 1-1');

-- Closers time ATLAS
INSERT INTO closers (name, initials, accent_color, team_id, display_order) VALUES
  ('Tainara', 'TA', '#F5B942', '11111111-1111-1111-1111-111111111111', 0),
  ('Rafael',  'RA', '#E8724A', '11111111-1111-1111-1111-111111111111', 1),
  ('Mariana', 'MA', '#64B4FF', '11111111-1111-1111-1111-111111111111', 2),
  ('João',    'JO', '#96C878', '11111111-1111-1111-1111-111111111111', 3);

-- Closers time APEX
INSERT INTO closers (name, initials, accent_color, team_id, display_order) VALUES
  ('Beatriz', 'BE', '#C88CDC', '22222222-2222-2222-2222-222222222222', 0),
  ('Luiz',    'LU', '#F07896', '22222222-2222-2222-2222-222222222222', 1),
  ('Camila',  'CA', '#78DCC8', '22222222-2222-2222-2222-222222222222', 2),
  ('Diego',   'DI', '#FFA050', '22222222-2222-2222-2222-222222222222', 3);

-- Meta do mês
INSERT INTO goals (month, target_value)
VALUES (current_month_sp(), 5000000);

-- Métricas mensais iniciais (todos zerados)
INSERT INTO monthly_metrics (closer_id, month, calls, conversion_pct)
SELECT id, current_month_sp(), 0, 0 FROM closers;
```

---

## 8. Realtime — tabelas publicadas

No Supabase Dashboard (**Database → Replication**), habilitar Realtime em:
- `sales`
- `monthly_metrics`
- `goals`
- `closers` (para refletir mudanças de team_id ao vivo no dashboard)
- `teams`

---

## 9. Checklist pós-migração

- [ ] RLS ativo em todas as 7 tabelas.
- [ ] Buckets criados e públicos para leitura.
- [ ] Views criadas e retornando dados.
- [ ] Realtime habilitado nas 5 tabelas.
- [ ] Trigger `on_auth_user_created` ativo.
- [ ] Seed rodou em dev.
- [ ] `current_month_sp()` retorna corretamente (ex: `2026-04-01`).
