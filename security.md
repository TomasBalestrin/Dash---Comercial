> 🏹 Gavião Arqueiro | 19/04/2026 | v1.0

# Security — Dash Comercial

## 1. Auth

### Método
Supabase Auth — email + senha. Sem OAuth. Sem signup público no MVP.

### Fluxo

```
[Login page]
  → POST /api/auth/login (body: { email, password })
  → Supabase Auth: signInWithPassword
  → JWT recebido
  → Set-Cookie HTTP-only (via @supabase/ssr)
  → Redirect /admin
  
[Toda request /admin/*]
  → middleware.ts intercepta
  → updateSession() refresh cookies se necessário
  → supabase.auth.getUser()
  → se null → redirect /login
  → se ok → next()

[Toda API /api/* protegida]
  → createClient() (server.ts)
  → auth.getUser()
  → se null → 401
  → prossegue
```

### Storage de tokens
- **HTTP-only cookies** via `@supabase/ssr` — **nunca** `localStorage`.
- Cookies: `sb-<project>-auth-token` (e `-refresh`).
- Flags: `Secure`, `SameSite=Lax`, `HttpOnly`.
- Refresh automático no middleware.

### Criação de admin
Manual no Supabase Dashboard:
1. **Authentication → Users → Add user**
2. Email + senha (min 12 chars, gerador recomendado).
3. Trigger `on_auth_user_created` cria linha em `profiles` automaticamente.

### Recovery de senha
Via Supabase Dashboard (MVP). Em versão futura: magic link via `/api/auth/recover`.

---

## 2. Autorização — 3 camadas

```
[Camada 1 — Middleware]       → bloqueia rotas /admin/* sem sessão
[Camada 2 — RLS Postgres]     → bloqueia queries sem is_admin()
[Camada 3 — Route Handler]    → valida auth.getUser() + Zod antes de lógica
```

### Tabela roles × recursos

| Recurso | Ação | Admin | Anônimo (dashboard público) |
|---|---|---|---|
| `/login` | GET/POST | ✅ | ✅ |
| `/admin/*` | qualquer | ✅ | ❌ (redirect) |
| `/dashboard` | GET | ✅ | ✅ |
| `/api/auth/*` | POST | ✅ | ✅ |
| `/api/dashboard/snapshot` | GET | ✅ | ✅ |
| `/api/*` (outros) | qualquer | ✅ | ❌ (401) |
| `teams` (SELECT) | via SQL | ✅ | ✅ (público pro dashboard) |
| `teams` (INSERT/UPDATE/DELETE) | via SQL | ✅ | ❌ |
| `sales` (SELECT) | via SQL | ✅ | ❌ (só via view agregada) |
| `sales` (INSERT/UPDATE/DELETE) | via SQL | ✅ | ❌ |
| `monthly_metrics` (SELECT) | via SQL | ✅ | ✅ |
| `goals` (SELECT) | via SQL | ✅ | ✅ |
| Views `v_*_monthly`, `v_latest_sales_public` | SELECT | ✅ | ✅ |
| Storage `team-banners` leitura | | ✅ | ✅ |
| Storage `team-banners` escrita | | ✅ | ❌ |
| Storage `closer-photos` leitura | | ✅ | ✅ |
| Storage `closer-photos` escrita | | ✅ | ❌ |

### Helper SQL `is_admin()`
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Validação — Zod everywhere

### Princípio
Todo input entra por Zod tanto no **client** (UX) quanto no **server** (segurança). Schema único em `src/lib/schemas/*.ts`.

### Exemplo — schema compartilhado
```ts
// src/lib/schemas/sale.ts
import { z } from 'zod';

export const saleCreateSchema = z.object({
  closer_id: z.string().uuid('Closer inválido'),
  product_id: z.string().uuid('Produto inválido'),
  client_name: z.string().min(2, 'Nome do cliente obrigatório').max(80),
  sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  value_total: z.number().positive('Valor total deve ser > 0').max(99999999.99),
  value_entrada: z.number().min(0, 'Entrada não pode ser negativa').max(99999999.99),
}).refine(
  (data) => data.value_entrada <= data.value_total,
  { message: 'Entrada não pode exceder o valor total', path: ['value_entrada'] }
).refine(
  (data) => new Date(data.sale_date) <= new Date(),
  { message: 'Data de venda não pode ser futura', path: ['sale_date'] }
);

export type SaleCreateInput = z.infer<typeof saleCreateSchema>;
```

### Sanitização
- Nenhum HTML renderizado a partir de input do usuário (sem `dangerouslySetInnerHTML`).
- Strings limitadas (max length) em toda coluna TEXT.
- Uploads validados por MIME type server-side (não confiar no Content-Type do client).

---

## 4. API security

### CORS
- **Produção**: `Access-Control-Allow-Origin: https://<dominio-prod>`.
- **Development**: `http://localhost:3000`.
- Configurado em `next.config.mjs` via `headers()`.

```js
// next.config.mjs
{
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, DELETE, PUT, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
}
```

### Rate limiting

| Rota | Limite | Window |
|---|---|---|
| `/api/auth/login` | 5 req | 1 min |
| `/api/auth/*` | 10 req | 1 min |
| `/api/*/banner`, `/api/*/photo` (uploads) | 10 req | 1 min |
| `/api/dashboard/snapshot` | 120 req | 1 min (generoso — dashboard poll) |
| `/api/*` (outros) | 60 req | 1 min |

**Implementação MVP**: `@upstash/ratelimit` com Upstash Redis (free tier) OU in-memory Map (aceitável para MVP single-instance, documentar limitação).

### Security headers
Configurados em `next.config.mjs`:

```js
{ key: 'X-Frame-Options', value: 'DENY' },                    // exceto /dashboard? não — TV usa direto, não iframe
{ key: 'X-Content-Type-Options', value: 'nosniff' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
{ key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: https://*.supabase.co; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; script-src 'self' 'unsafe-inline'" },
```

**Nota CSP**: `'unsafe-inline'` em styles é necessário pro Tailwind inline `style={{}}` no dashboard. Avaliar nonce em v2.

---

## 5. Env vars

### Client (prefixo `NEXT_PUBLIC_*`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...           # anon — protegido por RLS, OK expor
NEXT_PUBLIC_SITE_URL=https://dash.bethel.com.br
NEXT_PUBLIC_PODIUM_GLOW=true
NEXT_PUBLIC_DASHBOARD_POLL_MS=30000
```

### Server only (SEM prefixo `NEXT_PUBLIC`)
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...               # NUNCA no bundle client
```

### Regras absolutas
- `service_role` key **jamais** em arquivo client (`.tsx` sem 'use server' / Server Component).
- `.env.local` **sempre** em `.gitignore`.
- `.env.example` commitado **sem valores**.
- Keys rotacionadas se alguém compromete repo.

### Verificação
Rodar `grep -rn "SERVICE_ROLE" src/` — só pode aparecer em `src/app/api/` (Route Handlers) e nunca com `'use client'`.

---

## 6. Dados & LGPD

### PII armazenado
- **Admin**: email (auth.users), nome (profiles).
- **Vendas**: `client_name` (nome do cliente comprador).

### Proteção
- `client_name` fica SEMPRE em tabela privada (`sales`) com RLS admin-only.
- View pública `v_latest_sales_public` mascara para "Primeiro Nome + Inicial Sobrenome" (ex: "Roberto P.").
- Dashboard TV nunca mostra CPF, email ou telefone de cliente (nem existem no schema).

### Nunca armazenar
- Dados de cartão (não existe fluxo de pagamento).
- CPF (fora de escopo).
- Senhas em plaintext (Supabase Auth cuida).

### Soft delete
- `deleted_at TIMESTAMPTZ` em `teams`, `products`, `closers`, `sales`.
- Retenção mínima: 90 dias.
- Purge manual via SQL quando necessário.

### LGPD
- **MVP**: sem endpoint de export/delete automatizado. Request manual via admin.
- **v2**: endpoint `/api/compliance/export` e `/api/compliance/delete` para atender titular de dados.

---

## 7. Checklist pre-deploy

- [ ] RLS ativo em **todas** as 7 tabelas — verificar com `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';`
- [ ] Nenhuma referência a `SUPABASE_SERVICE_ROLE_KEY` em código com `'use client'` — `grep -rn "SERVICE_ROLE" src/`
- [ ] Zod em **todas** as rotas de API — revisar manualmente cada route.ts
- [ ] Env vars configuradas no Vercel (production + preview)
- [ ] `NEXT_PUBLIC_SITE_URL` = domínio real em produção
- [ ] CORS configurado para domínio prod (não `*`)
- [ ] Security headers ativos — testar via `curl -I`
- [ ] Rate limiting funcionando — testar login 6x em 1min
- [ ] Middleware protegendo `/admin/*` — testar acessar sem login
- [ ] `/dashboard` acessível sem auth — testar em janela anônima
- [ ] Uploads validados — tentar subir .exe, .svg (SVG bloqueado por MIME)
- [ ] Errors genéricos — client não vê stack trace ou SQL em response
- [ ] Zero `console.log` com dados sensíveis em produção — só `console.error`
- [ ] `.gitignore` inclui `.env*.local`, `node_modules`, `.next`
- [ ] Signup desabilitado no Supabase (**Authentication → Providers → Email → Enable signup = false**)
- [ ] Views públicas (`v_*_monthly`, `v_latest_sales_public`) testadas em sessão anônima
- [ ] Buckets de Storage: upload só com auth, leitura pública OK
