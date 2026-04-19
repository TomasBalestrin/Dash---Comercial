> ⚡ Thor | 19/04/2026 | v1.0

# CLAUDE.md — Dash Comercial

## Sobre
Sistema interno Bethel para gestão de métricas/ranking de closers comerciais, com dashboard fullscreen em TV. **Stack**: Next.js 14 App Router · TypeScript strict · Supabase (PG + Auth + Realtime + Storage) · Tailwind 3 · shadcn/ui · Zustand · TanStack Query · RHF + Zod · Framer Motion · Vercel.

## Comandos
```bash
npm install                     # instalar deps
npm run dev                     # dev server localhost:3000
npm run build                   # build produção
npm run lint                    # eslint
npm run typecheck               # tsc --noEmit
supabase db push                # aplicar migrations (se CLI configurada)
```

## Estrutura
```
src/
├── app/
│   ├── (auth)/login/
│   ├── (admin)/admin/{vendas,metricas,meta,times,closers,produtos}/
│   ├── dashboard/                          # canvas TV
│   └── api/{auth,teams,closers,products,sales,metrics,goals,dashboard}/
├── components/{ui,layout,teams,closers,products,sales,metrics,goals,dashboard}/
├── hooks/ (use*.ts)
├── lib/{supabase,schemas,constants,utils}/
├── services/ (*.service.ts)
├── stores/ (*Store.ts)
├── types/
└── middleware.ts
supabase/migrations/
docs/ (PRD, schema, tech-stack, security, ux-flows, TASKS, progress.html, instrucoes)
CLAUDE.md (este arquivo)
```

## Protocolo de execução

### §1 — Pesquisar antes
Antes de criar qualquer arquivo, LER arquivo(s) similar(es) já existente(s). Copiar padrão. Não inventar estrutura nova.

### §2 — Escopo fechado
Cada task da `docs/TASKS.md` define: **CRIAR**, **EDITAR**, **LER**, **NÃO TOCAR**. Não sair do escopo. Se identificar bug adjacente, anotar mas não corrigir na mesma task.

### §3 — Isolamento
- 1 componente = 1 arquivo ≤ 200 linhas.
- Lógica de negócio em `src/services/*.service.ts` — não no componente.
- Lógica de fetch/state em hooks `use*.ts` — não no componente.

### §4 — Thin client, fat server
- Frontend captura intenção (formulário, click).
- Toda validação/autorização/lógica crítica no server (route handler + RLS).
- Nunca confiar em checagens só do client.

### §5 — Não quebrar
- Ao finalizar cada task: `npm run build` + `npm run typecheck`.
- Se alterar type/interface, verificar **todos** os consumidores (grep por nome do type).
- Se criar migration SQL, testar localmente antes de subir.

---

## Regras por camada

### TypeScript
- `strict: true`, `noUncheckedIndexedAccess: true`.
- Alias `@/*` → `./src/*`.
- **Proibido `any`**. Usar `unknown` + narrowing.
- Types gerados do Supabase em `src/types/database.ts`. Regenerar após migrations.
- Types de domínio (sem campos de banco) em `src/types/domain.ts`.

### React (App Router)
- **Server Component = default**. `'use client'` só se usar hooks de interatividade.
- **Function declaration** para componentes exportados (não arrow).
- **Named export** em tudo, exceto `page.tsx`/`layout.tsx`.
- Props tipadas via `interface ComponentProps { ... }` no mesmo arquivo.
- Max 200 linhas — se passar, quebrar em subcomponentes.

### Supabase
- `src/lib/supabase/client.ts` → `createBrowserClient` (browser).
- `src/lib/supabase/server.ts` → `createServerClient` + cookies (Server Components, API routes).
- `src/lib/supabase/middleware.ts` → `updateSession()` usado em `middleware.ts` raiz.
- **`service_role` NUNCA no client bundle**. Só em route handlers quando estritamente necessário.
- **RLS sempre ativo**. Toda tabela, toda policy.

### API Routes
Padrão fluxo:
```ts
1. Auth check: auth.getUser() → 401 se null
2. Zod validate: schema.safeParse(body) → 400 se invalid
3. Business logic: service ou query Supabase
4. Response: { data } ou { error }
```
- `try/catch` sempre.
- `console.error("[MODULO.METODO]", error)` em todo catch.
- Nunca expor `error.message` do Postgres diretamente ao client.

### Estilização
- **Tailwind only**. Zero CSS Modules, zero styled-components.
- shadcn/ui para componentes base. Customizar via `className` + `cn()`.
- Dark mode sempre ativo (`class="dark"` no root).
- Tokens custom no `tailwind.config.ts`: `bg.main`, `bg.card`, `bg.cardSoft`, `accent.gold`, `accent.coral`, `accent.blue`.
- Fontes: **Rajdhani** (dashboard TV), **Inter** (admin). Via `next/font/google`.
- Exceção: `style={{}}` inline aceitável em `components/dashboard/*` para animações/gradients dinâmicos.

### State
- **Server state** → TanStack Query. `queryKey: ['recurso', ...params]`.
- **UI state** → Zustand (stores em `src/stores/`).
- **Form state** → React Hook Form + Zod resolver.
- **NUNCA** `useEffect` para fetch. Sempre `useQuery`.

### Realtime (apenas `/dashboard`)
```ts
const channel = supabase
  .channel('dashboard')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, handler)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, handler)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_metrics' }, handler)
  .subscribe();
```
Handler dispara re-fetch do `/api/dashboard/snapshot`.

---

## NÃO fazer

- ❌ `any` em TypeScript
- ❌ `useEffect` para fetch de dados
- ❌ Arquivo > 200 linhas
- ❌ Commitar `.env.local`
- ❌ `dangerouslySetInnerHTML`
- ❌ Imports circulares
- ❌ `console.log` em produção (só `console.error` com prefixo `[MODULO]`)
- ❌ Editar fora do escopo da task
- ❌ Refatorar sem pedir autorização
- ❌ Inventar padrão quando já existe similar no código
- ❌ Lógica crítica no client
- ❌ JOIN complexo no client (usar view SQL)
- ❌ Mudar tipo sem atualizar todos consumidores
- ❌ `service_role` key no client
- ❌ Commits mudando mais de 1 task por vez
- ❌ Usar Plus Jakarta Sans (este projeto usa **Rajdhani** + Inter)
- ❌ Build/deploy sem rodar `npm run build` antes

---

## Padrões de arquivo

| Tipo | Local |
|---|---|
| Componente de domínio | `src/components/[dominio]/Componente.tsx` |
| Componente UI genérico (shadcn) | `src/components/ui/` |
| Página | `src/app/(group)/rota/page.tsx` |
| Layout | `src/app/(group)/layout.tsx` |
| API route | `src/app/api/[dominio]/route.ts` |
| Hook | `src/hooks/use[Recurso].ts` |
| Service (lógica negócio) | `src/services/[dominio].service.ts` |
| Schema Zod | `src/lib/schemas/[dominio].ts` |
| Store Zustand | `src/stores/[nome]Store.ts` |
| Migration SQL | `supabase/migrations/YYYYMMDDHHMMSS_descricao.sql` |

---

## Docs disponíveis (consultar sempre que relevante)

- `docs/PRD.md` — features, critérios de aceitação, user stories, modelo de dados, API routes
- `docs/tech-stack.md` — stack, ADRs, pacotes, envs, responsividade
- `docs/architecture.md` — estrutura de diretórios, nomenclatura, componentes, API pattern, Supabase setup
- `docs/schema.md` — SQL completo: tables, RLS, views, storage, seed, migration order
- `docs/security.md` — auth flow, autorização 3-camadas, Zod, CORS, rate limit, headers, checklist deploy
- `docs/ux-flows.md` — rotas, navegação, fluxos por feature, padrões interação, responsividade, a11y
- `docs/TASKS.md` — lista numerada de tasks com CRIAR/EDITAR/LER/NÃO TOCAR
- `docs/progress.html` — tracker visual interativo com prompts copiáveis
- `docs/instrucoes.md` — como o Claude Code deve operar neste projeto

**Antes de executar qualquer task**: consultar `docs/TASKS.md` + docs referenciadas + arquivos existentes do projeto.
