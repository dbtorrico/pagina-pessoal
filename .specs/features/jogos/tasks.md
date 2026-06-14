# Jogos — Tasks

**Design:** `.specs/features/jogos/design.md`
**Status:** Approved

---

## Execution Plan

### Phase 1 — Markup (Sequential)
```
T1 (HTML da seção Jogos)
```

### Phase 2 — Implementação (Parallel)
```
        ┌→ T2 (CSS jogos + snake-cover + game-header)
T1 ─────┤
        └→ T3 (js/snake.js — motor do jogo)
```

### Phase 3 — Integração (Sequential)
```
T2 + T3 → T4 (js/jogos.js — view manager)
```

---

## Task Breakdown

### T1: Atualizar markup da seção Jogos em index.html

**What:** Substituir o placeholder `#section-jogos` pelo markup completo: list-view com card Snake e game-view com canvas + overlay
**Where:** `index.html` — `<section id="section-jogos">`
**Depends on:** None
**Requirement:** JOG-01, JOG-02, JOG-04, JOG-05, JOG-07

**Markup a inserir:**
```html
<section id="section-jogos" class="section">
  <div id="jogos-list-view">
    <div class="poko-header">
      <h1>Jogos</h1>
      <p>// jogos desenvolvidos pelo Torrico</p>
    </div>
    <div class="projects-grid">
      <div class="project-card game-card" data-game="snake">
        <div class="card-thumb snake-cover">
          <div class="snake-cover-art">
            <span>S</span><span>N</span><span>A</span><span>K</span><span>E</span>
          </div>
        </div>
        <div class="card-body">
          <span class="card-badge">JOGO</span>
          <div class="card-title">Snake</div>
          <div class="card-desc">O clássico Snake com visual Matrix. Use as setas ou WASD para controlar a cobra.</div>
          <span class="card-link-hint">&gt; jogar_</span>
        </div>
      </div>
    </div>
  </div>

  <div id="jogos-game-view">
    <div class="game-header">
      <button id="btn-back-jogos">&lt; Voltar</button>
      <span class="game-title-active">SNAKE</span>
      <span id="snake-score-display">SCORE: 0000</span>
    </div>
    <div class="snake-canvas-wrapper">
      <canvas id="snake-canvas"></canvas>
      <div id="snake-overlay" class="snake-overlay">
        <div class="overlay-content">
          <div id="overlay-title">SNAKE</div>
          <div id="overlay-message">Pressione ENTER para iniciar</div>
          <div id="overlay-score"></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Também adicionar `<script src="js/jogos.js"></script>` e `<script src="js/snake.js"></script>` antes do `</body>` (após os scripts existentes).

**Done when:**
- [ ] `#section-jogos` contém `#jogos-list-view` e `#jogos-game-view`
- [ ] `.game-card[data-game="snake"]` presente com estrutura correta
- [ ] `#snake-canvas`, `#snake-overlay`, `#btn-back-jogos`, `#snake-score-display` no DOM
- [ ] Tags `<script>` para `jogos.js` e `snake.js` adicionadas ao final do body

**Tests:** none
**Gate:** manual — inspecionar DOM no browser

**Commit:** `feat(jogos): add games section markup with Snake card and game view`

---

### T2: Adicionar CSS de Jogos ao style.css [P]

**What:** Adicionar todos os estilos necessários para a seção Jogos: snake-cover art, game-header, game-view layout, canvas wrapper, overlay, botão voltar
**Where:** `css/style.css` — append ao final
**Depends on:** T1
**Requirement:** JOG-02, JOG-03, JOG-05, JOG-14

**Estilos obrigatórios:**

```css
/* ===== JOGOS ===== */

/* game-view oculto por padrão */
#jogos-game-view { display: none; flex-direction: column; }
#jogos-game-view.active { display: flex; }

/* Capa CSS do Snake */
.snake-cover {
  background: #050a05;
  display: flex;
  align-items: center;
  justify-content: center;
}
.snake-cover-art {
  display: flex;
  gap: 6px;
}
.snake-cover-art span {
  font-size: 2.5rem;
  color: #00FF41;
  text-shadow: 0 0 12px #00FF41, 0 0 24px rgba(0,255,65,0.5);
  animation: snake-letter-pulse 2s ease-in-out infinite;
  /* cada span com animation-delay diferente via nth-child */
}
.snake-cover-art span:nth-child(1) { animation-delay: 0s; }
.snake-cover-art span:nth-child(2) { animation-delay: 0.2s; }
.snake-cover-art span:nth-child(3) { animation-delay: 0.4s; }
.snake-cover-art span:nth-child(4) { animation-delay: 0.6s; }
.snake-cover-art span:nth-child(5) { animation-delay: 0.8s; }

@keyframes snake-letter-pulse {
  0%, 100% { opacity: 1; text-shadow: 0 0 12px #00FF41; }
  50% { opacity: 0.4; text-shadow: none; }
}

/* game-card clicável (sem <a>, usa div) */
.game-card { cursor: pointer; }

/* Header do jogo ativo */
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-green-dim);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
#btn-back-jogos {
  background: transparent;
  border: 1px solid var(--color-green-dim);
  color: var(--color-green);
  font-family: var(--font-main);
  font-size: 1.3rem;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, text-shadow 0.2s;
}
#btn-back-jogos:hover {
  border-color: var(--color-green);
  text-shadow: 0 0 8px var(--color-green);
}
.game-title-active {
  font-size: 1.8rem;
  text-shadow: 0 0 10px var(--color-green);
  letter-spacing: 4px;
}
#snake-score-display {
  font-size: 1.4rem;
  opacity: 0.8;
  letter-spacing: 2px;
}

/* Canvas wrapper */
.snake-canvas-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}
#snake-canvas {
  display: block;
  border: 1px solid var(--color-green-dim);
  box-shadow: 0 0 20px rgba(0,255,65,0.1);
}

/* Overlay de início / game over */
.snake-overlay {
  position: absolute;
  inset: 0;
  background: rgba(5, 10, 5, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.snake-overlay.hidden { display: none; }
.overlay-content { display: flex; flex-direction: column; gap: 1rem; }
#overlay-title {
  font-size: 3rem;
  text-shadow: 0 0 16px var(--color-green);
  letter-spacing: 6px;
}
#overlay-message {
  font-size: 1.4rem;
  opacity: 0.8;
}
#overlay-score {
  font-size: 1.8rem;
  color: var(--color-white-char);
  text-shadow: 0 0 10px var(--color-green);
}
```

**Done when:**
- [ ] Estilos adicionados ao final de `css/style.css`
- [ ] `.snake-cover-art` com animação pulse visível no card
- [ ] `#jogos-game-view` com `display: none` por padrão
- [ ] Estilos do overlay, header e canvas presentes

**Tests:** none
**Gate:** manual — abrir browser, verificar capa animada e layout

**Commit:** `feat(jogos): add games section CSS with Snake cover art and game layout`

---

### T3: Criar js/snake.js — motor do jogo [P]

**What:** Motor completo do Snake: estado IDLE/RUNNING/GAME_OVER, game loop, renderização Matrix, controles de teclado, overlay de telas
**Where:** `js/snake.js` (arquivo novo)
**Depends on:** T1
**Requirement:** JOG-07, JOG-08, JOG-09, JOG-10, JOG-11, JOG-12, JOG-13, JOG-14

**Estrutura obrigatória:**
```javascript
const Snake = (function() {
  // Constantes
  const CELL = 20;
  const COLS = 20;
  const ROWS = 20;
  const TICK = 150; // ms

  // Estado
  let canvas, ctx, onScoreUpdate;
  let state = 'IDLE'; // IDLE | RUNNING | GAME_OVER
  let snake, dir, nextDir, food, score, intervalId;

  function init(canvasId, scoreCallback) { ... }
  function stop() { ... }
  function startGame() { ... }   // inicializa snake, food, score, começa loop
  function resetGame() { ... }   // chama startGame
  function tick() { ... }        // lógica principal: mover, colisão, comer
  function render() { ... }      // desenha fundo, grade sutil, cobra, comida
  function spawnFood() { ... }   // posição aleatória não ocupada pela cobra
  function showOverlay(title, message, scoreText) { ... }
  function hideOverlay() { ... }
  function handleKey(e) { ... }  // muda nextDir ou start/restart

  return { init, stop };
})();
```

**Lógica do tick():**
```javascript
function tick() {
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  dir = nextDir; // aplicar mudança de direção

  // Colisão com paredes
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    gameOver(); return;
  }
  // Colisão com corpo (ignorar cauda que será removida)
  if (snake.slice(0, -1).some(s => s.x === head.x && s.y === head.y)) {
    gameOver(); return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    onScoreUpdate(score);
    spawnFood();
    // não remove cauda — cobra cresce
  } else {
    snake.pop();
  }

  render();
}
```

**Renderização:**
```javascript
function render() {
  // Fundo
  ctx.fillStyle = '#050a05';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Corpo da cobra
  ctx.fillStyle = '#00FF41';
  snake.slice(1).forEach(s => ctx.fillRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2));

  // Cabeça (mais clara)
  ctx.fillStyle = '#CCFFCC';
  ctx.fillRect(snake[0].x*CELL+1, snake[0].y*CELL+1, CELL-2, CELL-2);

  // Comida (com glow)
  ctx.shadowColor = '#00FF41';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#CCFFCC';
  ctx.fillRect(food.x*CELL+2, food.y*CELL+2, CELL-4, CELL-4);
  ctx.shadowBlur = 0;
}
```

**handleKey():**
- Setas e WASD → mudam `nextDir` (não permitir direção oposta)
- Enter / Espaço → se IDLE ou GAME_OVER: `startGame()`
- `preventDefault()` para setas (evita scroll da página)

**stop():**
```javascript
function stop() {
  clearInterval(intervalId);
  document.removeEventListener('keydown', handleKey);
  state = 'IDLE';
  showOverlay('SNAKE', 'Pressione ENTER para iniciar', '');
}
```

**Done when:**
- [ ] Arquivo `js/snake.js` criado
- [ ] `window.Snake` exposto com métodos `init` e `stop`
- [ ] Estado IDLE/RUNNING/GAME_OVER funcionando
- [ ] Game loop com `setInterval(tick, 150)`
- [ ] Cobra se move, come comida, cresce
- [ ] Colisão com paredes e corpo → GAME_OVER
- [ ] Score incrementa e é passado via callback
- [ ] Controles setas + WASD funcionando
- [ ] Visual Matrix (fundo escuro, cobra verde, cabeça clara, comida com glow)
- [ ] Overlay de início e game over funcionando

**Tests:** none
**Gate:** manual — jogar uma partida completa

**Commit:** `feat(jogos): add Snake game engine with Matrix visual and full game loop`

---

### T4: Criar js/jogos.js — view manager

**What:** Script que gerencia a alternância entre list-view e game-view, conecta clique no card ao Snake e o botão Voltar
**Where:** `js/jogos.js` (arquivo novo)
**Depends on:** T2, T3
**Requirement:** JOG-04, JOG-05, JOG-06

**Estrutura:**
```javascript
(function() {
  const listView = document.getElementById('jogos-list-view');
  const gameView = document.getElementById('jogos-game-view');
  const btnBack = document.getElementById('btn-back-jogos');
  const scoreDisplay = document.getElementById('snake-score-display');

  function showGame(gameId) {
    listView.style.display = 'none';
    gameView.classList.add('active');
    if (gameId === 'snake') {
      Snake.init('snake-canvas', function(score) {
        scoreDisplay.textContent = 'SCORE: ' + String(score).padStart(4, '0');
      });
    }
  }

  function showList() {
    Snake.stop();
    gameView.classList.remove('active');
    listView.style.display = '';
    scoreDisplay.textContent = 'SCORE: 0000';
  }

  // Click nos cards de jogo
  document.querySelectorAll('.game-card').forEach(function(card) {
    card.addEventListener('click', function() {
      showGame(this.dataset.game);
    });
  });

  // Botão Voltar
  if (btnBack) btnBack.addEventListener('click', showList);
})();
```

**Done when:**
- [ ] Arquivo `js/jogos.js` criado
- [ ] Click no card Snake → `#jogos-list-view` some, `#jogos-game-view` aparece, Snake inicia
- [ ] Click em Voltar → Snake para, `#jogos-game-view` some, `#jogos-list-view` volta
- [ ] `SCORE: 0000` atualiza em tempo real durante o jogo
- [ ] Score reseta ao voltar

**Tests:** none
**Gate:** manual — testar fluxo completo: cards → jogo → voltar → cards

**Commit:** `feat(jogos): add jogos view manager connecting card clicks to Snake game`

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 (HTML markup)

Phase 2 (Parallel — independentes entre si):
  T1 completo, então:
    ├── T2 [P]  CSS de Jogos
    └── T3 [P]  js/snake.js

Phase 3 (Sequential):
  T2 + T3 → T4 (js/jogos.js — integra tudo)
```

---

## Task Granularity Check

| Task | Escopo | Status |
|---|---|---|
| T1: HTML markup | 1 arquivo, 1 seção | ✅ Granular |
| T2: CSS jogos | 1 arquivo, append | ✅ Granular |
| T3: js/snake.js | 1 componente JS autônomo | ✅ Granular |
| T4: js/jogos.js | 1 view manager JS | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagrama | Status |
|---|---|---|---|
| T1 | None | Início | ✅ |
| T2 | T1 | T1 → T2 [P] | ✅ |
| T3 | T1 | T1 → T3 [P] | ✅ |
| T4 | T2, T3 | T2+T3 → T4 | ✅ |

## Test Co-location Validation

| Task | Camada | Matrix Requer | Task Diz | Status |
|---|---|---|---|---|
| T1 | HTML | none | none | ✅ |
| T2 | CSS | none | none | ✅ |
| T3 | JS (game) | none | none | ✅ |
| T4 | JS (manager) | none | none | ✅ |
