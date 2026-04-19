> 🕷️ Viúva Negra | 19/04/2026 | v1.0

# UX Flows — Dash Comercial

## 1. Mapa de rotas

```
/                               → redirect (auth? /admin : /login)
/login                          [PÚBLICO]
/admin                          → redirect /admin/vendas         [AUTH]
/admin/vendas                   Lista + CRUD vendas               [AUTH]
/admin/metricas                 Editor batch metrics mensais      [AUTH]
/admin/meta                     Meta do mês                       [AUTH]
/admin/times                    Grid CRUD times                   [AUTH]
/admin/closers                  Grid CRUD closers                 [AUTH]
/admin/produtos                 Tabela CRUD produtos              [AUTH]
/dashboard                      Canvas TV fullscreen              [PÚBLICO]
```

## 2. Navegação

### Sidebar (`/admin/*`)
- Desktop: fixa à esquerda, largura 240px.
- Mobile (< lg 1024px): drawer via hamburger.
- Logo "Dash Comercial" topo.
- Items:
  - 🛒 Vendas
  - 📞 Métricas Mensais
  - 🎯 Meta
  - 👥 Times
  - 👤 Closers
  - 📦 Produtos
  - 🖥️ Abrir Dashboard (`target="_blank"`, ícone external-link)
- Item ativo: background `bg-cardSoft` + accent borda esquerda.

### Header (`/admin/*`)
- Logo (mobile, some no desktop).
- Busca global (v2 — fora do MVP).
- Avatar dropdown com: email do admin, Logout.

### `/dashboard` — SEM navegação
- Nenhum header, sidebar, botão voltar, nada. Canvas puro.

## 3. Fluxos por feature

---

### 3.1 Login

**Persona**: Admin
**Trigger**: Acesso a `/admin/*` sem sessão, ou digitar `/login` direto.

```
[/login]
   email + senha + botão "Entrar"
   ↓ submit
[Loading botão 1-2s]
   ↓ sucesso
[/admin/vendas] (tela principal)
   ↓ erro credencial
[/login] com alert inline "Email ou senha inválidos"
```

**Elementos**:
- Input email (autoComplete="email", validação inline blur).
- Input senha (type=password, toggle eye, autoComplete="current-password").
- Botão "Entrar" — disabled até ambos preenchidos e válidos.
- Link "Esqueci minha senha" → modal "Procure o administrador para reset" (MVP sem magic link).
- Loading state: botão vira spinner + texto "Entrando...".

**Estados**:
- Empty: campos vazios, botão disabled.
- Loading: spinner, campos disabled.
- Error: alert vermelho acima do form.

---

### 3.2 Criar Time

**Persona**: Admin
**Trigger**: Clica "Novo time" em `/admin/times`.

```
[/admin/times]
   grid de TeamCards + botão "+ Novo time"
   ↓ click
[Drawer lateral direita]
   form: nome + upload banner + color picker + gradient preset + shape + ordem
   ↓ submit
[Drawer fecha, grid atualiza]
   toast "Time criado ✅"
   ↓ erro validação
[Campos com erro inline em vermelho]
   ↓ erro upload (>2MB)
[Alert "Arquivo deve ter < 2MB"]
```

**Elementos do form**:
- Nome (input, required, max 40).
- Banner (upload dropzone; preview da imagem; botão "Remover").
- Accent color (swatches presets + custom via `<input type="color">`).
- Gradient preset (select: Blue, Coral, Green, Purple) com preview.
- Shape (radio: Triangle, Chevron, Hexagon) com preview SVG.
- Ordem (number, 0-999).
- Botão "Salvar" primário + "Cancelar" secundário.

**Estados**:
- Empty state (nenhum time): ilustração + "Crie seu primeiro time".
- Loading: skeleton cards.
- Error global: banner no topo.

---

### 3.3 Criar Closer

**Persona**: Admin
**Trigger**: Clica "Novo closer" em `/admin/closers`.

```
[/admin/closers]
   grid de CloserCards agrupados por time + botão "+ Novo closer"
   ↓ click
[Drawer]
   form: nome + upload foto + iniciais (auto) + color picker + select time + ordem
   ↓ submit
[Grid atualiza com nova foto/avatar]
   toast "Closer criado ✅"
```

**Regras UX**:
- Ao digitar nome, campo "Iniciais" preenche automaticamente (primeira letra primeiro+último nome). Override manual.
- Se time dropdown vazio, CTA "Crie um time primeiro" com link.
- Se foto não fornecida, preview mostra avatar com iniciais no accent_color.

---

### 3.4 Criar Produto

**Persona**: Admin
**Trigger**: Clica "+ Novo produto" em `/admin/produtos`.

```
[/admin/produtos]
   tabela (nome + ações) + input inline "Novo produto"
   ↓ enter ou click +
[Row adicionado na tabela]
   toast "Produto criado ✅"
```

- Form inline (não drawer) — é um só campo.
- Edit inline ao clicar no nome (virar input).
- Delete com `AlertDialog` "Deletar produto X? Não pode ser desfeito."

---

### 3.5 Registrar Venda — **fluxo mais importante**

**Persona**: Admin
**Trigger**: Clica "+ Nova venda" em `/admin/vendas` (tela principal).

```
[/admin/vendas]
   tabela (data↓, closer, produto, cliente, entrada, total, ações)
   filtros (mês, closer, produto, busca cliente)
   botão "+ Nova venda"
   ↓ click
[Drawer lateral direita]
   form: closer (Command searchable) + produto (select) + cliente (input) + data (default hoje) + total (currency) + entrada (currency)
   ↓ submit
[Drawer fecha, linha inserida no topo da tabela com highlight verde 2s]
   toast "Venda registrada ✅"
   ↓ 1-2s depois
[Dashboard TV (aberto em outra tela) recebe via Realtime → slide-in + flash glow]
   ↓ erro (entrada > total)
[Campo entrada com erro "Entrada não pode exceder o valor total"]
```

**Elementos do form**:
- **Closer**: `Command` (shadcn searchable) com foto + nome. Required.
- **Produto**: `Select` simples. Required.
- **Cliente**: input text. Required.
- **Data**: `DatePicker` com default hoje. Não permite futuro.
- **Valor total**: input currency BRL formatado (R$ 0,00). > 0.
- **Valor entrada**: input currency. ≥ 0 e ≤ total. Calculadora rápida: botões "30%", "50%", "100%".
- **Submit**: disabled até form válido.

**Estados**:
- Empty (nenhuma venda no mês): ilustração + "Registre a primeira venda do mês".
- Loading: skeleton rows.
- Filtro sem resultado: "Nenhuma venda corresponde aos filtros".

---

### 3.6 Editar Métricas Mensais (Calls + Conv)

**Persona**: Admin
**Trigger**: Menu → "Métricas Mensais" ou deep-link.

```
[/admin/metricas]
   seletor de mês (default corrente) + tabela (foto+nome closer, input calls, input conv%)
   "● Alterações não salvas" aparece ao editar
   ↓ click "Salvar alterações"
[Loading]
   ↓ sucesso
[Toast "Métricas salvas ✅" + indicador some]
```

**Elementos**:
- Seletor de mês: `Select` últimos 12 meses. Default corrente.
- Tabela com linhas por closer (ordenado por display_order).
- Inputs inline (calls number, conv% number com suffix "%").
- Footer fixo: "Cancelar alterações" + "Salvar" (primário).
- Blur em input com valor inválido mostra erro inline.

**Regras**:
- Upsert batch no `/api/metrics/batch`.
- Se mês não tem registros, linhas aparecem com 0 e flag "new". Save cria.
- Deixar página com alterações pendentes → `AlertDialog` "Descartar alterações?".

---

### 3.7 Definir Meta do Mês

**Persona**: Admin
**Trigger**: Menu → "Meta".

```
[/admin/meta]
   seletor mês + input currency + botão Salvar
   card com meta atual exibida (se existe)
   ↓ submit
[Toast "Meta atualizada ✅"]
[Dashboard TV atualiza meta via Realtime]
```

- Mês: default corrente, select 12 meses.
- Valor: currency BRL, > 0.
- Visualização: card com valor formatado + "Última atualização: há 5min".

---

### 3.8 Dashboard TV (`/dashboard`)

**Persona**: Time comercial (passivo)
**Trigger**: TV do escritório aberta na URL 24/7.

```
[/dashboard]
   canvas 1920×1080 auto-scale
   ↓ a cada venda registrada no admin
[Realtime → re-fetch → slide-in última venda + flash glow no goal card]
   ↓ sem ação do usuário
[Atualização contínua]
```

**Seções** (ver PRD §F8 para detalhes).

**Estados especiais**:
- **Sem dados**: mostra "—" em valores numéricos, "Aguardando dados" em listas.
- **Perda de conexão Realtime**: badge discreto "● Reconectando..." no canto inferior direito. Fallback polling automático.
- **Erro fatal**: redireciona para mini-página de erro com "Dashboard temporariamente indisponível — Recarregando...". Auto-reload após 10s.

---

## 4. Auth flow

### Login
```
/login
  ↓ form válido
POST /api/auth/login
  ↓ 200
Set cookies → redirect /admin/vendas
  ↓ 401
Inline error "Email ou senha inválidos"
```

### Logout
```
Header avatar dropdown → "Sair"
  ↓
POST /api/auth/logout
  ↓
Clear cookies → redirect /login
```

### Sessão expirada
```
Middleware detecta cookie inválido
  ↓
Redirect /login?redirect=/admin/vendas
  ↓ login ok
Volta para /admin/vendas
```

### Recovery
MVP: sem fluxo automatizado. Mensagem "Procure o administrador".

---

## 5. Onboarding pós-primeiro-login

Primeiro login do admin → checklist na `/admin/vendas`:

1. ☐ Criar primeiro time → `/admin/times`
2. ☐ Adicionar produtos → `/admin/produtos`
3. ☐ Cadastrar closers → `/admin/closers`
4. ☐ Definir meta do mês → `/admin/meta`
5. ☐ Registrar primeira venda → botão "+ Nova venda"
6. ☐ Abrir `/dashboard` na TV

Checklist persiste em localStorage (pode ignorar).

---

## 6. Padrões de interação

### Forms
- Label acima do input.
- Validação no **blur** (não a cada keystroke).
- Erro inline em vermelho abaixo do input + ícone alert.
- Submit desabilitado até form válido.
- Loading no botão ("Salvar" → spinner + "Salvando...").
- Dropzone de upload com drag-and-drop + click fallback.

### Tabelas
- Busca com debounce 300ms.
- Filtros em drawer "Filtros" (mobile) ou barra lateral (desktop).
- Sort clicando no header da coluna (data, valor).
- Paginação 50 items/pág.
- Row actions: ícones ao hover (edit, delete) + dropdown kebab em mobile.
- Empty state obrigatório.
- Skeleton loading.

### Modais vs Drawers
- **Modal (Dialog)**: ≤ 3 campos (ex: novo produto, confirmação de delete).
- **Drawer (Sheet)**: formulários longos (time, closer, venda).
- **Fullscreen** em mobile < md.

### Feedback
- **Toast success**: 3s, dismiss automático. Cor accent gold.
- **Toast error**: persiste até dismiss manual. Cor red-500.
- **AlertDialog**: toda ação destrutiva (delete). Texto "Deletar X? Esta ação não pode ser desfeita."
- **Optimistic update**: delete de linha da tabela remove imediatamente; rollback + toast erro se falhar no server.

---

## 7. Responsividade

### Admin
| Breakpoint | Layout |
|---|---|
| `< sm` (< 640) | Drawer navigation, cards 1 col, forms fullscreen |
| `sm` (640) | Cards 2 col em times/closers |
| `md` (768) | Drawer ainda, cards 2 col |
| `lg` (1024) | **Sidebar fixa**, cards 3 col, tabelas com todas colunas |
| `xl` (1280) | Max-width 1440px, mais espaçamento |

### Dashboard TV
- **Não-responsivo por breakpoint**. Canvas fixo 1920×1080.
- Auto-scale no container raiz (`transform: scale(...)`).
- Letterbox aceito em proporções não 16:9.

---

## 8. Acessibilidade

### Admin (WCAG AA)
- **Keyboard nav**: Tab em todos inputs e botões.
- **Focus visible**: outline 2px accent em todo focusable.
- **ARIA**: labels em inputs, `role="alert"` em toasts, `aria-live="polite"` em mudanças dinâmicas.
- **Contraste**: 4.5:1 mínimo. Cards `#0C1523` + texto `#FFF` = 18:1 ✅.
- **Skip to content**: link oculto na primeira tab no admin.
- **AlertDialog**: focus trap quando aberto, ESC fecha, `aria-labelledby`.

### Dashboard TV
- **Acessibilidade reduzida aceita** — é passivo, sem interação.
- Fontes grandes (22-75px) garantem legibilidade a distância.
- Accent colors com contraste alto contra bg dark.
- Nenhum dado crítico transmitido apenas por cor (valores em texto explícito).

---

## 9. Estados obrigatórios em TODA tela

| Estado | Admin | Dashboard |
|---|---|---|
| Loading inicial | Skeleton | Loading "..." centralizado |
| Empty (sem dados) | Ilustração + CTA | "Aguardando dados" |
| Error | Alert + botão retry | Auto-retry + mensagem discreta |
| Success | Toast + UI updated | Animation (slide-in, flash) |
| Offline | Banner topo "Sem conexão" | Badge "Reconectando..." |
