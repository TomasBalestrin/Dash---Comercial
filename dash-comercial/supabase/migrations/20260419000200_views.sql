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
