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
