> 👁️ Visão | 19/04/2026 | v1.0

# Tech Stack — Dash Comercial

## 1. Visão geral

```
┌──────────────┐   HTTPS   ┌─────────────────┐   SQL+Realtime   ┌──────────────┐
│  Browser/TV  │ ────────→ │  Next.js 14     │ ───────────────→ │  Supabase    │
│  (Chrome)    │ ←──────── │  App Router     │ ←─────────────── │  (PG + Auth) │
└──────────────┘   SSE     │  (Vercel Edge)  │   Storage CDN    └──────────────┘
                           └─────────────────┘
```

- **Client** (browser de admin ou TV): conecta via HTTPS ao Next.js.
- **Next.js**: renderiza páginas (Server Components default), expõe API routes, faz proxy para Supabase server-side.
- **Supabase**: Postgres + Auth + Realtime (WebSocket) + Storage para imagens.
- **Vercel**: host do Next.js, env vars, preview deploys por branch.

## 2. Core stack

### Next.js 14+ (App Router)
- **Justificativa**: Server Components reduzem bundle client, middleware para auth, Edge Runtime para rotas leves, file-based routing.
- **Config**: `output: 'standalone'` desabilitado (Vercel gerencia). `experimental.serverActions` desabilitado (usamos API routes por consistência). `images.remotePatterns` para domínios do Supabase Storage.
- **Versão**: 14.2.x (estável).

### TypeScript 5 strict
- **Justificativa**: type safety em toda camada.
- **Config `tsconfig.json`**:
  - `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`.
  - `"paths": { "@/*": ["./src/*"] }`.
  - `"target": "ES2022"`, `"moduleResolution": "bundler"`.

### Tailwind CSS 3
- **Justificativa**: utility-first, zero runtime, tree-shake automático.
- **Config `tailwind.config.ts`**:
  - `darkMode: 'class'` (app sempre em dark mode).
  - Fontes: `fontFamily.rajdhani`, `fontFamily.inter`.
  - Cores customizadas: `bg.main: #040811`, `bg.card: #0C1523`, `bg.cardSoft: #14233A`, `border.card: #1A2330`, `accent.gold: #F5B942`, `accent.coral: #E8724A`, `accent.blue: #58A6FF`.
  - `borderRadius.card: 20px`, `borderRadius.pill: 99px`.
  - Plugin `@tailwindcss/forms`.

### shadcn/ui
- **Justificativa**: componentes acessíveis copiados para o repo (sem lock de versão), customização total.
- **Instalar apenas**: Button, Input, Label, Dialog, AlertDialog, DropdownMenu, Sheet (drawer), Table, Toast, Select, Command (searchable select), Form, Popover, Calendar (date picker).
- **Comando**: `npx shadcn@latest add button input label ...`

### Supabase
- **Versão**: `@supabase/supabase-js` 2.45+, `@supabase/ssr` 0.5+.
- **Serviços usados**:
  - **Postgres** — dados estruturados, RLS ativo em tudo.
  - **Auth** — email+senha, cookies HTTP-only via `@supabase/ssr`.
  - **Storage** — buckets `team-banners` e `closer-photos`, RLS no bucket.
  - **Realtime** — canal por tabela (`sales`, `monthly_metrics`, `goals`) subscrito pelo `/dashboard`.
- **Config**: project novo (não reusar projeto existente da Bethel). Nome: `bethel-dash-comercial`. Region: `sa-east-1` (São Paulo).

### Zustand 5
- **Justificativa**: state UI global (ex: drawer aberto, modal, toasts locais). Bundle < 1KB.
- **NÃO usar para**: dados do servidor (quem faz isso é TanStack Query).

### TanStack Query 5
- **Justificativa**: cache de dados server, revalidação, mutations com optimistic updates.
- **Config**: `staleTime: 30_000`, `refetchOnWindowFocus: true`, `retry: 1`.

### React Hook Form + Zod
- **Justificativa**: forms performáticos + validação compartilhada client/server (mesmo schema Zod).
- **Padrão**: schemas em `src/lib/schemas/[dominio].ts` exportados para client e route handlers.

### Framer Motion 11
- **Justificativa**: animações do dashboard (slide-in de novas vendas, flash glow, transições de números).
- **Escopo restrito**: usar apenas no `/dashboard`. Admin fica sem animações.

### Lucide React
- **Justificativa**: ícones leves, tree-shakeable. Padrão do shadcn.

### Fontes — **Rajdhani + Inter**
- **Rajdhani** (500/600/700) — **específica deste projeto**, usada no dashboard TV conforme design original.
- **Inter** (400/500/600) — para o painel admin (leitura mais confortável em forms).
- Carregar via `next/font/google` com `display: 'swap'` e subset `latin`.
- **ATENÇÃO**: este projeto NÃO usa Plus Jakarta Sans (fonte padrão do ecossistema Bethel).

## 3. Frontend

### Estilização
- **Tailwind only**. Zero CSS Modules. Zero styled-components.
- Exceção: inline `style={{}}` no dashboard `/dashboard` é aceitável devido às animações calculadas (glow dinâmico, gradient com accent variável).
- Variáveis CSS apenas para runtime theme tokens se necessário (não previsto no MVP).

### State
- **Server state** → TanStack Query (fetch via `fetch('/api/...')` ou direto Supabase em Server Components).
- **UI state** → Zustand (stores em `src/stores/`).
- **Form state** → React Hook Form.

### Validação
- Zod em todo input (client no form + server na route). Schemas compartilhados.
- Client valida para UX. Server valida para segurança — **nunca confiar no client**.

## 4. Pacotes extras

| Pacote | Versão | Propósito |
|---|---|---|
| `@supabase/supabase-js` | ^2.45 | Client Supabase |
| `@supabase/ssr` | ^0.5 | Cookies HTTP-only (SSR/middleware) |
| `@tanstack/react-query` | ^5.51 | Server state cache |
| `zustand` | ^5.0 | UI state |
| `react-hook-form` | ^7.53 | Forms |
| `@hookform/resolvers` | ^3.9 | Zod resolver |
| `zod` | ^3.23 | Schema validation |
| `framer-motion` | ^11 | Animações do `/dashboard` |
| `lucide-react` | ^0.453 | Ícones |
| `date-fns` | ^4.1 | Manipulação de datas (timezone SP) |
| `date-fns-tz` | ^3.2 | Timezone helpers |
| `clsx` | ^2.1 | Conditional classes |
| `tailwind-merge` | ^2.5 | Merge seguro de classes Tailwind |

**NÃO instalar**: `axios`, `moment`, `lodash` (usar funções nativas ou utilitários específicos), `redux`, `styled-components`, `material-ui`, `chakra`.

## 5. Infra

### Envs

**Development (`.env.local`)**:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...          # só server
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PODIUM_GLOW=true           # toggle do glow no 1º
NEXT_PUBLIC_DASHBOARD_POLL_MS=30000    # fallback polling
```

**Preview (Vercel Preview)**: mesmas keys, `NEXT_PUBLIC_SITE_URL=${VERCEL_URL}`.

**Production (Vercel)**: URLs do domínio final (ex: `dash.bethel.com.br`).

### CI/CD

- **Vercel** conectado ao GitHub.
- Branch `main` → produção.
- Branch `develop` → preview.
- Feature branches → preview por PR.
- Build command: `next build`.
- Install: `npm install`.

### Monitoramento

- **Vercel Analytics** — page views, perf.
- **Supabase Dashboard** — queries lentas, tamanho DB, Auth users.
- **Logs**: `console.error("[MODULO]", error)` em toda rota; Vercel captura e exibe.
- **Sem Sentry no MVP** (adicionar se precisar).

## 6. Responsividade

**Admin panel**:
- `sm` 640px — forms fullscreen, sidebar vira drawer.
- `md` 768px — layout de 2 colunas em algumas listas.
- `lg` 1024px — sidebar fixa, tabelas completas.
- `xl` 1280px — max-width 1440px com padding generoso.

**Dashboard TV**:
- Não usa breakpoints. Canvas fixo 1920×1080 + auto-scale.
- Alvo primário: TVs 16:9 (Full HD, 4K).
- Aceita letterbox em proporções diferentes (21:9, 4:3).

## 7. ADRs

### ADR-001: Rota `/dashboard` pública (sem auth)
**Contexto**: TV do escritório precisa exibir o dashboard 24/7 sem login a cada reboot.
**Decisão**: `/dashboard` é pública; RLS do Postgres garante que só colunas agregadas (sem `client_name`) vazem via `v_dashboard_current`.
**Alternativas**:
- Auth com "kiosk user" de longa duração — complexo, risco de vazar credencial.
- Tunnel interno com VPN — overhead operacional alto.
**Consequências**: Se o URL vazar, concorrência vê ranking e totais (sem nomes de clientes). Aceito pelo stakeholder.

### ADR-002: Rajdhani no lugar de Plus Jakarta Sans
**Contexto**: Design original do dashboard foi feito em Rajdhani (estética "gamer/esports" adequada ao ranking competitivo).
**Decisão**: Este projeto usa Rajdhani + Inter, quebrando o padrão do ecossistema Bethel.
**Alternativas**: Refazer design com Plus Jakarta — retrabalho sem valor.
**Consequências**: 2 fontes no projeto (Rajdhani para dashboard, Inter para admin). Documentar bem para futuros devs não confundirem.

### ADR-003: Canvas 1920×1080 (não 1920×1200 do design)
**Contexto**: Design original é 1920×1200 (16:10). TVs atuais são majoritariamente 16:9.
**Decisão**: Adaptar para 1920×1080 reduzindo padding vertical dos cards (~120px total distribuídos).
**Alternativas**: Manter 1200 e aceitar letterbox em todas as TVs.
**Consequências**: Zero letterbox em TVs padrão. Leve compactação vertical — preservamos proporções horizontais.

### ADR-004: Views SQL vs agregação no client
**Contexto**: Dashboard precisa agregar totais de vendas/entrada por closer/time/produto.
**Decisão**: Criar views `v_closer_monthly`, `v_team_monthly`, `v_product_monthly`, `v_dashboard_current` e consumir via endpoint único.
**Alternativas**: Agregar no client após fetch `sales` raw — lento e expõe `client_name` publicamente.
**Consequências**: Dashboard faz 1 fetch ao endpoint público; views recalculam on-the-fly (OK até ~10k vendas/mês). Em escala maior, materialized view.

### ADR-005: Supabase Realtime + fallback polling
**Contexto**: WebSocket pode cair; TV não pode ficar defasada.
**Decisão**: Client subscribe Realtime; se `onError`, dispara polling a cada `NEXT_PUBLIC_DASHBOARD_POLL_MS` (30s). Ao reconectar, para o polling.
**Consequências**: Resiliência; custo marginal de requisições quando desconectado.

### ADR-006: Soft delete em sales, teams, closers, products
**Contexto**: Admin pode errar e querer restaurar.
**Decisão**: Coluna `deleted_at TIMESTAMPTZ`; views filtram `WHERE deleted_at IS NULL`. Sem UI de restauração no MVP (faz no SQL direto se precisar).
**Consequências**: Tabelas não encolhem; baixo overhead para volume esperado.
