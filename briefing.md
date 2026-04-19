> 🛡️ Capitão América | 19/04/2026 | v1.0

# Briefing — Dash Comercial

## 1. Identidade

- **Nome**: Dash Comercial
- **Descrição (1 frase)**: Sistema interno para gestão de métricas e ranking de closers comerciais, com dashboard em tempo real para exibição em TV.
- **Empresa**: Bethel Educação (MV4 Digital Ltda)

## 2. Problema & Público

- **Problema**: O dashboard comercial atual depende de várias planilhas interligadas, tornando o admin o único ponto de atualização — frágil, lento e não-autônomo.
- **Solução**: Sistema web próprio com CRUD de times/closers/produtos/vendas, métricas calculadas automaticamente a partir de vendas individuais cadastradas, e rota de dashboard fullscreen para TV com atualização em tempo real.
- **Público-alvo**: Admin comercial da Bethel (preenchimento) + time comercial (visualização na TV do escritório).

## 3. Features

1. **Autenticação** — Login email+senha (Supabase Auth). Sem registro público.
2. **CRUD Times** — Criar times com nome, banner, cor de destaque, shape do banner. MVP: 2 times.
3. **CRUD Closers** — Criar closers com nome, foto, cor de destaque. Vinculação a 1 time.
4. **CRUD Produtos** — Criar produtos apenas com nome.
5. **Registro de Vendas** — Cadastrar venda individual: closer, produto, cliente, data, valor total, valor entrada. Alimenta as agregações.
6. **Métricas Mensais** — Admin preenche mensalmente por closer: número de calls e conversão (%).
7. **Meta Mensal** — Admin define valor da meta do mês.
8. **Dashboard TV** — Rota `/dashboard` fullscreen, sem menu, auto-scale 1920×1080, atualização em tempo real (Supabase Realtime). Exibe: meta do mês, podium TOP 3 closers, vendas por produto, últimas vendas, coluna por time com stats e lista de closers.
9. **Painel Admin** — Rota `/admin/*` com menu lateral para todas as operações de CRUD.

## 4. Roles

- **Admin único** (MVP) — acesso total. Todos os usuários autenticados são admin por enquanto.
- Perfis adicionais (viewer/closer) ficam fora do escopo MVP.

## 5. Auth

- Supabase Auth (email + senha).
- Sem signup público — usuários criados manualmente no Supabase Dashboard.
- Tokens via `@supabase/ssr` (cookies HTTP-only).

## 6. Pagamento

- Não aplicável — sistema interno.

## 7. Integrações externas

- Nenhuma. Todos os dados entram manualmente.

## 8. MVP vs Completo

- **MVP** — escopo definido acima. Sem relatórios, sem exports, sem histórico comparativo, sem multi-tenant.

## 9. Métricas no dashboard

- **Por closer**: Vendas (agregado do mês), Entrada (agregado do mês), Calls (input manual), Conversão (input manual).
- **Por time**: Total Vendas (soma closers), Total Entrada (soma closers).
- **Global**: Meta do mês vs. Vendas totais do mês (progress bar).
- **Ranking**: TOP 3 closers por Vendas do mês em formato podium.
- **Produtos**: valor agregado de vendas por produto no mês.
- **Últimas vendas**: 6 mais recentes (feed tempo real).

## 10. Período

- **Mês corrente** (timezone `America/Sao_Paulo`). Corte no dia 1.
- Sem histórico, sem seletor de mês anterior no MVP.

## 11. Dashboard TV — requisitos específicos

- Canvas base: **1920×1080** (16:9, padrão TV moderna).
- Auto-scale via `Math.min(sx, sy)` → encaixa em qualquer resolução sem cortar.
- Sem menu, sem header, sem sidebar. Rota isolada.
- Relógio ao vivo no card de meta.
- Podium com glow no 1º lugar.
- Ribbon "LIDERANDO" no time à frente.
- Animação slide-in + flash glow quando nova venda chega (Realtime).

## 12. Design System

- **Fonte principal**: Rajdhani (500/600/700) — **específico deste projeto**, não o Plus Jakarta padrão do ecossistema Bethel.
- **Fonte secundária**: Inter (para inputs e forms do admin).
- **Background**: `#040811` (radial gradient a partir do topo).
- **Cards**: `#0C1523` com border `#1A2330`, radius 20px.
- **Card soft**: `#14233A`.
- **Accent primário**: gold `rgb(245,185,66)`.
- **Accent secundário**: coral `rgb(232,114,74)`, blue `rgb(88,166,255)`.
- **Gradients de time** (configuráveis via enum de presets):
  - `blue`: `linear-gradient(135deg, rgb(14,28,48) 0%, rgb(30,55,90) 50%, rgb(12,22,38) 100%)`
  - `coral`: `linear-gradient(135deg, rgb(40,18,10) 0%, rgb(90,35,20) 45%, rgb(20,10,4) 100%)`
  - `green`: `linear-gradient(135deg, rgb(10,32,20) 0%, rgb(30,75,45) 50%, rgb(8,22,14) 100%)`
  - `purple`: `linear-gradient(135deg, rgb(22,12,40) 0%, rgb(55,30,90) 50%, rgb(14,8,28) 100%)`

## 13. Stack

Next.js 14 App Router | TypeScript strict | Supabase (PG + Auth + Storage + Realtime) | Tailwind 3 | shadcn/ui | Zustand | TanStack Query | RHF + Zod | Framer Motion | Vercel.

## 14. Arquivos esperados

`docs/PRD.md`, `docs/tech-stack.md`, `docs/architecture.md`, `docs/schema.md`, `docs/security.md`, `docs/ux-flows.md`, `CLAUDE.md`, `docs/TASKS.md`, `docs/progress.html`, `docs/instrucoes.md`.
