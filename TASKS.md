> 🐜 Homem-Formiga | 19/04/2026 | v2.0 — atomizado

# TASKS — Dash Comercial

## Convenções

- Cada task executa **1 arquivo** (com raríssimas exceções para ações manuais em lote e configs triviais).
- **CRIAR** / **EDITAR** / **LER** / **NÃO TOCAR** — escopo fechado por task.
- Complexidade: 🟢 Low · 🟡 Medium · 🔴 High.
- Toda task termina com `npm run build` + retorno ✅/⚠️/❌.
- Tasks com `⚙️ MANUAL` exigem ação do usuário fora do Claude Code.
- Total: **133 tasks** em 20 blocos.

---

## Bloco A — Setup Base do Projeto (12 tasks)

### A1 ⬜ 🟡 Medium — create-next-app

```
Task A1 — create-next-app

Inicializar projeto base. Apenas esse comando.

CRIAR: projeto via create-next-app
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
1. Rodar: npx create-next-app@latest dash-comercial --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint
2. cd dash-comercial

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A2 ⬜ 🟢 Low — Configurar tsconfig strict

```
Task A2 — Configurar tsconfig strict

LER: docs/tech-stack.md (§ TypeScript)
CRIAR: nada
EDITAR: tsconfig.json
NÃO TOCAR: nada fora do escopo declarado

Steps:
Em compilerOptions garantir:
- "strict": true
- "noUncheckedIndexedAccess": true
- "noImplicitOverride": true
- "target": "ES2022"
- "moduleResolution": "bundler"
- "paths": { "@/*": ["./src/*"] }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A3 ⬜ 🟢 Low — Instalar dependências

```
Task A3 — Instalar dependências

CRIAR: nada
EDITAR: package.json (via npm install)
NÃO TOCAR: nada fora do escopo declarado

Steps:
Rodar UM npm install com todas as deps:
npm i @supabase/supabase-js @supabase/ssr @tanstack/react-query zustand react-hook-form @hookform/resolvers zod framer-motion lucide-react date-fns date-fns-tz clsx tailwind-merge

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A4 ⬜ 🟡 Medium — Configurar tokens Tailwind

```
Task A4 — Configurar tokens Tailwind

LER: docs/tech-stack.md (§ Tailwind), docs/briefing.md (§ Design System)
CRIAR: nada
EDITAR: tailwind.config.ts
NÃO TOCAR: nada fora do escopo declarado

Steps:
Adicionar em theme.extend:
- colors.bg: { main: "#040811", card: "#0C1523", cardSoft: "#14233A" }
- colors.border.card: "#1A2330"
- colors.accent: { gold: "#F5B942", coral: "#E8724A", blue: "#58A6FF" }
- borderRadius: { card: "20px", pill: "99px" }
- fontFamily: { rajdhani: ["var(--font-rajdhani)"], inter: ["var(--font-inter)"] }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A5 ⬜ 🟢 Low — Configurar fontes em layout.tsx

```
Task A5 — Configurar fontes em layout.tsx

LER: docs/tech-stack.md (§ Fontes)
CRIAR: nada
EDITAR: src/app/layout.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
1. Importar Rajdhani e Inter de next/font/google
2. Rajdhani: weight [500,600,700], subsets [latin], variable "--font-rajdhani", display swap
3. Inter: weight [400,500,600], subsets [latin], variable "--font-inter", display swap
4. No &lt;html&gt; adicionar className={`${rajdhani.variable} ${inter.variable}`}
5. No &lt;body&gt; aplicar font-inter como default

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A6 ⬜ 🟢 Low — Configurar globals.css

```
Task A6 — Configurar globals.css

CRIAR: nada
EDITAR: src/app/globals.css
NÃO TOCAR: nada fora do escopo declarado

Steps:
Substituir conteúdo por:
- @tailwind base/components/utilities
- Reset: * { box-sizing: border-box }, html/body { margin:0; padding:0 }
- body { background: #040811; color: #E8E8E8; min-height: 100vh }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A7 ⬜ 🟢 Low — Criar .env.example

```
Task A7 — Criar .env.example

CRIAR: .env.example (raiz)
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Conteúdo:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PODIUM_GLOW=true
NEXT_PUBLIC_DASHBOARD_POLL_MS=30000

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A8 ⬜ 🟢 Low — Ajustar .gitignore

```
Task A8 — Ajustar .gitignore

CRIAR: nada
EDITAR: .gitignore
NÃO TOCAR: nada fora do escopo declarado

Steps:
Garantir que contém:
.env*.local
.env.local
node_modules
.next
.vercel
*.log

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A9 ⬜ 🟢 Low — Criar src/app/page.tsx (redirect)

```
Task A9 — Criar src/app/page.tsx (redirect)

CRIAR: nada
EDITAR: src/app/page.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
Substituir conteúdo por Server Component que redireciona para /login (ajuste final virá em F2):

import { redirect } from "next/navigation";
export default function Home() { redirect("/login"); }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A10 ⬜ 🟢 Low — Criar utils/cn.ts

```
Task A10 — Criar utils/cn.ts

CRIAR: src/lib/utils/cn.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Exportar função cn que combina clsx + tailwind-merge:

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...i: ClassValue[]) { return twMerge(clsx(i)); }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A11 ⬜ 🟢 Low — shadcn init

```
Task A11 — shadcn init

CRIAR: components.json + CSS vars no globals.css
EDITAR: src/app/globals.css (shadcn adiciona vars)
NÃO TOCAR: nada fora do escopo declarado

Steps:
Rodar: npx shadcn@latest init
Opções: default style, slate baseColor, CSS vars=yes

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### A12 ⬜ 🟡 Medium — shadcn add components

```
Task A12 — shadcn add components

CRIAR: src/components/ui/* (gerados pelo CLI)
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Rodar UM comando:
npx shadcn@latest add button input label dialog alert-dialog dropdown-menu sheet table toast select command form popover calendar

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco B — Supabase Clients (código) (5 tasks)

### B1 ⬜ 🟢 Low — Criar supabase/client.ts

```
Task B1 — Criar supabase/client.ts

LER: docs/architecture.md (§ 5 Supabase)
CRIAR: src/lib/supabase/client.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### B2 ⬜ 🟡 Medium — Criar supabase/server.ts

```
Task B2 — Criar supabase/server.ts

LER: docs/architecture.md (§ 5)
CRIAR: src/lib/supabase/server.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Seguir literalmente o padrão do docs/architecture.md § 5:
- async function createClient()
- cookies() do next/headers
- getAll/setAll com try/catch para Server Components context

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### B3 ⬜ 🟡 Medium — Criar supabase/middleware.ts helper

```
Task B3 — Criar supabase/middleware.ts helper

CRIAR: src/lib/supabase/middleware.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Criar updateSession(request) que:
1. Cria NextResponse.next
2. Cria supabase server client com cookies do request
3. await supabase.auth.getUser() (refresh automático)
4. Retorna { supabase, response }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### B4 ⬜ 🟡 Medium — Criar src/middleware.ts (raiz)

```
Task B4 — Criar src/middleware.ts (raiz)

LER: docs/security.md (§ 1)
CRIAR: src/middleware.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
import { updateSession } from "@/lib/supabase/middleware"
export async function middleware(req) {
  const { supabase, response } = await updateSession(req);
  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  if (path.startsWith("/admin") && !user) { redirect /login }
  return response;
}
export const config = { matcher: ["/admin/:path*","/"] };

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### B5 ⬜ 🟢 Low — Criar types/database.ts placeholder

```
Task B5 — Criar types/database.ts placeholder

CRIAR: src/types/database.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Placeholder (será regenerado em D9):

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];
export type Database = { public: { Tables: {}, Views: {}, Functions: {} } };

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco C — Utils de formatação (3 tasks)

### C1 ⬜ 🟢 Low — Criar utils/currency.ts

```
Task C1 — Criar utils/currency.ts

CRIAR: src/lib/utils/currency.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Exportar:
- fmtBRL(n: number): string — "R$ 1.234,56" via Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
- fmtBRLShort(n): "R$ 1,2 mi" / "R$ 450K" etc (para valores grandes)
- parseBRL(s: string): number

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### C2 ⬜ 🟢 Low — Criar utils/date.ts

```
Task C2 — Criar utils/date.ts

CRIAR: src/lib/utils/date.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Exportar:
- getCurrentMonth(): string — retorna YYYY-MM do mês corrente em America/Sao_Paulo usando date-fns-tz (formatInTimeZone)
- toMonthDate(monthYYYYMM: string): string — retorna YYYY-MM-01
- fmtDateTime(d: Date|string): string — "dd/MM HH:mm" em pt-BR

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### C3 ⬜ 🟢 Low — Criar utils/initials.ts

```
Task C3 — Criar utils/initials.ts

CRIAR: src/lib/utils/initials.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
}

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco D — Supabase Projeto + Schema (9 tasks)

### D1 ⬜ 🟢 Low ⚙️ MANUAL — Criar projeto Supabase

```
Task D1 — Criar projeto Supabase

Ação manual no navegador.

CRIAR: nada
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
1. https://supabase.com → New project
2. Nome: bethel-dash-comercial
3. Region: sa-east-1
4. Password forte
5. Copiar URL + anon key + service_role key
6. Colar em .env.local
7. Authentication → Providers → Email → DESATIVAR "Enable signup"

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D2 ⬜ 🔴 High — Criar init.sql (tabelas)

```
Task D2 — Criar init.sql (tabelas)

LER: docs/schema.md (§ 3 — copiar 1:1)
CRIAR: supabase/migrations/20260419000000_init.sql
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Copiar o SQL da seção 3 do docs/schema.md exatamente como está (extensions, enums, functions, tables, indexes, triggers).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D3 ⬜ 🟢 Low — Criar rls.sql

```
Task D3 — Criar rls.sql

LER: docs/schema.md (§ 4)
CRIAR: supabase/migrations/20260419000100_rls.sql
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Copiar o SQL da seção 4 do docs/schema.md exatamente como está (enable RLS + is_admin() + policies).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D4 ⬜ 🟡 Medium — Criar views.sql

```
Task D4 — Criar views.sql

LER: docs/schema.md (§ 5)
CRIAR: supabase/migrations/20260419000200_views.sql
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Copiar o SQL da seção 5 do docs/schema.md exatamente como está (current_month_sp + 4 views).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D5 ⬜ 🟢 Low — Criar storage.sql

```
Task D5 — Criar storage.sql

LER: docs/schema.md (§ 6)
CRIAR: supabase/migrations/20260419000300_storage.sql
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Copiar o SQL da seção 6 do docs/schema.md (buckets + storage policies).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D6 ⬜ 🟢 Low — Criar seed.sql (dev)

```
Task D6 — Criar seed.sql (dev)

LER: docs/schema.md (§ 7)
CRIAR: supabase/migrations/20260419000400_seed.sql
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Copiar o SQL da seção 7 do docs/schema.md. Comentar antes de rodar em produção.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D7 ⬜ 🟡 Medium ⚙️ MANUAL — Aplicar migrations no Supabase

```
Task D7 — Aplicar migrations no Supabase

CRIAR: nada
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
No Supabase Dashboard → SQL Editor:
1. Colar e rodar 20260419000000_init.sql
2. Rodar 20260419000100_rls.sql
3. Rodar 20260419000200_views.sql
4. Rodar 20260419000300_storage.sql
5. Rodar 20260419000400_seed.sql (só dev)
6. Verificar via "select tablename, rowsecurity from pg_tables where schemaname = 'public'" que RLS=true em todas

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D8 ⬜ 🟢 Low ⚙️ MANUAL — Habilitar Realtime + criar admin user

```
Task D8 — Habilitar Realtime + criar admin user

CRIAR: nada
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
1. Database → Replication → toggle ON em: sales, monthly_metrics, goals, closers, teams
2. Authentication → Users → Add user → email + senha forte (salvar em password manager)
3. Verificar trigger handle_new_user criou linha em profiles

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### D9 ⬜ 🟢 Low — Regenerar database.ts types

```
Task D9 — Regenerar database.ts types

CRIAR: nada
EDITAR: src/types/database.ts
NÃO TOCAR: nada fora do escopo declarado

Steps:
Rodar: npx supabase gen types typescript --project-id &lt;PROJECT_ID&gt; > src/types/database.ts

Alternativa: copiar tipos manualmente do Supabase Dashboard → API → TypeScript.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco E — Auth (6 tasks)

### E1 ⬜ 🟢 Low — schemas/auth.ts

```
Task E1 — schemas/auth.ts

CRIAR: src/lib/schemas/auth.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
import { z } from "zod"
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
export type LoginInput = z.infer&lt;typeof loginSchema&gt;;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### E2 ⬜ 🟡 Medium — API /api/auth/login

```
Task E2 — API /api/auth/login

LER: docs/architecture.md (§ 4), docs/security.md (§ 1)
CRIAR: src/app/api/auth/login/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
POST com try/catch:
1. body = await req.json()
2. parsed = loginSchema.safeParse(body); if not ok → 400
3. supabase = await createClient(); { data, error } = await supabase.auth.signInWithPassword(parsed.data)
4. if error → console.error("[AUTH.LOGIN]", error); return 401 { error: "Credenciais inválidas" }
5. return 200 { data: { user: data.user } }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### E3 ⬜ 🟢 Low — API /api/auth/logout

```
Task E3 — API /api/auth/logout

CRIAR: src/app/api/auth/logout/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
POST: await supabase.auth.signOut(); return 200.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### E4 ⬜ 🟢 Low — (auth)/layout.tsx

```
Task E4 — (auth)/layout.tsx

CRIAR: src/app/(auth)/layout.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Layout minimalista centralizado:
&lt;div className="min-h-screen flex items-center justify-center bg-bg-main p-4"&gt;
  {children}
&lt;/div&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### E5 ⬜ 🟡 Medium — LoginForm component

```
Task E5 — LoginForm component

LER: docs/ux-flows.md (§ 3.1), src/components/ui/button.tsx, src/components/ui/input.tsx
CRIAR: src/components/auth/LoginForm.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; client component com:
- RHF + zodResolver(loginSchema)
- Input email (autoComplete email)
- Input password (type password, toggle eye via botão com ícone)
- Alert inline erro
- Botão "Entrar" (disabled até form válido, spinner ao submit)
- On submit: createClient().auth.signInWithPassword; se ok router.push("/admin"); se não setError("root")

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### E6 ⬜ 🟢 Low — (auth)/login/page.tsx

```
Task E6 — (auth)/login/page.tsx

CRIAR: src/app/(auth)/login/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Server Component que renderiza &lt;LoginForm /&gt; dentro de um card com título "Dash Comercial" e subtítulo "Entre para continuar".

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco F — Proteção de Rotas (2 tasks)

### F1 ⬜ 🟢 Low — Proteção de /admin/* no middleware

```
Task F1 — Proteção de /admin/* no middleware

CRIAR: nada
EDITAR: src/middleware.ts
NÃO TOCAR: nada fora do escopo declarado

Steps:
Confirmar:
- matcher: ["/admin/:path*", "/"]
- NÃO interceptar /dashboard nem /api/dashboard/*
- Se req.nextUrl.pathname começa com /admin E user é null → NextResponse.redirect("/login")

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### F2 ⬜ 🟢 Low — Redirect inteligente em page.tsx

```
Task F2 — Redirect inteligente em page.tsx

CRIAR: nada
EDITAR: src/app/page.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
Converter em async Server Component:
1. const supabase = await createClient()
2. const { data: { user } } = await supabase.auth.getUser()
3. redirect(user ? "/admin" : "/login")

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco G — Providers (Query + Toast) (4 tasks)

### G1 ⬜ 🟢 Low — QueryProvider

```
Task G1 — QueryProvider

CRIAR: src/components/providers/QueryProvider.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; QueryClient com:
- defaultOptions.queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true }
- Retorna &lt;QueryClientProvider client={qc}&gt;{children}&lt;/QueryClientProvider&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### G2 ⬜ 🟢 Low — toastStore

```
Task G2 — toastStore

CRIAR: src/stores/toastStore.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Zustand store:
- state: toasts: Toast[] onde Toast = { id: string, type: "success"|"error"|"info", message: string }
- actions: show(type, message), dismiss(id)
- show auto-gera id via crypto.randomUUID e setTimeout 3000 para dismiss em success/info

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### G3 ⬜ 🟢 Low — ToastProvider

```
Task G3 — ToastProvider

CRIAR: src/components/providers/ToastProvider.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; consome toastStore e renderiza shadcn &lt;Toaster /&gt; + map sobre toasts exibindo &lt;Toast&gt; (shadcn).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### G4 ⬜ 🟢 Low — Envolver root layout

```
Task G4 — Envolver root layout

CRIAR: nada
EDITAR: src/app/layout.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
Envolver children assim (ordem matters):
&lt;QueryProvider&gt;
  &lt;ToastProvider&gt;
    {children}
  &lt;/ToastProvider&gt;
&lt;/QueryProvider&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco H — Admin Shell (5 tasks)

### H1 ⬜ 🟢 Low — AdminSidebar

```
Task H1 — AdminSidebar

LER: docs/ux-flows.md (§ 2)
CRIAR: src/components/layout/AdminSidebar.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; Sidebar fixa 240px desktop, Sheet drawer mobile.
Items (array NAV_ITEMS): [Vendas /admin/vendas ShoppingCart, Métricas /admin/metricas Phone, Meta /admin/meta Target, Times /admin/times Users, Closers /admin/closers User, Produtos /admin/produtos Package]. Usar usePathname para active state (bg bg-cardSoft + borda esquerda accent).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### H2 ⬜ 🟢 Low — AdminHeader

```
Task H2 — AdminHeader

CRIAR: src/components/layout/AdminHeader.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; Header topo com:
- Logo "Dash Comercial" (mobile only)
- Botão hamburger (mobile) para abrir sidebar
- DropdownMenu avatar com email + "Sair" (POST /api/auth/logout + router.push("/login"))

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### H3 ⬜ 🟢 Low — AdminShell

```
Task H3 — AdminShell

CRIAR: src/components/layout/AdminShell.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; props { user, children }. Layout:
&lt;div flex min-h-screen&gt;
  &lt;AdminSidebar /&gt;
  &lt;div flex-1&gt;
    &lt;AdminHeader user={user} /&gt;
    &lt;main p-6&gt;{children}&lt;/main&gt;
  &lt;/div&gt;
&lt;/div&gt;
Sidebar no mobile vira state open/close com Sheet.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### H4 ⬜ 🟢 Low — (admin)/layout.tsx

```
Task H4 — (admin)/layout.tsx

CRIAR: src/app/(admin)/layout.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Server Component:
1. supabase = await createClient()
2. { user } = getUser() — se null redirect("/login")
3. return &lt;AdminShell user={user}&gt;{children}&lt;/AdminShell&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### H5 ⬜ 🟢 Low — (admin)/admin/page.tsx redirect

```
Task H5 — (admin)/admin/page.tsx redirect

CRIAR: src/app/(admin)/admin/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
import { redirect } from "next/navigation"
export default function AdminHome() { redirect("/admin/vendas"); }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco I — Times (CRUD) (12 tasks)

### I1 ⬜ 🟢 Low — schemas/team.ts

```
Task I1 — schemas/team.ts

CRIAR: src/lib/schemas/team.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Zod schemas:
- teamCreateSchema: name (string min 1 max 40), accent_color (regex hex), gradient_preset (enum blue/coral/green/purple), shape (enum triangle/chevron/hexagon), display_order (int default 0)
- teamUpdateSchema = teamCreateSchema.partial()
- Tipos TS via z.infer

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I2 ⬜ 🟡 Medium — services/teams.service.ts

```
Task I2 — services/teams.service.ts

CRIAR: src/services/teams.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Funções que recebem supabase client:
- listTeams() → SELECT * FROM teams WHERE deleted_at IS NULL ORDER BY display_order
- createTeam(input)
- updateTeam(id, input)
- softDeleteTeam(id) — antes verifica se há closers vinculados (SELECT count FROM closers WHERE team_id = id AND deleted_at IS NULL); se &gt; 0 throw new Error("TEAM_HAS_CLOSERS")

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I3 ⬜ 🟡 Medium — API /api/teams route (GET+POST)

```
Task I3 — API /api/teams route (GET+POST)

LER: docs/architecture.md (§ 4)
CRIAR: src/app/api/teams/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Padrão auth check → zod → service → response:
- GET: return { data: await listTeams(supabase) }
- POST: teamCreateSchema.safeParse → createTeam → return 201 { data }
- try/catch com console.error("[TEAMS.GET/POST]", e)

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I4 ⬜ 🟢 Low — API /api/teams/[id] (PATCH+DELETE)

```
Task I4 — API /api/teams/[id] (PATCH+DELETE)

CRIAR: src/app/api/teams/[id]/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
- PATCH: teamUpdateSchema.partial → updateTeam(id)
- DELETE: softDeleteTeam(id); catch error === "TEAM_HAS_CLOSERS" → 422 { error: "Time possui closers vinculados" }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I5 ⬜ 🟡 Medium — services/upload.service.ts

```
Task I5 — services/upload.service.ts

LER: docs/security.md (§ 5), docs/schema.md (§ 6)
CRIAR: src/services/upload.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
async function uploadImage(supabase, bucket, file: File, entityId: string):
1. Valida file.type in ["image/png","image/jpeg","image/webp"] senão throw INVALID_MIME
2. Valida file.size ≤ 2MB senão throw TOO_LARGE
3. path = `${entityId}/${Date.now()}.${ext}`
4. supabase.storage.from(bucket).upload(path, file, { upsert: true })
5. Retorna publicUrl via getPublicUrl

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I6 ⬜ 🟡 Medium — API /api/teams/[id]/banner

```
Task I6 — API /api/teams/[id]/banner

CRIAR: src/app/api/teams/[id]/banner/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
POST (multipart/form-data):
1. formData.get("file") as File
2. uploadImage(supabase, "team-banners", file, id)
3. UPDATE teams SET banner_url = publicUrl WHERE id
4. Retorna { data: { url } }
5. Mapear erros INVALID_MIME / TOO_LARGE para 400 com mensagens

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I7 ⬜ 🟢 Low — constants/gradients.ts

```
Task I7 — constants/gradients.ts

CRIAR: src/lib/constants/gradients.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Exportar:
export const GRADIENTS = {
  blue: "linear-gradient(135deg, rgb(14,28,48) 0%, rgb(30,55,90) 50%, rgb(12,22,38) 100%)",
  coral: "linear-gradient(135deg, rgb(40,18,10) 0%, rgb(90,35,20) 45%, rgb(20,10,4) 100%)",
  green: "linear-gradient(135deg, rgb(10,32,20) 0%, rgb(30,75,45) 50%, rgb(8,22,14) 100%)",
  purple: "linear-gradient(135deg, rgb(22,12,40) 0%, rgb(55,30,90) 50%, rgb(14,8,28) 100%)"
} as const;
export type GradientPreset = keyof typeof GRADIENTS;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I8 ⬜ 🟡 Medium — useTeams hook

```
Task I8 — useTeams hook

CRIAR: src/hooks/useTeams.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client" hooks TanStack Query:
- useTeams(): useQuery(["teams"], fetch GET /api/teams)
- useCreateTeam(): useMutation(fetch POST); onSuccess invalida ["teams"] + toast success
- useUpdateTeam(): idem PATCH
- useDeleteTeam(): DELETE; tratar 422 com toast error
- useUploadTeamBanner(): multipart POST

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I9 ⬜ 🟢 Low — TeamCard component

```
Task I9 — TeamCard component

CRIAR: src/components/teams/TeamCard.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { team, onEdit, onDelete }. Card com:
- Preview banner (next/image fill cover) ou gradient do preset se banner_url null
- Nome sobreposto grande (Rajdhani 700)
- Border-left 4px accent_color
- Hover: botões Edit (Pencil) e Delete (Trash) com AlertDialog de confirmação

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I10 ⬜ 🟢 Low — TeamList component

```
Task I10 — TeamList component

CRIAR: src/components/teams/TeamList.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; consome useTeams. Renderiza grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 de &lt;TeamCard /&gt;. Se teams.length === 0 → &lt;EmptyState /&gt; (placeholder por enquanto; será criado em S3).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I11 ⬜ 🔴 High — TeamForm component

```
Task I11 — TeamForm component

LER: docs/ux-flows.md (§ 3.2), src/components/ui/sheet.tsx, src/components/ui/form.tsx
CRIAR: src/components/teams/TeamForm.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; props { team?: Team; open: boolean; onClose: () =&gt; void }. Dentro de Sheet drawer lateral direita:
- RHF + zodResolver(teamCreateSchema)
- Campos: Input name, FileInput banner (dropzone + preview), input color picker accent_color, Select gradient_preset (com preview da cor atual), RadioGroup shape, Input number display_order
- Submit: create ou update via useTeams hooks; depois uploadBanner se file; onClose(); toast
- 2 botões: Cancelar (outline) + Salvar (primary, loading)

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### I12 ⬜ 🟢 Low — /admin/times/page.tsx

```
Task I12 — /admin/times/page.tsx

CRIAR: src/app/(admin)/admin/times/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; page com:
- State [formOpen, selectedTeam]
- Header "Times" + botão "+ Novo time"
- &lt;TeamList onEdit={setSelectedTeam + openForm} /&gt;
- &lt;TeamForm open={formOpen} team={selectedTeam} onClose={...} /&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco J — Produtos (8 tasks)

### J1 ⬜ 🟢 Low — schemas/product.ts

```
Task J1 — schemas/product.ts

CRIAR: src/lib/schemas/product.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
z.object({ name: z.string().min(1).max(60) }). Export schema + tipo.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### J2 ⬜ 🟢 Low — services/products.service.ts

```
Task J2 — services/products.service.ts

CRIAR: src/services/products.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
listProducts, createProduct, updateProduct, softDeleteProduct.
softDelete antes verifica sales vinculadas; se &gt; 0 throw PRODUCT_HAS_SALES.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### J3 ⬜ 🟢 Low — API /api/products route (GET+POST)

```
Task J3 — API /api/products route (GET+POST)

CRIAR: src/app/api/products/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
GET lista + POST cria. Padrão auth + zod + service.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### J4 ⬜ 🟢 Low — API /api/products/[id] (PATCH+DELETE)

```
Task J4 — API /api/products/[id] (PATCH+DELETE)

CRIAR: src/app/api/products/[id]/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
PATCH edit + DELETE soft. Mapear PRODUCT_HAS_SALES → 422.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### J5 ⬜ 🟢 Low — useProducts hook

```
Task J5 — useProducts hook

CRIAR: src/hooks/useProducts.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Hooks TanStack: useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### J6 ⬜ 🟢 Low — ProductInlineForm

```
Task J6 — ProductInlineForm

CRIAR: src/components/products/ProductInlineForm.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; props { onCreate, onUpdate?, initial? }. Input + botão "Salvar" (ou icon check). Enter submete. Blur cancela edição se initial definido e sem mudanças.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### J7 ⬜ 🟢 Low — ProductTable

```
Task J7 — ProductTable

CRIAR: src/components/products/ProductTable.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; usa Table shadcn. Colunas: Nome (click → vira InlineForm) + Ações (Trash com AlertDialog). Empty state se 0 itens.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### J8 ⬜ 🟢 Low — /admin/produtos/page.tsx

```
Task J8 — /admin/produtos/page.tsx

CRIAR: src/app/(admin)/admin/produtos/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Page com header + &lt;ProductInlineForm&gt; (novo) + &lt;ProductTable /&gt;.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco K — Closers (11 tasks)

### K1 ⬜ 🟢 Low — schemas/closer.ts

```
Task K1 — schemas/closer.ts

CRIAR: src/lib/schemas/closer.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
closerCreateSchema: name (max 40), initials (max 3, regex /^[A-Z]{1,3}$/), accent_color, team_id (uuid), display_order, photo_url opcional.
closerUpdateSchema = partial.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K2 ⬜ 🟢 Low — services/closers.service.ts

```
Task K2 — services/closers.service.ts

CRIAR: src/services/closers.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
listClosers (ORDER BY team_id, display_order), createCloser, updateCloser, softDeleteCloser.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K3 ⬜ 🟢 Low — API /api/closers (GET+POST)

```
Task K3 — API /api/closers (GET+POST)

CRIAR: src/app/api/closers/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Padrão. POST auto-gera initials via getInitials(name) se não fornecido.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K4 ⬜ 🟢 Low — API /api/closers/[id] (PATCH+DELETE)

```
Task K4 — API /api/closers/[id] (PATCH+DELETE)

CRIAR: src/app/api/closers/[id]/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
PATCH + DELETE soft.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K5 ⬜ 🟢 Low — API /api/closers/[id]/photo

```
Task K5 — API /api/closers/[id]/photo

CRIAR: src/app/api/closers/[id]/photo/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Similar a teams banner mas bucket "closer-photos". UPDATE closers SET photo_url.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K6 ⬜ 🟢 Low — useClosers hook

```
Task K6 — useClosers hook

CRIAR: src/hooks/useClosers.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Hooks CRUD + useUploadCloserPhoto.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K7 ⬜ 🟢 Low — CloserAvatar component

```
Task K7 — CloserAvatar component

CRIAR: src/components/closers/CloserAvatar.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { closer, size=48 }. Se photo_url: next/image circular. Senão: div circular com bg accent_color + initials em Rajdhani 600.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K8 ⬜ 🟢 Low — CloserCard component

```
Task K8 — CloserCard component

CRIAR: src/components/closers/CloserCard.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Avatar + nome + border accent + botões edit/delete (hover).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K9 ⬜ 🟡 Medium — CloserList component

```
Task K9 — CloserList component

CRIAR: src/components/closers/CloserList.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; consome useTeams + useClosers. Agrupa closers por team_id. Renderiza:
- Para cada time: header com nome + grid de CloserCard
- Empty state global se closers.length === 0
- Se teams.length === 0 mostra CTA "Crie um time primeiro" com link.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K10 ⬜ 🔴 High — CloserForm component

```
Task K10 — CloserForm component

LER: docs/ux-flows.md (§ 3.3)
CRIAR: src/components/closers/CloserForm.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Sheet drawer. RHF. Campos:
- Input name; onBlur → setValue("initials", getInitials(name)) se vazio
- FileInput foto (upload após save)
- Input initials (max 3, uppercase force)
- Color picker accent_color
- Select team_id (com options de useTeams — desabilita submit se times vazio com CTA "Crie um time")
- Input display_order
Submit: cria/edita; se file, uploadPhoto; toast.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### K11 ⬜ 🟢 Low — /admin/closers/page.tsx

```
Task K11 — /admin/closers/page.tsx

CRIAR: src/app/(admin)/admin/closers/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Header + botão "+ Novo closer" + CloserList + CloserForm drawer.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco L — Vendas (10 tasks)

### L1 ⬜ 🟡 Medium — schemas/sale.ts

```
Task L1 — schemas/sale.ts

CRIAR: src/lib/schemas/sale.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
saleCreateSchema:
- closer_id uuid, product_id uuid
- client_name min 2 max 80
- sale_date regex YYYY-MM-DD
- value_total positive, value_entrada &gt;= 0
.refine(entrada ≤ total, path value_entrada)
.refine(sale_date ≤ today, path sale_date)

saleFilterSchema: month?, closer_id?, product_id?, search?.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L2 ⬜ 🟡 Medium — services/sales.service.ts

```
Task L2 — services/sales.service.ts

CRIAR: src/services/sales.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
listSales(filters): query com WHERE deleted_at IS NULL + filtros opcionais:
- month → sale_date BETWEEN first_day(month) AND last_day(month)
- closer_id/product_id → eq
- search → client_name ilike %search%
ORDER BY sale_date DESC, created_at DESC LIMIT 50 OFFSET page.
createSale/updateSale/softDeleteSale.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L3 ⬜ 🟡 Medium — API /api/sales (GET+POST)

```
Task L3 — API /api/sales (GET+POST)

CRIAR: src/app/api/sales/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
GET: lê searchParams (month, closer_id, product_id, search, page), valida com saleFilterSchema, listSales, return.
POST: saleCreateSchema.safeParse, createSale, return 201.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L4 ⬜ 🟢 Low — API /api/sales/[id] (PATCH+DELETE)

```
Task L4 — API /api/sales/[id] (PATCH+DELETE)

CRIAR: src/app/api/sales/[id]/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
PATCH (partial) + DELETE soft.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L5 ⬜ 🟢 Low — useSales hook

```
Task L5 — useSales hook

CRIAR: src/hooks/useSales.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
useSales(filters) com queryKey ["sales", filters]. useCreateSale/useUpdateSale/useDeleteSale.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L6 ⬜ 🟢 Low — CurrencyInput component

```
Task L6 — CurrencyInput component

CRIAR: src/components/sales/CurrencyInput.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; props { value: number, onChange: (n:number)=&gt;void, placeholder? }. Input controlado que:
- Formata como BRL ao blur (fmtBRL)
- Ao focus converte para edição numérica limpa
- onChange retorna number parseado
- Valida &gt;=0

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L7 ⬜ 🟡 Medium — SalesFilters component

```
Task L7 — SalesFilters component

CRIAR: src/components/sales/SalesFilters.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; props { filters, onChange }. UI:
- Select mês (últimos 12)
- Command searchable closer (com avatar)
- Select produto
- Input busca cliente (debounce 300ms via setTimeout)

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L8 ⬜ 🟡 Medium — SalesTable component

```
Task L8 — SalesTable component

CRIAR: src/components/sales/SalesTable.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Table shadcn com colunas: Data (fmtDateTime) | Closer (CloserAvatar + nome) | Produto | Cliente | Entrada (fmtBRL) | Total (fmtBRL) | Ações (kebab menu Edit/Delete).
Sort por created_at DESC default.
Linha recém-criada com highlight bg-green/10 por 2s (controlado via prop lastCreatedId).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L9 ⬜ 🔴 High — SaleForm component

```
Task L9 — SaleForm component

LER: docs/ux-flows.md (§ 3.5)
CRIAR: src/components/sales/SaleForm.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Sheet drawer. RHF + saleCreateSchema. Campos:
- Command closer (searchable com avatar + nome)
- Select product
- Input client_name
- DatePicker sale_date (default hoje, disabled futuro)
- CurrencyInput value_total
- CurrencyInput value_entrada + 3 botões rápidos "30% / 50% / 100%" que calculam baseado em total
- Validação Zod
Submit: useCreateSale/UpdateSale; toast "Venda registrada".

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### L10 ⬜ 🟢 Low — /admin/vendas/page.tsx

```
Task L10 — /admin/vendas/page.tsx

CRIAR: src/app/(admin)/admin/vendas/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; state filters (default month atual), formOpen, selectedSale, lastCreatedId.
Header "Vendas" + botão "+ Nova venda".
SalesFilters + SalesTable + SaleForm drawer.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco M — Métricas Mensais (7 tasks)

### M1 ⬜ 🟢 Low — schemas/metric.ts

```
Task M1 — schemas/metric.ts

CRIAR: src/lib/schemas/metric.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
metricItemSchema: { closer_id uuid, calls int &gt;=0, conversion_pct number 0..100 }
metricBatchSchema: { month YYYY-MM-DD, items: metricItemSchema[] }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### M2 ⬜ 🟡 Medium — services/metrics.service.ts

```
Task M2 — services/metrics.service.ts

CRIAR: src/services/metrics.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
listByMonth(month):
1. Busca TODOS closers ativos (deleted_at IS NULL)
2. Busca monthly_metrics WHERE month = month
3. Left join em memória: para cada closer, retorna { ...closer, calls: m?.calls ?? 0, conversion_pct: m?.conversion_pct ?? 0 }
upsertBatch(month, items): supabase.from("monthly_metrics").upsert(items, { onConflict: "closer_id,month" })

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### M3 ⬜ 🟢 Low — API /api/metrics (GET)

```
Task M3 — API /api/metrics (GET)

CRIAR: src/app/api/metrics/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
GET ?month=YYYY-MM → valida, retorna listByMonth.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### M4 ⬜ 🟢 Low — API /api/metrics/batch (PUT)

```
Task M4 — API /api/metrics/batch (PUT)

CRIAR: src/app/api/metrics/batch/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
PUT: metricBatchSchema.safeParse, upsertBatch, return 200.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### M5 ⬜ 🟢 Low — useMetrics hook

```
Task M5 — useMetrics hook

CRIAR: src/hooks/useMetrics.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
useMetrics(month) + useSaveMetrics mutation (batch PUT).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### M6 ⬜ 🟡 Medium — MetricsEditor component

```
Task M6 — MetricsEditor component

LER: docs/ux-flows.md (§ 3.6)
CRIAR: src/components/metrics/MetricsEditor.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; state [month, draft (Map&lt;closer_id, {calls, conversion_pct}&gt;)].
- Select mês (default currentMonth)
- Fetch useMetrics → inicializa draft
- Table: Avatar+Nome | Input number calls | Input number conversion_pct (suffix %)
- onChange do input atualiza draft; flag isDirty = JSON.stringify(draft) !== initial
- Footer: "● Alterações não salvas" se isDirty + botões "Descartar" e "Salvar"
- beforeunload listener bloqueia saída se isDirty

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### M7 ⬜ 🟢 Low — /admin/metricas/page.tsx

```
Task M7 — /admin/metricas/page.tsx

CRIAR: src/app/(admin)/admin/metricas/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Page com header + MetricsEditor.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco N — Meta Mensal (6 tasks)

### N1 ⬜ 🟢 Low — schemas/goal.ts

```
Task N1 — schemas/goal.ts

CRIAR: src/lib/schemas/goal.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
goalSchema: { month YYYY-MM-DD, target_value &gt; 0 }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### N2 ⬜ 🟢 Low — services/goals.service.ts

```
Task N2 — services/goals.service.ts

CRIAR: src/services/goals.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
getByMonth(month), upsertGoal(data) com onConflict "month".

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### N3 ⬜ 🟢 Low — API /api/goals

```
Task N3 — API /api/goals

CRIAR: src/app/api/goals/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
GET ?month= + PUT body {month, target_value}.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### N4 ⬜ 🟢 Low — useGoal hook

```
Task N4 — useGoal hook

CRIAR: src/hooks/useGoal.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
useGoal(month) + useSaveGoal mutation.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### N5 ⬜ 🟢 Low — GoalForm component

```
Task N5 — GoalForm component

CRIAR: src/components/goals/GoalForm.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Select mês + CurrencyInput target_value + botão Salvar. Exibe valor atual em card acima se existe.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### N6 ⬜ 🟢 Low — /admin/meta/page.tsx

```
Task N6 — /admin/meta/page.tsx

CRIAR: src/app/(admin)/admin/meta/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Page com GoalForm.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco O — Dashboard API (3 tasks)

### O1 ⬜ 🟡 Medium — types/domain.ts

```
Task O1 — types/domain.ts

CRIAR: nada
EDITAR: src/types/domain.ts (criar se não existe)
NÃO TOCAR: nada fora do escopo declarado

Steps:
Tipos TypeScript:
SellerSnapshot { id, name, initials, accent_color, photo_url, totalVendas, totalEntrada, calls, conversion_pct }
TeamSnapshot { id, name, banner_url, gradient_preset, shape, accent_color, totalVendas, totalEntrada, sellers: SellerSnapshot[], isLeader: boolean }
ProductSnapshot { id, name, totalVendas }
LatestSaleSnapshot { id, closer_id, closer_name, closer_initials, closer_accent, product_name, client_name_masked, sale_date, created_at }
GoalSnapshot { month, targetValue, currentValue, pct }
TopSellerSnapshot { position 1|2|3, id, name, accent_color, totalVendas }
DashboardSnapshot { currentMonth, goal, top3: TopSellerSnapshot[], teams: TeamSnapshot[], products: ProductSnapshot[], latestSales: LatestSaleSnapshot[] }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### O2 ⬜ 🔴 High — services/dashboard.service.ts

```
Task O2 — services/dashboard.service.ts

LER: docs/schema.md (§ 5 views)
CRIAR: src/services/dashboard.service.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
getSnapshot(supabase):
1. month = current_month_sp() via SELECT
2. Promise.all de 5 queries paralelas em v_closer_monthly, v_team_monthly, v_product_monthly, v_latest_sales_public, goals — todas filtradas por month
3. Cruzar v_closer_monthly com monthly_metrics para calls/conversion_pct
4. Agrupar sellers por team
5. Marcar isLeader no team com maior totalVendas
6. Top3 = closers globais ORDER BY totalVendas DESC LIMIT 3 (position 1/2/3)
7. Goal snapshot: targetValue da tabela goals + currentValue = sum(closers totalVendas) + pct
8. Retorna DashboardSnapshot.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### O3 ⬜ 🟡 Medium — API /api/dashboard/snapshot (PÚBLICO)

```
Task O3 — API /api/dashboard/snapshot (PÚBLICO)

LER: docs/security.md (§ 2)
CRIAR: src/app/api/dashboard/snapshot/route.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
GET PÚBLICO — sem auth.getUser().
1. supabase = createClient() server (usa cookies anônimos — RLS permite SELECT nas views/tabelas públicas)
2. data = await getSnapshot(supabase)
3. return { data }
headers: Cache-Control: no-store
Rate limit será aplicado em S11.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco P — Dashboard Canvas (5 tasks)

### P1 ⬜ 🟢 Low — dashboard/layout.tsx

```
Task P1 — dashboard/layout.tsx

CRIAR: src/app/dashboard/layout.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Layout minimalista SEM header/sidebar.
&lt;div className="min-h-screen w-full overflow-hidden bg-bg-main font-rajdhani"&gt;
  {children}
&lt;/div&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### P2 ⬜ 🟢 Low — useLiveClock hook

```
Task P2 — useLiveClock hook

CRIAR: src/hooks/useLiveClock.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; useEffect com setInterval 1000ms atualizando useState Date. Return current Date. Cleanup clearInterval.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### P3 ⬜ 🔴 High — useDashboardSnapshot hook

```
Task P3 — useDashboardSnapshot hook

LER: docs/tech-stack.md (ADR-005)
CRIAR: src/hooks/useDashboardSnapshot.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; combina:
1. TanStack useQuery ["dashboard-snapshot"] com fetch GET /api/dashboard/snapshot, staleTime 1000
2. useEffect: supabase.channel("dashboard").on(postgres_changes) para sales, goals, monthly_metrics, closers, teams → invalidateQueries
3. State isConnected com .subscribe((status) =&gt; setConnected(status==="SUBSCRIBED"))
4. Fallback: se !isConnected, setInterval polling (NEXT_PUBLIC_DASHBOARD_POLL_MS) refetch
5. Return { snapshot, isConnected, isLoading }

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### P4 ⬜ 🔴 High — DashboardCanvas (estrutura)

```
Task P4 — DashboardCanvas (estrutura)

CRIAR: src/components/dashboard/DashboardCanvas.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; structure só com auto-scale, sem cards ainda (serão adicionados em Q7 e R6).
1. useRef containerRef
2. State scale=1
3. useEffect resize listener: scaleX = window.innerWidth / 1920; scaleY = window.innerHeight / 1080; setScale(Math.min(scaleX, scaleY))
4. Render:
&lt;div className="w-screen h-screen flex items-center justify-center overflow-hidden"&gt;
  &lt;div style={{width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: "center center"}} className="flex gap-5 p-5"&gt;
    &lt;div className="w-[774px] flex flex-col gap-5" id="dash-left"&gt;LEFT&lt;/div&gt;
    &lt;div className="flex-1 flex gap-5" id="dash-right"&gt;RIGHT&lt;/div&gt;
  &lt;/div&gt;
  {!isConnected && &lt;Badge&gt; "● Reconectando..."&lt;/Badge&gt;}
&lt;/div&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### P5 ⬜ 🟢 Low — dashboard/page.tsx

```
Task P5 — dashboard/page.tsx

CRIAR: src/app/dashboard/page.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
import dynamic. DashboardCanvas com ssr: false. Suspense fallback text "Carregando..." centralizado.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco Q — Dashboard Painel Esquerdo (7 tasks)

### Q1 ⬜ 🟡 Medium — GoalCard

```
Task Q1 — GoalCard

LER: docs/PRD.md (F8.1)
CRIAR: src/components/dashboard/GoalCard.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { goal: GoalSnapshot }. Consome useLiveClock para relógio.
- Label "META" (Rajdhani 500 uppercase tracking-wide)
- Valor alvo em fmtBRLShort grande (Rajdhani 700 72px)
- Valor atual em accent-gold + "(pct%)"
- Progress bar 6px height com fill accent-gold + ticks em 25/50/75 (pequenas barras brancas)
- Rodapé: "ABRIL 2026 · MÊS EM CURSO" + "● AO VIVO " + fmtHHMMSS(clock)
- motion.div com key={goal.currentValue} + animate={boxShadow flash} para glow ao mudar

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### Q2 ⬜ 🟢 Low — PodiumPlace

```
Task Q2 — PodiumPlace

CRIAR: src/components/dashboard/PodiumPlace.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { position 1|2|3, seller: TopSellerSnapshot | null, glow? }. Render:
- Shield SVG com gradient por position (gold/silver/bronze)
- barHeight: 180 (1) | 140 (2) | 120 (3)
- Medal SVG sobre shield
- Nome + fmtBRLShort totalVendas embaixo
- Se null: "—" em placeholder cinza
- Glow opcional (box-shadow animado) se position===1 && glow

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### Q3 ⬜ 🟢 Low — PodiumCard

```
Task Q3 — PodiumCard

CRIAR: src/components/dashboard/PodiumCard.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { top3, glow }. Card com:
- Header "RANKING DO MÊS" + badge accent "TOP 3"
- Container flex gap-4 items-end justify-center com 3 PodiumPlace: top3[1] (2º à esquerda) → top3[0] (1º no centro, mais alto) → top3[2] (3º à direita)
- Glow vem de process.env.NEXT_PUBLIC_PODIUM_GLOW === "true"

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### Q4 ⬜ 🟢 Low — ProductsCard

```
Task Q4 — ProductsCard

CRIAR: src/components/dashboard/ProductsCard.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { products: ProductSnapshot[] }. Card com:
- Header "VENDAS POR PRODUTO"
- Lista: para cada product: nome | barra horizontal fill relative to max | fmtBRLShort valor
- Barra bg-border + fill bg-accent-gold com width = (product.totalVendas / maxTotal) * 100%

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### Q5 ⬜ 🟡 Medium — LatestSaleRow

```
Task Q5 — LatestSaleRow

CRIAR: src/components/dashboard/LatestSaleRow.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { sale: LatestSaleSnapshot }. motion.div com:
- initial={opacity 0, y -10}, animate={opacity 1, y 0}, transition duration 0.3
- Avatar circular 40px com bg = seller.accent_color + initials em branco
- Textos: closer_name (bold) · product_name (muted) · client_name_masked · fmtDateTime(created_at)
- React.memo wrap (performance)

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### Q6 ⬜ 🟢 Low — LatestSalesCard

```
Task Q6 — LatestSalesCard

CRIAR: src/components/dashboard/LatestSalesCard.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { latestSales }. Card com:
- Header "ÚLTIMAS VENDAS" + badge animate-pulse "● TEMPO REAL" (red/green)
- Lista map primeiros 6 latestSales em LatestSaleRow
- Empty state "Aguardando vendas..." se vazio
- AnimatePresence wrap para animação de entrada

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### Q7 ⬜ 🟡 Medium — Integrar left panel no Canvas

```
Task Q7 — Integrar left panel no Canvas

CRIAR: nada
EDITAR: src/components/dashboard/DashboardCanvas.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
Substituir placeholder "LEFT" pelo conteúdo real:
&lt;div className="w-[774px] flex flex-col gap-5"&gt;
  &lt;GoalCard goal={snapshot.goal} /&gt;
  &lt;PodiumCard top3={snapshot.top3} glow={podiumGlow} /&gt;
  &lt;div className="grid grid-cols-2 gap-5 flex-1"&gt;
    &lt;ProductsCard products={snapshot.products} /&gt;
    &lt;LatestSalesCard latestSales={snapshot.latestSales} /&gt;
  &lt;/div&gt;
&lt;/div&gt;
Ajustar heights proporcionais (goal ~160, podium ~340, bottom row flex-1).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco R — Dashboard Painel Direito (6 tasks)

### R1 ⬜ 🟢 Low — constants/shapes.ts

```
Task R1 — constants/shapes.ts

CRIAR: src/lib/constants/shapes.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
SVG paths por shape (viewBox 0 0 100 100):
triangle: M 50 10 L 90 85 L 10 85 Z
chevron: M 10 15 L 50 10 L 90 15 L 90 85 L 50 90 L 10 85 Z (aproximado)
hexagon: M 50 5 L 90 27 L 90 73 L 50 95 L 10 73 L 10 27 Z
Exportar SHAPES = { triangle, chevron, hexagon } as const.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### R2 ⬜ 🟢 Low — TeamBanner

```
Task R2 — TeamBanner

CRIAR: src/components/dashboard/TeamBanner.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { team: TeamSnapshot }. Div relative com:
- background: GRADIENTS[team.gradient_preset]
- Altura 120px, border-radius 20px
- SVG shape overlay (opacity 0.15, white, absolute centered) usando SHAPES[team.shape]
- Nome em Rajdhani 700 48px uppercase, centralizado, text-white, sobre shape

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### R3 ⬜ 🟢 Low — LeaderRibbon

```
Task R3 — LeaderRibbon

CRIAR: src/components/dashboard/LeaderRibbon.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Faixa diagonal no canto superior direito:
- absolute top-0 right-0, transform rotate-45
- bg-accent-gold, text-black, Rajdhani 700 uppercase
- "LIDERANDO"
- padding 4px 32px, translate para ficar bonito

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### R4 ⬜ 🟡 Medium — SellerCard

```
Task R4 — SellerCard

LER: docs/PRD.md (F8.5)
CRIAR: src/components/dashboard/SellerCard.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { seller: SellerSnapshot }. React.memo. Layout:
&lt;div flex items-center gap-4 p-4 bg-card border border-border-card rounded-card&gt;
  CloserAvatar size 56
  &lt;div flex-1&gt;
    &lt;span font-rajdhani font-700&gt;nome&lt;/span&gt;
    &lt;div grid grid-cols-4 gap-2 mt-2&gt;
      Stat Vendas fmtBRLShort(totalVendas)
      Stat Entrada fmtBRLShort(totalEntrada)
      Stat Calls (number)
      Stat Conv (pct%)
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
Stat = label pequeno muted + valor em Rajdhani 600.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### R5 ⬜ 🟢 Low — TeamColumn

```
Task R5 — TeamColumn

CRIAR: src/components/dashboard/TeamColumn.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { team: TeamSnapshot }. Column com:
- Relative wrapper (para LeaderRibbon)
- TeamBanner
- Se team.isLeader: &lt;LeaderRibbon /&gt;
- 2 HeadlineCards (flex row gap-2): "Venda" bg-cardSoft + fmtBRLShort(totalVendas); "Entrada" bg-cardSoft + fmtBRLShort(totalEntrada)
- Lista de SellerCard ordenada por totalVendas desc (team.sellers já vem ordenado; garantir).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### R6 ⬜ 🟡 Medium — Integrar right panel no Canvas

```
Task R6 — Integrar right panel no Canvas

CRIAR: nada
EDITAR: src/components/dashboard/DashboardCanvas.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
Substituir placeholder "RIGHT" por:
&lt;div className="flex-1 flex gap-5"&gt;
  {snapshot.teams.map(team =&gt; (
    &lt;div key={team.id} className="flex-1 flex flex-col gap-4 relative"&gt;
      &lt;TeamColumn team={team} /&gt;
    &lt;/div&gt;
  ))}
&lt;/div&gt;

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco S — Polish & Segurança (11 tasks)

### S1 ⬜ 🟢 Low — Link Dashboard no AdminSidebar

```
Task S1 — Link Dashboard no AdminSidebar

CRIAR: nada
EDITAR: src/components/layout/AdminSidebar.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
Adicionar ao array NAV_ITEMS (ou section separada abaixo): { label: "Abrir Dashboard", href: "/dashboard", icon: Monitor, target: "_blank" }.
Renderizar com &lt;a href target rel="noopener"&gt;.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S2 ⬜ 🟢 Low — Banner dica em /admin/vendas

```
Task S2 — Banner dica em /admin/vendas

CRIAR: nada
EDITAR: src/app/(admin)/admin/vendas/page.tsx
NÃO TOCAR: nada fora do escopo declarado

Steps:
No topo da page, banner dismissable:
- Card accent "💡 Abra /dashboard na TV do escritório para ver o ranking em tempo real" + link + botão X
- Estado dismiss persiste em localStorage["dash-comercial:vendas-banner-dismissed"]

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S3 ⬜ 🟢 Low — EmptyState component

```
Task S3 — EmptyState component

CRIAR: src/components/shared/EmptyState.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Props { icon: LucideIcon, title: string, description?: string, action?: { label, onClick } }. Centralizado, muted. Ícone grande 48px, título Rajdhani 600, descrição opcional, botão opcional.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S4 ⬜ 🟢 Low — Aplicar EmptyState em listas

```
Task S4 — Aplicar EmptyState em listas

CRIAR: nada
EDITAR: TeamList, CloserList, ProductTable, SalesTable, MetricsEditor
NÃO TOCAR: nada fora do escopo declarado

Steps:
Substituir placeholders/textos de empty por &lt;EmptyState icon={Users/User/Package/ShoppingCart/Phone} title descrição action /&gt; conforme cada contexto.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S5 ⬜ 🟢 Low — error.tsx admin

```
Task S5 — error.tsx admin

CRIAR: src/app/(admin)/error.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; props { error, reset }. Card com mensagem amigável + botão "Tentar novamente" que chama reset(). Log console.error("[ADMIN.ERROR]", error).

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S6 ⬜ 🟢 Low — error.tsx dashboard

```
Task S6 — error.tsx dashboard

CRIAR: src/app/dashboard/error.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
"use client"; fallback minimalista dark. useEffect setTimeout(() =&gt; window.location.reload(), 10000). Mensagem "Dashboard temporariamente indisponível. Recarregando..." + contador regressivo.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S7 ⬜ 🟢 Low — Skeleton component

```
Task S7 — Skeleton component

CRIAR: src/components/shared/Skeleton.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Simples wrapper: div com className cn("animate-pulse rounded bg-cardSoft", props.className). Props { className, children? }.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S8 ⬜ 🟢 Low — loading.tsx por rota admin

```
Task S8 — loading.tsx por rota admin

CRIAR: src/app/(admin)/admin/vendas/loading.tsx, src/app/(admin)/admin/metricas/loading.tsx, src/app/(admin)/admin/meta/loading.tsx, src/app/(admin)/admin/times/loading.tsx, src/app/(admin)/admin/closers/loading.tsx, src/app/(admin)/admin/produtos/loading.tsx
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
Cada arquivo: export default function Loading() que renderiza Skeleton apropriado para a página (grid de cards skeleton, rows skeleton em tabela etc). Manter consistente com layout da página real.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S9 ⬜ 🟡 Medium — Security headers em next.config.mjs

```
Task S9 — Security headers em next.config.mjs

LER: docs/security.md (§ 4)
CRIAR: nada
EDITAR: next.config.mjs
NÃO TOCAR: nada fora do escopo declarado

Steps:
Adicionar:
- headers() retornando CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, HSTS, Permissions-Policy
- images.remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }]
- Configurar CORS em /api/:path* para NEXT_PUBLIC_SITE_URL

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S10 ⬜ 🟢 Low — rate-limit.ts util

```
Task S10 — rate-limit.ts util

CRIAR: src/lib/rate-limit.ts
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
In-memory Map&lt;string, { count, resetAt }&gt;:
export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.resetAt &lt; now) { store.set(key, { count: 1, resetAt: now + windowMs }); return { ok: true, remaining: limit-1 }; }
  if (entry.count &gt;= limit) return { ok: false, retryAfter: entry.resetAt - now };
  entry.count++; return { ok: true, remaining: limit - entry.count };
}
GetIP helper via x-forwarded-for.

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

### S11 ⬜ 🟢 Low — Aplicar rate limit em login + snapshot

```
Task S11 — Aplicar rate limit em login + snapshot

CRIAR: nada
EDITAR: src/app/api/auth/login/route.ts, src/app/api/dashboard/snapshot/route.ts
NÃO TOCAR: nada fora do escopo declarado

Steps:
No topo do handler:
- login: rateLimit(ip, 5, 60_000); se !ok → 429 Retry-After
- snapshot: rateLimit(ip, 120, 60_000); se !ok → 429 Retry-After

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

## Bloco T — Deploy (1 tasks)

### T1 ⬜ 🟢 Low ⚙️ MANUAL — Deploy Vercel

```
Task T1 — Deploy Vercel

CRIAR: nada
EDITAR: nada
NÃO TOCAR: nada fora do escopo declarado

Steps:
1. git init + push para GitHub (repo dash-comercial)
2. Vercel → Import Project
3. Configurar env vars (production + preview): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL (=URL Vercel), NEXT_PUBLIC_PODIUM_GLOW=true, NEXT_PUBLIC_DASHBOARD_POLL_MS=30000
4. Deploy branch main
5. (Opcional) domínio custom
6. Rodar checklist docs/security.md § 7 (16 itens)
7. Testar /dashboard em TV real

Ao finalizar rode npm run build e retorne ✅/⚠️/❌.
```

---

## Resumo

| Bloco | Nome | Tasks |
|---|---|---|
| A | Setup Base do Projeto | 12 |
| B | Supabase Clients (código) | 5 |
| C | Utils de formatação | 3 |
| D | Supabase Projeto + Schema | 9 |
| E | Auth | 6 |
| F | Proteção de Rotas | 2 |
| G | Providers (Query + Toast) | 4 |
| H | Admin Shell | 5 |
| I | Times (CRUD) | 12 |
| J | Produtos | 8 |
| K | Closers | 11 |
| L | Vendas | 10 |
| M | Métricas Mensais | 7 |
| N | Meta Mensal | 6 |
| O | Dashboard API | 3 |
| P | Dashboard Canvas | 5 |
| Q | Dashboard Painel Esquerdo | 7 |
| R | Dashboard Painel Direito | 6 |
| S | Polish & Segurança | 11 |
| T | Deploy | 1 |
| | **TOTAL** | **133** |

## Ordem recomendada

Execução linear A → T. Não pular blocos. Dentro de cada bloco, respeitar ordem numérica (schemas → service → API → hook → componentes → page).

**Paralelizável após H pronto**: I, J, N são independentes entre si.

**Estimativa**: 133 tasks, ~60-80h de Claude Code em ritmo normal (dividido em sessões curtas pra manter contexto limpo).