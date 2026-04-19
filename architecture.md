> 🔮 Doutor Estranho | 19/04/2026 | v1.0

# Architecture — Dash Comercial

## 1. Estrutura de diretórios

```
dash-comercial/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout (fontes, providers)
│   │   ├── page.tsx                        # / → redirect /admin ou /login
│   │   ├── globals.css                     # Tailwind base + tokens CSS
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                  # Layout centralizado p/ login
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx                  # Sidebar + header + Providers
│   │   │   └── admin/
│   │   │       ├── page.tsx                # Redirect /admin/vendas
│   │   │       ├── vendas/
│   │   │       │   └── page.tsx
│   │   │       ├── metricas/
│   │   │       │   └── page.tsx
│   │   │       ├── meta/
│   │   │       │   └── page.tsx
│   │   │       ├── times/
│   │   │       │   └── page.tsx
│   │   │       ├── closers/
│   │   │       │   └── page.tsx
│   │   │       └── produtos/
│   │   │           └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                  # Layout vazio (sem sidebar)
│   │   │   └── page.tsx                    # Canvas TV
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── logout/route.ts
│   │       ├── teams/
│   │       │   ├── route.ts                # GET, POST
│   │       │   └── [id]/
│   │       │       ├── route.ts            # PATCH, DELETE
│   │       │       └── banner/route.ts     # POST upload
│   │       ├── closers/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── photo/route.ts
│   │       ├── products/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── sales/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── metrics/
│   │       │   ├── route.ts
│   │       │   └── batch/route.ts          # PUT upsert batch
│   │       ├── goals/
│   │       │   └── route.ts
│   │       └── dashboard/
│   │           └── snapshot/route.ts       # PUBLIC
│   ├── components/
│   │   ├── ui/                             # shadcn (button, input, dialog...)
│   │   ├── layout/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   └── AdminShell.tsx
│   │   ├── teams/
│   │   │   ├── TeamForm.tsx
│   │   │   ├── TeamCard.tsx
│   │   │   └── TeamList.tsx
│   │   ├── closers/
│   │   │   ├── CloserForm.tsx
│   │   │   ├── CloserCard.tsx
│   │   │   └── CloserList.tsx
│   │   ├── products/
│   │   │   ├── ProductForm.tsx
│   │   │   └── ProductTable.tsx
│   │   ├── sales/
│   │   │   ├── SaleForm.tsx
│   │   │   ├── SalesTable.tsx
│   │   │   └── SalesFilters.tsx
│   │   ├── metrics/
│   │   │   └── MetricsEditor.tsx
│   │   ├── goals/
│   │   │   └── GoalForm.tsx
│   │   └── dashboard/
│   │       ├── DashboardCanvas.tsx         # Auto-scale wrapper
│   │       ├── GoalCard.tsx
│   │       ├── PodiumCard.tsx
│   │       ├── ProductsCard.tsx
│   │       ├── LatestSalesCard.tsx
│   │       ├── TeamColumn.tsx
│   │       ├── TeamBanner.tsx
│   │       └── SellerCard.tsx
│   ├── hooks/
│   │   ├── useTeams.ts
│   │   ├── useClosers.ts
│   │   ├── useProducts.ts
│   │   ├── useSales.ts
│   │   ├── useMetrics.ts
│   │   ├── useGoal.ts
│   │   ├── useDashboardSnapshot.ts         # fetch + realtime
│   │   └── useLiveClock.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                   # createBrowserClient
│   │   │   ├── server.ts                   # createServerClient (cookies)
│   │   │   └── middleware.ts               # updateSession
│   │   ├── schemas/
│   │   │   ├── team.ts
│   │   │   ├── closer.ts
│   │   │   ├── product.ts
│   │   │   ├── sale.ts
│   │   │   ├── metric.ts
│   │   │   └── goal.ts
│   │   ├── constants/
│   │   │   ├── gradients.ts                # presets blue/coral/green/purple
│   │   │   └── shapes.ts                   # triangle/chevron/hexagon SVG
│   │   └── utils/
│   │       ├── cn.ts                       # clsx + tailwind-merge
│   │       ├── currency.ts                 # fmtBRL, fmtBRLShort
│   │       ├── date.ts                     # getCurrentMonth, toMonthDate
│   │       └── initials.ts
│   ├── services/
│   │   ├── teams.service.ts                # lógica negócio teams
│   │   ├── closers.service.ts
│   │   ├── products.service.ts
│   │   ├── sales.service.ts
│   │   ├── metrics.service.ts
│   │   ├── goals.service.ts
│   │   └── dashboard.service.ts            # agregação via views
│   ├── stores/
│   │   ├── uiStore.ts                      # drawers, modais
│   │   └── toastStore.ts
│   ├── types/
│   │   ├── database.ts                     # tipos Supabase (auto-gerados)
│   │   └── domain.ts                       # tipos de domínio (Team, Closer...)
│   └── middleware.ts                       # auth check nas rotas /admin
├── supabase/
│   └── migrations/
│       ├── 20260419000000_init.sql
│       ├── 20260419000100_rls.sql
│       ├── 20260419000200_views.sql
│       ├── 20260419000300_storage.sql
│       └── 20260419000400_seed.sql
├── public/
│   └── favicon.ico
├── docs/
│   ├── briefing.md
│   ├── PRD.md
│   ├── tech-stack.md
│   ├── architecture.md
│   ├── schema.md
│   ├── security.md
│   ├── ux-flows.md
│   ├── TASKS.md
│   ├── progress.html
│   └── instrucoes.md
├── CLAUDE.md
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── .gitignore
```

## 2. Nomenclatura

| Elemento | Padrão | Exemplo |
|---|---|---|
| Componentes | `PascalCase.tsx` | `SellerCard.tsx` |
| Utils | `camelCase.ts` | `currency.ts` |
| Hooks | `use*.ts` | `useSales.ts` |
| Stores | `*Store.ts` | `uiStore.ts` |
| Services | `*.service.ts` | `sales.service.ts` |
| Schemas | singular, minúscula | `sale.ts`, `closer.ts` |
| Pastas | `kebab-case` | `latest-sales/` |
| Variáveis | `camelCase` | `currentMonth` |
| Constantes | `UPPER_SNAKE_CASE` | `DEFAULT_PODIUM_SIZE` |
| Types/Interfaces | `PascalCase` | `Team`, `SellerCardProps` |
| Env vars | `NEXT_PUBLIC_*` (client) ou `UPPER_SNAKE` (server) | `NEXT_PUBLIC_SUPABASE_URL` |
| Tabelas SQL | `snake_case` plural inglês | `monthly_metrics` |
| Colunas SQL | `snake_case` | `value_entrada`, `created_at` |

## 3. Componentes — regras

- **Function declaration** (não arrow) para componentes exportados:
  ```tsx
  export function SellerCard({ seller, total }: SellerCardProps) { ... }
  ```
- **Named export** em tudo exceto `page.tsx`/`layout.tsx` (que exigem default).
- **`"use client"`** somente quando necessário (uso de useState, useEffect, event handlers, stores).
- **Server Component = default**. Páginas do admin ficam Server quando possível; componentes filhos viram client se precisarem interatividade.
- **Props tipadas via interface** no mesmo arquivo:
  ```tsx
  interface SellerCardProps {
    seller: string;
    total: string;
    /* ... */
  }
  ```
- **Máx 200 linhas por arquivo**. Se passar, quebrar em sub-componentes.
- **Lógica de negócio fora do componente** — vai para `services/` ou `hooks/`.

## 4. API pattern

Todas as rotas `/api/*` seguem este fluxo:

```ts
// src/app/api/sales/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saleCreateSchema } from '@/lib/schemas/sale';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Zod validate
    const body = await req.json();
    const parsed = saleCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // 3. Business logic (services)
    const { data, error } = await supabase
      .from('sales')
      .insert(parsed.data)
      .select()
      .single();

    if (error) {
      console.error('[SALES.POST]', error);
      return NextResponse.json({ error: 'Falha ao criar venda' }, { status: 500 });
    }

    // 4. Response
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('[SALES.POST]', error);
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
```

**Regras**:
- Sempre `try/catch`.
- `console.error("[MODULO.METODO]", error)` padronizado.
- Response: `{ data: T }` (sucesso) ou `{ error: string }` (falha).
- Nunca expor `error.message` do Postgres ao client (vaza schema).

## 5. Supabase

### `src/lib/supabase/client.ts` (browser)
```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### `src/lib/supabase/server.ts` (Server Components, Route Handlers)
```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* Server Components context */ }
        },
      },
    }
  );
}
```

### `src/lib/supabase/middleware.ts`
Usado pelo `middleware.ts` raiz para refresh de sessão.

**Regras Supabase**:
- `service_role` key **nunca** no client bundle. Usar apenas em Server Components / Route Handlers com `createClient` do server.
- **RLS sempre ativo** em todas as tabelas.
- Queries complexas via **views** (não JOINs no client).

## 6. Data fetching

| Contexto | Ferramenta |
|---|---|
| Server Component (página admin) | Direto via `supabase.from(...)` |
| Client Component (forms, listas interativas) | TanStack Query com fetch para `/api/*` |
| Realtime (dashboard) | `supabase.channel(...).on('postgres_changes', ...)` |
| **NUNCA** | `useEffect` para fetch — sempre TanStack Query |

**Padrão TanStack Query hook**:
```ts
// src/hooks/useSales.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSales(month: string) {
  return useQuery({
    queryKey: ['sales', month],
    queryFn: async () => {
      const res = await fetch(`/api/sales?month=${month}`);
      if (!res.ok) throw new Error('Fetch failed');
      const { data } = await res.json();
      return data;
    },
  });
}
```

## 7. Error handling

| Status | Quando usar | Exemplo |
|---|---|---|
| 400 | Zod validation | `{ error: 'Nome obrigatório' }` |
| 401 | Sem auth (rota protegida) | `{ error: 'Unauthorized' }` |
| 403 | RLS bloqueou (raro, geralmente 401 pega antes) | `{ error: 'Forbidden' }` |
| 404 | Recurso não encontrado | `{ error: 'Time não encontrado' }` |
| 422 | Regra de negócio (constraint lógica) | `{ error: 'Time possui closers vinculados' }` |
| 500 | Erro inesperado | `{ error: 'Erro inesperado' }` (genérico, detalhe no log) |

**`error.tsx` boundaries**:
- `src/app/(admin)/error.tsx` — fallback no admin com botão "Tentar novamente".
- `src/app/dashboard/error.tsx` — fallback minimalista no dashboard (dark, mensagem curta, sem botão).

## 8. Performance

- **`next/image`** para todas as imagens (banners, fotos de closers). Fornecer `remotePatterns` para Supabase Storage.
- **`next/font`** para Rajdhani + Inter (self-hosted, swap).
- **`next/dynamic`** para componentes pesados só do dashboard:
  ```tsx
  const DashboardCanvas = dynamic(() => import('@/components/dashboard/DashboardCanvas'), { ssr: false });
  ```
- **Suspense boundaries** em Server Components com streaming.
- **Parallel fetch** no `/dashboard/snapshot` — agregar em 1 view, 1 query.
- **Realtime channels específicos** — não subscrever `*`; subscrever só as 3 tabelas relevantes.
- **Memoization** em `SellerCard` e `LatestSaleRow` (props estáveis → `React.memo`).
