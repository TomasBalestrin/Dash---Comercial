> 🔴 Iron Man | 19/04/2026 | v1.0

# PRD — Dash Comercial

## 1. Visão

### Problema
O dashboard comercial da Bethel Educação hoje é montado em planilhas interligadas. O admin é único ponto de atualização. Isso gera três problemas: (1) dependência humana para refresh de dados, (2) lentidão entre fato e visualização, (3) impossibilidade de escalar sem retrabalho.

### Solução
Sistema web próprio com:
- CRUD dedicado de entidades comerciais (times, closers, produtos, vendas).
- Agregações automáticas (vendas e entrada calculadas a partir de vendas individuais).
- Inputs manuais apenas para métricas não-derivadas (calls e conversão) e meta mensal.
- Rota `/dashboard` isolada em fullscreen para TV, com atualização em tempo real via Supabase Realtime.

### Personas

**Admin Comercial** (único usuário cadastrado no MVP)
- Cadastra times, closers, produtos.
- Registra cada venda no sistema.
- Atualiza mensalmente calls e conversão por closer.
- Define meta do mês.

**Time Comercial (Viewer — passivo, não-autenticado)**
- Visualiza o dashboard na TV do escritório.
- Não interage com o sistema.

### KPIs de sucesso

| KPI | Alvo | Como medir |
|---|---|---|
| Tempo de atualização dashboard após venda | < 3s | Tempo entre `INSERT sales` e render via Realtime |
| Zero dependência de planilha externa | 100% | Inspeção manual pós-migração |
| Uptime dashboard TV | ≥ 99% | Vercel Analytics |
| Autonomia do admin | 100% | Admin consegue cadastrar tudo sozinho, sem dev |

## 2. Features

---

### F1 — Autenticação
**Prioridade**: P0

**Descrição**: Login email + senha usando Supabase Auth. Sem signup público. Usuários criados manualmente no Supabase Dashboard.

**User stories**:
- Como admin, quero fazer login com email e senha para acessar o painel.
- Como admin, quero ser redirecionado automaticamente para `/admin` após login.
- Como usuário não autenticado tentando acessar `/admin`, quero ser redirecionado para `/login`.
- Como usuário não autenticado acessando `/dashboard`, **quero ter acesso público de visualização** (a TV do escritório não pode depender de login). [INFERIDO — dashboard público-read]

**Critérios de aceitação**:
- [ ] Página `/login` com campos email + senha + botão "Entrar".
- [ ] Erro de credencial inválida renderizado inline.
- [ ] Após login bem-sucedido, redireciona para `/admin`.
- [ ] Logout disponível no header do admin.
- [ ] Rotas `/admin/*` protegidas por middleware — redirecionam para `/login` se não autenticado.
- [ ] Rota `/dashboard` **pública** (sem auth) — qualquer navegador na rede com o link consegue acessar.
- [ ] Sessão persiste via cookies HTTP-only (sem localStorage).

**Regras de negócio**:
- Apenas admins existem no MVP. Tabela `profiles` com coluna `role` (enum) — deixar estrutura pronta para `viewer` e `closer` no futuro, mas só `admin` ativo.
- Signup desabilitado no Supabase Dashboard.

---

### F2 — CRUD Times
**Prioridade**: P0

**Descrição**: Criar, editar, listar, deletar times. MVP limita a 2 times ativos mas o sistema suporta N.

**User stories**:
- Como admin, quero criar um time com nome, banner, cor de destaque e preset de gradient.
- Como admin, quero editar/deletar times existentes.
- Como admin, quero fazer upload do banner (imagem) do time.

**Critérios de aceitação**:
- [ ] Página `/admin/times` lista times em cards com preview do banner.
- [ ] Botão "Novo time" abre drawer/modal com formulário.
- [ ] Form com: nome (string, max 40), banner (upload image, max 2MB, aceita PNG/JPG/WEBP), accent_color (color picker com presets + custom), gradient_preset (select: blue, coral, green, purple), shape (select: triangle, chevron, hexagon), display_order (int).
- [ ] Validação Zod client + server.
- [ ] Upload para Supabase Storage bucket `team-banners`.
- [ ] Delete com `AlertDialog` de confirmação.
- [ ] Toast success/error.
- [ ] Empty state quando não há times.

**Regras**:
- Não permite deletar time com closers vinculados. Erro: "Remova ou realoque closers antes de deletar o time".
- `display_order` define ordem no dashboard (esquerda → direita).

---

### F3 — CRUD Closers
**Prioridade**: P0

**Descrição**: Criar, editar, listar, deletar closers. Cada closer pertence a 1 time.

**User stories**:
- Como admin, quero criar closer com nome, foto, iniciais, cor de destaque e time.
- Como admin, quero transferir closer entre times.

**Critérios de aceitação**:
- [ ] Página `/admin/closers` lista closers agrupados por time.
- [ ] Form com: nome (string, max 40), foto (upload image, max 2MB, quadrada 512×512 recomendada), initials (string, max 3, auto-preenche a partir do nome), accent_color, team_id (select com times existentes), display_order.
- [ ] Upload para bucket `closer-photos`.
- [ ] Se closer não tem foto, exibe avatar com iniciais e accent color.
- [ ] Validação Zod.
- [ ] Toast feedback.
- [ ] Empty state.

**Regras**:
- Iniciais auto-geradas: primeira letra do primeiro nome + primeira letra do último nome (ex: "Tainara Silva" → "TS"). Override manual permitido.
- Delete preserva vendas históricas via `ON DELETE SET NULL` em `sales.closer_id`.

---

### F4 — CRUD Produtos
**Prioridade**: P0

**Descrição**: Criar, editar, listar, deletar produtos (apenas nome).

**User stories**:
- Como admin, quero cadastrar produtos para associar às vendas.

**Critérios de aceitação**:
- [ ] Página `/admin/produtos` com tabela simples.
- [ ] Form inline (novo + edit) com único campo: nome (string, max 60, unique).
- [ ] Delete com confirmação.
- [ ] Erro se produto tem vendas: "Produto possui vendas cadastradas. Não pode ser deletado".
- [ ] Empty state.

---

### F5 — Registro de Vendas
**Prioridade**: P0

**Descrição**: CRUD de vendas individuais. Cada venda alimenta as agregações do dashboard.

**User stories**:
- Como admin, quero cadastrar cada venda (closer + produto + cliente + data + valor total + valor entrada) rapidamente.
- Como admin, quero ver histórico de vendas do mês.
- Como admin, quero editar/deletar uma venda errada.

**Critérios de aceitação**:
- [ ] Página `/admin/vendas` com tabela paginada (50/pág) das vendas do **mês corrente** por default. Filtro para mudar mês se desejado.
- [ ] Botão "Nova venda" abre drawer lateral.
- [ ] Form com: closer_id (searchable select com foto+nome), product_id (select), client_name (string, max 80), sale_date (date, default hoje), value_total (currency BRL, > 0), value_entrada (currency BRL, ≥ 0, ≤ value_total).
- [ ] Após submit, insere em `sales` → trigger Realtime → dashboard atualiza em < 3s.
- [ ] Toast "Venda registrada" + highlight na tabela.
- [ ] Edit/Delete por linha com confirmação.
- [ ] Busca por cliente (debounce 300ms).
- [ ] Filtros: closer, produto, período (date range).

**Regras**:
- `value_entrada ≤ value_total` validado client + server (Zod + constraint CHECK).
- Soft delete (`deleted_at`) para permitir restauração em 30 dias.
- Trigger SQL atualiza `updated_at`.

---

### F6 — Métricas Mensais (Calls + Conversão)
**Prioridade**: P0

**Descrição**: Admin preenche mensalmente por closer: número de calls e conversão (%).

**User stories**:
- Como admin, quero uma tela única onde eu atualizo calls e conv de todos os closers do mês em uma tabela editável.

**Critérios de aceitação**:
- [ ] Página `/admin/metricas` com seletor de mês (default: mês corrente).
- [ ] Tabela com linhas por closer e colunas: Nome, Calls (input number ≥ 0), Conversão (input number 0–100).
- [ ] Se não existe registro `monthly_metrics` para o mês, linha é criada no submit com valores 0.
- [ ] Botão "Salvar" ao fim — persiste todas as linhas editadas em batch.
- [ ] Indicador de "alterações não salvas" no topo.
- [ ] Toast ao salvar.

**Regras**:
- Unique `(closer_id, month)`. Upsert no save.
- `month` armazenado como `DATE` do primeiro dia do mês (ex: `2026-04-01`).
- Conversão: NUMERIC(5,2), 0 ≤ x ≤ 100.

---

### F7 — Meta Mensal
**Prioridade**: P0

**Descrição**: Admin define valor da meta do mês.

**User stories**:
- Como admin, quero definir a meta de vendas do mês para aparecer no dashboard.

**Critérios de aceitação**:
- [ ] Página `/admin/meta` com seletor de mês + input currency BRL.
- [ ] Se meta não existe para o mês, mostra estado "Meta não definida" + input pra criar.
- [ ] Atualização em tempo real no dashboard (Realtime).

**Regras**:
- Unique `month`.
- Valor > 0.

---

### F8 — Dashboard TV (`/dashboard`)
**Prioridade**: P0

**Descrição**: Rota isolada, fullscreen, sem menu, auto-scale para qualquer TV. Atualização em tempo real.

**Seções do dashboard**:

**8.1 — Goal Card** (topo esquerdo)
- Label "META" + valor da meta do mês.
- Valor acumulado do mês (cor accent) + percentual.
- Progress bar com ticks em 25/50/75%.
- Rodapé: "ABRIL 2026 · MÊS EM CURSO" + relógio ao vivo "● AO VIVO HH:MM:SS".
- Flash glow quando nova venda chega.

**8.2 — Podium Card** (esquerda, abaixo do goal)
- Título "Ranking do mês" + badge "TOP 3".
- Pódio 2º / 1º / 3º (1º central e mais alto).
- Medalhas: gold (1º), silver (2º), coral/bronze (3º).
- Glow opcional no 1º (configurável via env `NEXT_PUBLIC_PODIUM_GLOW`).
- Cada posição: nome, total vendas, accent color do closer.

**8.3 — Vendas por Produto** (esquerda baixo, coluna esquerda)
- Lista de produtos com barra de progresso relativa ao max.
- Valor em R$ à direita.

**8.4 — Últimas Vendas** (esquerda baixo, coluna direita)
- 6 mais recentes do mês, ordenadas por `created_at DESC`.
- Cada linha: avatar (gradient accent do closer), closer, produto, cliente, data.
- Slide-in animation ao chegar nova venda via Realtime.
- Badge "● TEMPO REAL" no header.

**8.5 — Team Columns** (direita, 2 colunas lado a lado)
- Banner do time (gradient preset + shape SVG + nome).
- Ribbon diagonal "LIDERANDO" no time com maior total.
- 2 cards headline: Venda (total do time) + Entrada (total entrada do time).
- Lista de SellerCards verticais (ordenados por total desc).
- SellerCard: foto/avatar, nome, accent color, 4 métricas (Vendas, Entrada, Calls, Conv).

**Critérios de aceitação**:
- [ ] Rota pública (sem auth).
- [ ] Canvas fixo 1920×1080 com auto-scale `Math.min(sx, sy)` → qualquer TV encaixa sem cortar.
- [ ] Zero menu, header, ou navegação.
- [ ] Dados vêm de views SQL agregadas.
- [ ] Supabase Realtime subscreve `sales`, `monthly_metrics`, `goals` → re-fetch automático.
- [ ] Fallback de polling a cada 30s caso Realtime caia.
- [ ] Sem scroll (tudo cabe no viewport escalado).
- [ ] Perf: First Contentful Paint < 1.5s.
- [ ] Sem erros no console em 24h contínuas.

**Regras**:
- Período de agregação: **mês corrente** (timezone `America/Sao_Paulo`, corte dia 1 00:00).
- Se não há vendas, Podium mostra "—" nas 3 posições.
- Se time não tem closers, coluna exibe empty state "Sem closers no time".
- Relógio ao vivo: atualização a cada 1s (setInterval local).

---

### F9 — Painel Admin (Layout)
**Prioridade**: P0

**Descrição**: Layout com sidebar lateral + conteúdo. Contém menu para todos os CRUDs.

**Itens do menu**:
- Vendas (principal — ícone ShoppingCart)
- Métricas Mensais (ícone Phone)
- Meta (ícone Target)
- Times (ícone Users)
- Closers (ícone User)
- Produtos (ícone Package)
- Abrir Dashboard (link externo `_blank` para `/dashboard`, ícone Monitor)

**Critérios**:
- [ ] Sidebar fixa desktop, drawer mobile.
- [ ] Header com logo "Dash Comercial" + avatar/logout.
- [ ] Rota ativa destacada.
- [ ] Mobile: sidebar vira drawer via hamburger.

## 3. Modelo de Dados

### Entidades

**profiles** (espelha `auth.users`)
- id UUID PK (= auth.users.id)
- role ENUM('admin') default 'admin'
- name TEXT
- created_at, updated_at TIMESTAMPTZ

**teams**
- id UUID PK
- name TEXT NOT NULL (unique)
- banner_url TEXT
- accent_color TEXT (default '#F5B942')
- gradient_preset ENUM('blue','coral','green','purple') default 'blue'
- shape ENUM('triangle','chevron','hexagon') default 'triangle'
- display_order INT default 0
- created_at, updated_at, deleted_at

**products**
- id UUID PK
- name TEXT NOT NULL unique
- created_at, updated_at, deleted_at

**closers**
- id UUID PK
- name TEXT NOT NULL
- photo_url TEXT
- initials TEXT (max 3)
- accent_color TEXT default '#F5B942'
- team_id UUID FK → teams(id) ON DELETE SET NULL
- display_order INT default 0
- created_at, updated_at, deleted_at

**sales**
- id UUID PK
- closer_id UUID FK → closers(id) ON DELETE SET NULL
- product_id UUID FK → products(id) ON DELETE SET NULL
- client_name TEXT NOT NULL
- sale_date DATE NOT NULL
- value_total NUMERIC(12,2) NOT NULL CHECK (value_total > 0)
- value_entrada NUMERIC(12,2) NOT NULL CHECK (value_entrada >= 0)
- CHECK (value_entrada <= value_total)
- created_at, updated_at, deleted_at

**monthly_metrics**
- id UUID PK
- closer_id UUID FK → closers(id) ON DELETE CASCADE
- month DATE NOT NULL (primeiro dia do mês)
- calls INT NOT NULL default 0 CHECK (calls >= 0)
- conversion_pct NUMERIC(5,2) NOT NULL default 0 CHECK (conversion_pct BETWEEN 0 AND 100)
- UNIQUE(closer_id, month)
- created_at, updated_at

**goals**
- id UUID PK
- month DATE NOT NULL UNIQUE
- target_value NUMERIC(12,2) NOT NULL CHECK (target_value > 0)
- created_at, updated_at

### Relacionamentos

```
auth.users 1──1 profiles
teams 1──N closers
closers 1──N sales
closers 1──N monthly_metrics
products 1──N sales
```

### Views agregadas (para dashboard)

- `v_closer_monthly` — para cada closer × mês: total_vendas, total_entrada, num_vendas, calls, conversion_pct.
- `v_team_monthly` — para cada time × mês: total_vendas, total_entrada, num_closers.
- `v_product_monthly` — para cada produto × mês: total_vendas.
- `v_dashboard_current` — snapshot completo do mês corrente (join das views acima).

Detalhes SQL no `schema.md`.

## 4. API Routes

Todas auth'd exceto as marcadas `[PUBLIC]`.

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | public | Login email+senha (proxy Supabase) |
| POST | `/api/auth/logout` | auth | Logout + limpar cookies |
| GET | `/api/teams` | auth | Lista times |
| POST | `/api/teams` | auth | Cria time |
| PATCH | `/api/teams/[id]` | auth | Edita time |
| DELETE | `/api/teams/[id]` | auth | Soft delete (bloqueia se tem closers) |
| POST | `/api/teams/[id]/banner` | auth | Upload banner → Storage |
| GET | `/api/closers` | auth | Lista closers |
| POST | `/api/closers` | auth | Cria closer |
| PATCH | `/api/closers/[id]` | auth | Edita |
| DELETE | `/api/closers/[id]` | auth | Soft delete |
| POST | `/api/closers/[id]/photo` | auth | Upload foto |
| GET | `/api/products` | auth | Lista produtos |
| POST | `/api/products` | auth | Cria |
| PATCH | `/api/products/[id]` | auth | Edita |
| DELETE | `/api/products/[id]` | auth | Soft delete (bloqueia se tem vendas) |
| GET | `/api/sales` | auth | Lista com filtros (month, closer_id, product_id, search) |
| POST | `/api/sales` | auth | Cria venda |
| PATCH | `/api/sales/[id]` | auth | Edita |
| DELETE | `/api/sales/[id]` | auth | Soft delete |
| GET | `/api/metrics?month=YYYY-MM` | auth | Lista monthly_metrics do mês |
| PUT | `/api/metrics/batch` | auth | Upsert batch de metrics |
| GET | `/api/goals?month=YYYY-MM` | auth | Meta do mês |
| PUT | `/api/goals` | auth | Upsert meta do mês (body: month, target_value) |
| GET | `/api/dashboard/snapshot` | **PUBLIC** | Snapshot completo do mês corrente (view `v_dashboard_current`) |

**Response shape padrão**: `{ data: T }` (sucesso) ou `{ error: string }` (falha).

**Erros padronizados**:
- 400 — Zod validation
- 401 — sem auth (exceto rotas públicas)
- 403 — RLS bloqueou
- 404 — recurso não encontrado
- 422 — regra de negócio (ex: deletar time com closers)
- 500 — erro inesperado

## 5. Integrações

**Nenhuma integração externa** no MVP. Tudo manual/interno.

## 6. Auth & Roles

### Método
Supabase Auth (email + senha) via `@supabase/ssr`. Tokens em cookies HTTP-only.

### Tabela de permissões

| Recurso | admin | público (sem auth) |
|---|---|---|
| `/admin/*` | ✅ | ❌ (redirect login) |
| `/dashboard` | ✅ | ✅ |
| `/api/auth/*` | — | ✅ |
| `/api/dashboard/snapshot` | ✅ | ✅ |
| Todas outras `/api/*` | ✅ | ❌ 401 |
| SQL via RLS — SELECT em teams/closers/products/sales (leitura agregada) | ✅ | ✅ (necessário pro dashboard público) |
| SQL via RLS — INSERT/UPDATE/DELETE | ✅ | ❌ |

### Fluxo onboarding
Admin criado manualmente via Supabase Dashboard (Auth → Users → Add user). Após primeiro login, trigger cria linha em `profiles` com role='admin'.

## 7. Não-funcionais

| Requisito | Alvo |
|---|---|
| Dashboard TTI | < 2s |
| Dashboard update latency (Realtime) | < 3s |
| Admin page load | < 1s |
| Uptime | 99% (Vercel Hobby/Pro) |
| Browsers suportados | Chrome/Edge/Firefox últimas 2 versões |
| TV mode | TVs 16:9 Full HD + 4K (auto-scale absorve diferença) |
| Sem SEO (sistema interno) | noindex,nofollow |
| Acessibilidade painel admin | WCAG AA (keyboard nav, contraste 4.5:1, ARIA) |

## 8. Roadmap

**Fase 1 — MVP (4 semanas)**
- Setup Next.js + Supabase + Tailwind + shadcn.
- Schema + RLS + seeds.
- Auth + layout admin.
- CRUD Times + Closers + Produtos.
- CRUD Vendas.
- Métricas mensais + Meta.
- Dashboard TV completo.
- Deploy Vercel.

**Fase 2 — Pós-MVP (futuro, fora do escopo)**
- Seletor de mês histórico no dashboard.
- Exportação CSV.
- Role `viewer` (acesso read-only ao admin).
- Notificações push quando closer atinge meta.
- Dashboard comparativo mês atual vs anterior.

## 9. Riscos

| Risco | Prob | Impacto | Mitigação |
|---|---|---|---|
| Supabase Realtime flaky → TV trava | Média | Alto | Fallback polling 30s + toast discreto "reconectando" |
| Upload de banner quebra em TV antiga | Baixa | Baixo | Limitar 2MB, converter para WebP no client |
| Timezone errado nos agregados mensais | Média | Médio | `AT TIME ZONE 'America/Sao_Paulo'` em todas as views |
| Admin deleta closer com vendas | Alta | Baixo | `ON DELETE SET NULL` em sales + UI alerta |
| Rota `/dashboard` pública expõe nomes de clientes | Média | Médio | View pública exclui `client_name`; só mostra agregados + iniciais do closer |
| Múltiplos admins logados editando métricas simultaneamente | Baixa | Médio | Campo `updated_at` e `last_edited_by` para UI mostrar conflito |
| TV com proporção incomum (ultrawide 21:9) | Baixa | Baixo | Auto-scale min garante não-quebra; aceita letterbox |
| Admin cadastra venda com data no futuro | Baixa | Baixo | Validação Zod: `sale_date ≤ hoje` |
