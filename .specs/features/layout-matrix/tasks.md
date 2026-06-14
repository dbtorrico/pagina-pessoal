# Layout Matrix — Tasks

**Design:** `.specs/features/layout-matrix/design.md`
**Status:** Approved

---

## Execution Plan

### Phase 1 — Limpeza (Sequential)
```
T1
```

### Phase 2 — Estrutura Base (Sequential)
```
T1 → T2
```

### Phase 3 — Implementação (Parallel) [P]
```
        ┌→ T3 (CSS) ──────────┐
T2 ─────┼→ T4 (matrix-rain) ──┼──→ T7
        ├→ T5 (navigation) ───┤
        └→ T6 (counter) ──────┘
```

### Phase 4 — Deploy (Sequential)
```
T3 + T4 + T5 + T6 → T7
```

---

## Task Breakdown

### T1: Remover arquivos legados

**What:** Deletar todos os arquivos do projeto antigo (HTML, CSS, JS e assets) para começar limpo
**Where:** `Pagina1.html`, `estilo.css`, `script.js`, `fontes/`, `imagens/`
**Depends on:** None
**Reuses:** N/A
**Requirement:** LAY-01 (preparação para reescrita total)

**Done when:**
- [ ] `Pagina1.html` removido
- [ ] `estilo.css` removido
- [ ] `script.js` removido
- [ ] Diretório `fontes/` removido
- [ ] Diretório `imagens/` removido
- [ ] `ls` na raiz do projeto mostra apenas `.git/`, `.specs/`, `.agents/`, `.claude/` e arquivos de config de IDE

**Tests:** none
**Gate:** manual — `ls /Users/torrico-estudio/Documents/Claude/code/pagina-pessoal`

**Commit:** `chore: remove legacy static files`

---

### T2: Criar index.html — esqueleto base

**What:** Criar o arquivo HTML principal com toda a estrutura semântica: canvas, sidebar, main, seções placeholder e referências a CSS/JS
**Where:** `index.html`
**Depends on:** T1
**Reuses:** N/A
**Requirement:** LAY-05, LAY-06, LAY-09

**Estrutura esperada:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TORRICO</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <canvas id="matrix-rain"></canvas>
  <button id="hamburger" aria-label="Menu">&#9776;</button>
  <div id="overlay"></div>

  <nav id="sidebar">
    <div class="site-title">TORRICO</div>
    <ul class="nav-links">
      <li><a href="#" data-section="poko-loko-lab" class="active">&gt; Poko Loko Lab</a></li>
      <li><a href="#" data-section="jogos">&gt; Jogos</a></li>
      <li><a href="#" data-section="curriculo">&gt; Currículo</a></li>
    </ul>
    <div class="visitor-counter" id="visitor-counter">[VISITORS: ----]</div>
  </nav>

  <main id="content">
    <section id="section-poko-loko-lab" class="section active">
      <h1>Poko Loko Lab</h1>
      <p>// Em construção...</p>
    </section>
    <section id="section-jogos" class="section">
      <h1>Jogos</h1>
      <p>// Em construção...</p>
    </section>
    <section id="section-curriculo" class="section">
      <h1>Currículo</h1>
      <p>// Em construção...</p>
    </section>
  </main>

  <script src="js/matrix-rain.js"></script>
  <script src="js/navigation.js"></script>
  <script src="js/counter.js"></script>
</body>
</html>
```

**Done when:**
- [ ] Arquivo `index.html` existe na raiz do projeto
- [ ] `<canvas id="matrix-rain">` presente
- [ ] `<nav id="sidebar">` com 3 links (`data-section` correto em cada um)
- [ ] `<main id="content">` com 3 `<section>` (ids: `section-poko-loko-lab`, `section-jogos`, `section-curriculo`)
- [ ] `<div id="visitor-counter">` presente com texto inicial `[VISITORS: ----]`
- [ ] `<button id="hamburger">` presente
- [ ] Links para VT323 (Google Fonts), `css/style.css` e os 3 arquivos JS no lugar certo
- [ ] Abrir `index.html` no browser não exibe erros 404 bloqueantes

**Tests:** none
**Gate:** manual — abrir `index.html` no browser, inspecionar DOM

**Commit:** `feat(layout): add index.html skeleton with Matrix structure`

---

### T3: Criar css/style.css — tema Matrix completo [P]

**What:** Criar o arquivo CSS com variáveis de cor, layout sidebar+main, estilos de todas as seções, hover terminal, responsividade mobile e hamburger
**Where:** `css/style.css`
**Depends on:** T2
**Reuses:** N/A
**Requirement:** LAY-01, LAY-02, LAY-03, LAY-04, LAY-07, LAY-08, LAY-14, LAY-15

**Deve incluir:**
- Variáveis `:root` (cores, fonte, sidebar-width)
- Reset: `* { box-sizing: border-box; margin: 0; padding: 0; }`
- `body`: `background: var(--color-bg)`, `color: var(--color-green)`, `font-family: var(--font-main)`, `display: flex`
- `canvas#matrix-rain`: `position: fixed`, `top: 0`, `left: 0`, `width: 100%`, `height: 100%`, `z-index: 0`, `pointer-events: none`
- `#sidebar`: largura `220px`, fixo, `height: 100vh`, borda direita verde, `z-index: 10`, `background: rgba(5,10,5,0.90)`
- `.nav-links a`: hover com brilho `text-shadow`, cor mais intensa
- `.nav-links a.active`: cor branca ou verde brilhante, prefixo `>` já no HTML
- `#content`: `flex: 1`, `overflow-y: auto`, `z-index: 5`, `position: relative`, `padding: 2rem`
- `.section`: `display: none` por padrão
- `.section.active`: `display: block`
- `.visitor-counter`: formatado estilo terminal, tamanho menor, no rodapé do sidebar
- `#hamburger`: `display: none` no desktop; `display: block` em `@media (max-width: 768px)`
- `#overlay`: `display: none`; quando `.open`: `display: block`, fullscreen semi-transparente, `z-index: 9`
- `@media (max-width: 768px)`: sidebar `position: fixed`, `left: -220px`, `transition`, `.open { left: 0 }`

**Done when:**
- [ ] Arquivo `css/style.css` criado
- [ ] Fundo `#050a05` visível ao abrir `index.html`
- [ ] Texto em verde `#00FF41` e fonte VT323
- [ ] Menu lateral visível à esquerda com largura correta
- [ ] Links do menu com efeito hover (brilho/cor)
- [ ] Primeira seção visível (`.active`), outras ocultas
- [ ] Em viewport < 768px: sidebar oculta, botão hamburger visível

**Tests:** none
**Gate:** manual — abrir `index.html` no browser (desktop e mobile viewport via DevTools)

**Commit:** `feat(layout): add Matrix theme CSS with variables and responsive layout`

---

### T4: Criar js/matrix-rain.js — animação canvas [P]

**What:** Criar o script de animação de chuva de caracteres Matrix no canvas de fundo
**Where:** `js/matrix-rain.js`
**Depends on:** T2
**Reuses:** N/A
**Requirement:** LAY-16, LAY-17, LAY-18

**Lógica obrigatória:**
```javascript
// 1. Verificar prefers-reduced-motion ANTES de qualquer coisa
// 2. Pegar canvas + contexto 2D
// 3. Definir charset: katakana + números + símbolos
// 4. Inicializar array de posições Y (uma por coluna, espaçamento 20px)
// 5. Função draw():
//    a. fillRect semi-transparente (#050a05 com alpha ~0.05) para fade
//    b. Para cada coluna: char aleatório, cor branca no topo, verde nos demais
//    c. Avança Y; reseta aleatoriamente ao ultrapassar height
// 6. requestAnimationFrame(draw) — loop
// 7. window.addEventListener('resize', reinicializar colunas)
```

**Done when:**
- [ ] Arquivo `js/matrix-rain.js` criado
- [ ] Animação de chuva de caracteres visível ao abrir `index.html` (fundo)
- [ ] Caracteres em verde (`#00FF41`) com o mais recente em branco/verde claro
- [ ] Efeito de fade (caracteres somem gradualmente)
- [ ] Conteúdo do sidebar e main legível por cima do canvas
- [ ] Se `prefers-reduced-motion: reduce` → canvas fica estático (sem animação)
- [ ] Redimensionar janela não quebra a animação

**Tests:** none
**Gate:** manual — abrir `index.html`, verificar animação no fundo

**Commit:** `feat(layout): add Matrix rain canvas animation`

---

### T5: Criar js/navigation.js — navegação entre seções [P]

**What:** Criar o script que controla a navegação SPA-like entre seções e o comportamento do menu hamburger no mobile
**Where:** `js/navigation.js`
**Depends on:** T2
**Reuses:** N/A
**Requirement:** LAY-05, LAY-06, LAY-07, LAY-08

**Lógica obrigatória:**
```javascript
// showSection(sectionId):
//   - Remove .active de todas as .section
//   - Adiciona .active na section alvo
//   - Remove .active de todos os nav-links a
//   - Adiciona .active no link clicado
//   - Se mobile (sidebar.classList.contains('open')): fecha sidebar

// Event listeners:
//   - Cada 'a[data-section]': click → showSection(data-section)
//   - '#hamburger': click → toggle class 'open' em #sidebar e #overlay
//   - '#overlay': click → remove 'open' de #sidebar e #overlay
//   - document: keydown 'Escape' → fecha sidebar se aberto

// Init:
//   - showSection('poko-loko-lab') ao carregar
```

**Done when:**
- [ ] Arquivo `js/navigation.js` criado
- [ ] Clicar em "Poko Loko Lab" exibe `#section-poko-loko-lab`, oculta as demais
- [ ] Clicar em "Jogos" exibe `#section-jogos`, oculta as demais
- [ ] Clicar em "Currículo" exibe `#section-curriculo`, oculta as demais
- [ ] Link da seção ativa tem classe `.active` (estilo diferenciado)
- [ ] Em mobile: hamburger abre/fecha sidebar com overlay
- [ ] Clicar no overlay fecha o menu
- [ ] Tecla `Escape` fecha o menu mobile

**Tests:** none
**Gate:** manual — testar cada link do menu e comportamento mobile via DevTools

**Commit:** `feat(layout): add section navigation with mobile hamburger`

---

### T6: Criar js/counter.js — contador de visitantes [P]

**What:** Criar o script que integra com CountAPI para incrementar e exibir o contador de visitantes
**Where:** `js/counter.js`
**Depends on:** T2
**Reuses:** N/A
**Requirement:** LAY-10, LAY-11, LAY-12

**Lógica obrigatória:**
```javascript
// Endpoint: https://api.countapi.xyz/hit/dbtorrico/pagina-pessoal
// 1. fetch(endpoint) com AbortController timeout de 5s
// 2. Sucesso: formatar valor com padStart(4, '0')
//    → atualizar #visitor-counter: '[VISITORS: 0042]'
// 3. Erro (network, timeout, status != 200):
//    → atualizar #visitor-counter: '[VISITORS: ----]'
// 4. Chamar ao carregar o DOM (DOMContentLoaded ou fim do body)
```

**Done when:**
- [ ] Arquivo `js/counter.js` criado
- [ ] Ao abrir a página, `#visitor-counter` exibe número real (ex: `[VISITORS: 0001]`)
- [ ] Cada reload incrementa o número
- [ ] Número formatado com 4 dígitos e zeros à esquerda
- [ ] Se API falhar (testar com URL errada), exibe `[VISITORS: ----]` sem erro no console
- [ ] Timeout de 5s implementado (não trava a página)

**Tests:** none
**Gate:** manual — abrir página, verificar contador; simular falha alterando URL temporariamente

**Commit:** `feat(layout): add visitor counter via CountAPI`

---

### T7: Verificar deploy no GitHub Pages

**What:** Ativar GitHub Pages no repositório e confirmar que o site é acessível na URL pública com todos os assets carregando
**Where:** Configuração do repositório GitHub (`dbtorrico/pagina-pessoal`)
**Depends on:** T3, T4, T5, T6
**Reuses:** N/A
**Requirement:** LAY-13, LAY-14

**Passos:**
1. Garantir que todos os paths de assets em `index.html` e CSS são **relativos** (sem `/` inicial)
2. Fazer commit e push de tudo para `main`
3. No GitHub: Settings → Pages → Source: `Deploy from branch` → `main` → `/ (root)`
4. Aguardar deploy (~2 min) e acessar `https://dbtorrico.github.io/pagina-pessoal`

**Done when:**
- [ ] Commit com todos os arquivos (index.html, css/, js/) feito e pushed para `main`
- [ ] GitHub Pages ativado na branch `main`, raiz `/`
- [ ] URL `https://dbtorrico.github.io/pagina-pessoal` retorna status 200
- [ ] VT323 carrega (texto em pixel font, não serif)
- [ ] Canvas matrix-rain animando
- [ ] Menu lateral funcional
- [ ] Contador exibindo valor (ou `----` se CountAPI tiver delay)
- [ ] Nenhum erro 404 nos assets no DevTools Network

**Tests:** none
**Gate:** manual — acessar URL pública em browser desktop e mobile

**Commit:** `chore: configure and verify GitHub Pages deployment`

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 (limpar arquivos legados)

Phase 2 (Sequential):
  T1 → T2 (index.html skeleton)

Phase 3 (Parallel — todos independentes entre si):
  T2 completo, então:
    ├── T3 [P]  css/style.css
    ├── T4 [P]  js/matrix-rain.js
    ├── T5 [P]  js/navigation.js
    └── T6 [P]  js/counter.js

Phase 4 (Sequential):
  T3 + T4 + T5 + T6 → T7 (deploy)
```

---

## Task Granularity Check

| Task | Escopo | Status |
|---|---|---|
| T1: Remover arquivos legados | 1 operação de limpeza | ✅ Granular |
| T2: Criar index.html | 1 arquivo HTML | ✅ Granular |
| T3: Criar style.css | 1 arquivo CSS | ✅ Granular |
| T4: Criar matrix-rain.js | 1 componente JS | ✅ Granular |
| T5: Criar navigation.js | 1 componente JS | ✅ Granular |
| T6: Criar counter.js | 1 função JS | ✅ Granular |
| T7: Configurar GitHub Pages | 1 ação de deploy | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagrama Mostra | Status |
|---|---|---|---|
| T1 | None | Início da cadeia | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 [P] | ✅ Match |
| T4 | T2 | T2 → T4 [P] | ✅ Match |
| T5 | T2 | T2 → T5 [P] | ✅ Match |
| T6 | T2 | T2 → T6 [P] | ✅ Match |
| T7 | T3, T4, T5, T6 | T3+T4+T5+T6 → T7 | ✅ Match |

---

## Test Co-location Validation

| Task | Camada Criada | Matrix Requer | Task Diz | Status |
|---|---|---|---|---|
| T1 | Nenhuma (deleção) | none | none | ✅ OK |
| T2 | HTML estrutural | none | none | ✅ OK |
| T3 | CSS visual | none | none | ✅ OK |
| T4 | JS (canvas) | none | none | ✅ OK |
| T5 | JS (navegação) | none | none | ✅ OK |
| T6 | JS (counter) | none | none | ✅ OK |
| T7 | Deploy | none | none | ✅ OK |
