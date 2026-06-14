# Jogos — Design

**Spec:** `.specs/features/jogos/spec.md`
**Status:** Draft

---

## Architecture Overview

A seção Jogos tem duas views internas controladas por `js/jogos.js`. O Snake em si é um módulo autônomo em `js/snake.js` com API pública (`init`, `stop`, `reset`).

```
#section-jogos
  ├── #jogos-list-view       ← visível por padrão
  │     └── .game-card       ← data-game="snake"
  └── #jogos-game-view       ← display:none por padrão
        ├── .game-header     ← [← Voltar] [SNAKE] [SCORE: 0000]
        └── #snake-canvas    ← canvas do jogo
              + #snake-overlay ← telas de início / game over
```

**Fluxo de abertura do jogo:**
```
click em .game-card[data-game="snake"]
  → jogos.js: hideListView() + showGameView()
  → snake.js: Snake.init('#snake-canvas', onScoreUpdate)
  → canvas renderiza tela de início

click em #btn-back-jogos
  → snake.js: Snake.stop()
  → jogos.js: hideGameView() + showListView()
```

**Fluxo do jogo Snake:**
```
Estado: IDLE → [Enter/Espaço] → RUNNING → [colisão] → GAME_OVER → [Enter/Espaço] → RUNNING
```

---

## Estrutura de Arquivos

```
index.html          ← adicionar markup da seção Jogos
css/style.css       ← adicionar estilos: game-view, snake-cover, game-header, overlay
js/jogos.js         ← view manager: list ↔ game, conecta card click ao Snake
js/snake.js         ← motor do jogo Snake (autônomo, API pública)
```

---

## Components

### Markup HTML — `#section-jogos`

```html
<section id="section-jogos" class="section">

  <!-- View: Lista de jogos -->
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

  <!-- View: Jogo ativo -->
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

---

### `js/jogos.js` — View Manager

- **Purpose:** Controla alternância entre list-view e game-view; inicializa/para o Snake
- **Location:** `js/jogos.js`
- **API:**
  - Executa ao carregar o DOM
  - `showGame(gameId)` — oculta list-view, exibe game-view, inicia jogo
  - `showList()` — para jogo, oculta game-view, exibe list-view
- **Event listeners:**
  - `.game-card[data-game]` click → `showGame(dataset.game)`
  - `#btn-back-jogos` click → `showList()`
- **Integração com Snake:** chama `Snake.init(canvas, scoreCallback)` e `Snake.stop()`

---

### `js/snake.js` — Motor do Snake

- **Purpose:** Jogo Snake completo e autônomo
- **Location:** `js/snake.js`
- **API pública (objeto global `Snake`):**
  - `Snake.init(canvasId, onScore)` — configura canvas, event listeners, renderiza tela de início
  - `Snake.stop()` — para o game loop, remove event listeners, limpa estado
- **Estado interno:** `IDLE | RUNNING | GAME_OVER`
- **Constantes:**
  - Grid: 20x20 células, célula = 20px → canvas 400x400
  - Velocidade: 150ms por tick (setInterval)
- **Lógica do game loop (a cada tick):**
  1. Calcular nova posição da cabeça com base na direção atual
  2. Verificar colisão com paredes ou com o próprio corpo → GAME_OVER
  3. Verificar se comeu comida → score++, spawnar nova comida, NÃO remover cauda
  4. Caso contrário → remover última célula da cauda (movimento normal)
  5. Renderizar canvas
- **Renderização:**
  - Fundo: `#050a05` (fill canvas inteiro)
  - Grid lines sutis: `rgba(0,255,65,0.05)` (opcional)
  - Cobra corpo: `#00FF41` — rect por célula com 1px de gap (estilo pixel)
  - Cobra cabeça: `#CCFFCC` — levemente mais clara
  - Comida: `#CCFFCC` com `shadowBlur` glow
- **Overlay (telas):**
  - IDLE: título "SNAKE" + "Pressione ENTER para iniciar"
  - GAME_OVER: "GAME OVER" + "SCORE: XXXX" + "Pressione ENTER para reiniciar"
  - RUNNING: overlay oculto
- **Controles:** `keydown` — setas + WASD, previne scroll da página durante o jogo

---

## CSS — novos estilos necessários

### `.snake-cover` / `.snake-cover-art`
Capa do card do Snake em CSS puro:
- Fundo `#050a05`
- `.snake-cover-art`: letras "SNAKE" dispostas diagonalmente ou centralizadas com glow verde, font-size grande, efeito Matrix

### `#jogos-game-view`
- `display: none` por padrão
- Quando ativo: display flex, flex-direction column, height 100%

### `.game-header`
- Display flex, space-between, align-center
- Border-bottom verde dim, padding-bottom 1rem, margin-bottom 1.5rem

### `#btn-back-jogos`
- Estilo terminal: sem background sólido, border verde, cor verde, hover glow

### `.snake-canvas-wrapper`
- position relative (para o overlay absoluto funcionar)
- display flex, justify-content center

### `#snake-canvas`
- border `1px solid var(--color-green-dim)`
- display block

### `.snake-overlay`
- Position absolute, inset 0, background `rgba(5,10,5,0.85)`
- Display flex, align/justify center
- Font VT323, cor verde, text-align center
- `.overlay-content`: gap entre elementos

---

## Error Handling

| Cenário | Handling |
|---|---|
| Canvas não suportado | Exibir mensagem "Canvas não suportado neste browser" |
| Usuário navega para outra seção com jogo ativo | `navigation.js` já chama showSection — adicionar hook para parar Snake |

---

## Tech Decisions

| Decisão | Escolha | Rationale |
|---|---|---|
| Canvas size | 400x400 fixo (20×20 células de 20px) | Simples, sem responsividade complexa |
| Game loop | `setInterval` a 150ms | Suficiente para Snake, mais simples que rAF com delta time |
| Snake state machine | IDLE / RUNNING / GAME_OVER | Evita condicionais espalhados |
| Overlay | HTML div absoluta sobre canvas | Mais fácil de estilizar com VT323 do que `ctx.fillText` |
| Capa do card | CSS puro (sem imagem) | Sem dependência de asset externo |
| API pública do Snake | Objeto global `window.Snake` | Acesso simples do jogos.js sem import/export |
