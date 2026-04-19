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
