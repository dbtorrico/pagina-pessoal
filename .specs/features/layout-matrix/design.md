# Layout Matrix — Design

**Spec:** `.specs/features/layout-matrix/spec.md`
**Context:** `.specs/features/layout-matrix/context.md`
**Status:** Draft

---

## Architecture Overview

Site estático single-page com navegação via JS (show/hide de seções). Sem framework, sem build tool — arquivos servidos diretamente pelo GitHub Pages.

```
index.html
├── <canvas id="matrix-rain">        ← z-index: 0 (fundo animado)
├── <nav id="sidebar">               ← z-index: 10 (menu lateral fixo)
│   ├── .site-title                  ← "TORRICO" / logo
│   ├── .nav-links                   ← links das 3 seções
│   └── .visitor-counter             ← [VISITORS: 0042]
├── <main id="content">              ← z-index: 5 (área de conteúdo)
│   ├── #section-poko-loko-lab       ← placeholder M2
│   ├── #section-jogos               ← placeholder M3
│   └── #section-curriculo           ← placeholder M4
└── <button id="hamburger">          ← visível só em mobile
```

**Fluxo de navegação:**
```
Clique no link do menu
    → navigation.js captura o evento
    → esconde todas as seções (.section)
    → exibe a seção alvo (#section-[name])
    → atualiza classe .active no menu
    → fecha sidebar (se mobile)
```

**Fluxo do contador:**
```
Página carrega
    → counter.js faz fetch para CountAPI
    → API incrementa e retorna { value: N }
    → JS atualiza #visitor-count no DOM
    → Em caso de erro: exibe "---"
```

---

## Estrutura de Arquivos

```
pagina-pessoal/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── matrix-rain.js    ← canvas animation
│   ├── navigation.js     ← menu + seções
│   └── counter.js        ← CountAPI
└── assets/
    └── (fontes, imagens — futuras features)
```

> **Decisão:** arquivos antigos (`Pagina1.html`, `estilo.css`, `script.js`, `fontes/`, `imagens/`) serão removidos — o Torrico confirmou que podemos ignorar o que existe.

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
|---|---|---|
| Nenhum | — | Projeto reescrito do zero |

### Integração Externa

| Sistema | Método |
|---|---|
| CountAPI | `fetch('https://api.countapi.xyz/hit/dbtorrico/pagina-pessoal')` → `{ value: N }` |
| Google Fonts | `<link>` no `<head>` para carregar VT323 |
| GitHub Pages | Push na branch `main` → deploy automático |

---

## Components

### `index.html`

- **Purpose:** Estrutura HTML completa — shell do site com todas as seções e referências a CSS/JS
- **Location:** `index.html`
- **Conteúdo:**
  - `<head>`: meta tags, link para VT323 (Google Fonts), link para `style.css`
  - `<canvas id="matrix-rain">`: fullscreen, posição fixa, z-index 0
  - `<button id="hamburger">`: visível só mobile, z-index 20
  - `<nav id="sidebar">`: título, nav-links, visitor-counter
  - `<main id="content">`: 3 sections com conteúdo placeholder
  - `<script>` tags ao final do body: `matrix-rain.js`, `navigation.js`, `counter.js`
- **Dependencies:** `style.css`, os 3 arquivos JS

---

### `css/style.css`

- **Purpose:** Tema Matrix completo — variáveis de cor, layout sidebar+main, animações CSS, responsividade
- **Location:** `css/style.css`
- **Variáveis CSS (`:root`):**
  ```css
  --color-bg: #050a05;
  --color-green: #00FF41;
  --color-green-dim: #003B00;
  --color-green-glow: rgba(0, 255, 65, 0.15);
  --color-white-char: #CCFFCC;
  --font-main: 'VT323', 'Courier New', monospace;
  --sidebar-width: 220px;
  ```
- **Seções do CSS:**
  1. Reset + base (`*, body, html`)
  2. Layout (`#sidebar` + `#content` — flex row)
  3. Sidebar (fixo, bordas, links, hover, item ativo)
  4. Visitor counter (formato terminal)
  5. Main content (padding, seções show/hide)
  6. Canvas (posição fixa, fullscreen, pointer-events: none)
  7. Hamburger button (hidden desktop, visible mobile)
  8. Media query `@media (max-width: 768px)` — sidebar overlay + hamburger

---

### `js/matrix-rain.js`

- **Purpose:** Animação de chuva de caracteres Matrix no canvas de fundo
- **Location:** `js/matrix-rain.js`
- **Interfaces:**
  - `initMatrixRain()` — inicializa o canvas e começa animação
  - Responde automaticamente a `window.resize`
  - Verifica `prefers-reduced-motion` antes de animar
- **Lógica:**
  ```
  1. Pega #matrix-rain canvas, define width/height = window
  2. Cria array de posições Y para cada coluna (espaçamento: 20px)
  3. A cada frame (requestAnimationFrame):
     a. Desenha retângulo semi-transparente sobre tudo (cria efeito de fade)
     b. Para cada coluna:
        - Escolhe caractere aleatório (katakana + números + símbolos)
        - Desenha em branco (#CCFFCC) o caractere mais recente
        - Desenha em verde (#00FF41) os caracteres anteriores
        - Avança Y da coluna
        - Reseta coluna aleatoriamente quando passa do limite
  ```
- **Caracteres usados:** `'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789$%@#&*?!'`
- **Dependencies:** Nenhuma

---

### `js/navigation.js`

- **Purpose:** Controla navegação entre seções e comportamento do menu (desktop + mobile)
- **Location:** `js/navigation.js`
- **Interfaces:**
  - `initNavigation()` — configura event listeners
  - `showSection(sectionId)` — exibe seção, esconde as outras, atualiza menu ativo
  - `toggleSidebar()` — abre/fecha sidebar (mobile)
- **Lógica:**
  ```
  1. Ao carregar: exibe seção padrão (#section-poko-loko-lab), marca link como ativo
  2. Click em nav-link:
     - Previne default
     - showSection(target)
     - Se mobile: fecha sidebar
  3. Click em #hamburger: toggleSidebar()
  4. Click fora do sidebar (overlay): fecha sidebar (mobile)
  ```
- **Dependencies:** Nenhuma

---

### `js/counter.js`

- **Purpose:** Incrementa e exibe contador de visitantes via CountAPI
- **Location:** `js/counter.js`
- **Interfaces:**
  - `initCounter()` — faz fetch para CountAPI e atualiza DOM
- **API endpoint:**
  ```
  GET https://api.countapi.xyz/hit/dbtorrico/pagina-pessoal
  Response: { "value": 42 }
  ```
- **Lógica:**
  ```
  1. fetch(endpoint)
  2. Sucesso: formata número com padding zeros (ex: 0042), exibe "[VISITORS: 0042]"
  3. Erro (qualquer): exibe "[VISITORS: ---]"
  4. Timeout: 5 segundos máximo para a requisição
  ```
- **Dependencies:** Nenhuma (fetch nativo)

---

## Error Handling Strategy

| Erro | Handling | O que o usuário vê |
|---|---|---|
| CountAPI timeout / erro | try/catch + fallback | `[VISITORS: ---]` |
| Fonte VT323 não carrega | font-family fallback no CSS | Courier New / monospace |
| Canvas não suportado | `if (!canvas.getContext)` → skip | Página normal sem rain |
| `prefers-reduced-motion` | Detectado antes de `requestAnimationFrame` | Canvas estático ou sem animação |
| JS desabilitado | Primeira seção visível por padrão via CSS (sem `display:none` no HTML inicial) | Conteúdo da seção 1 visível |

---

## Tech Decisions

| Decisão | Escolha | Rationale |
|---|---|---|
| Navegação entre seções | JS show/hide (SPA-like) | Sem reload, sem framework, sem rotas |
| Primeira seção visível | `#section-poko-loko-lab` | Primeira no menu, mais representativa do autor |
| Canvas z-index | `z-index: 0`, `pointer-events: none` | Rain visual apenas, não interfere em cliques |
| Sidebar width | `220px` | Espaço suficiente para textos sem dominar a tela |
| Contador com padding | `String(n).padStart(4, '0')` | Estilo terminal retro: `0042` em vez de `42` |
| Remoção dos arquivos antigos | Deletar todos | Confirmado pelo Torrico — reescrita total |
| CountAPI namespace | `dbtorrico/pagina-pessoal` | Namespace único por projeto para evitar colisão |
