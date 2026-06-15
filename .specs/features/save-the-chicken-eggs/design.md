# Save the Chicken Eggs — Design

**Spec:** `.specs/features/save-the-chicken-eggs/spec.md`
**Status:** Approved

---

## Architecture Overview

O port reusa o padrão de jogos da seção (módulo IIFE + view-manager). O
view-manager (`jogos.js`) é **generalizado** para suportar múltiplos jogos via
registry, e o game-view passa a usar IDs genéricos compartilhados.

```
#section-jogos
  ├── #jogos-list-view
  │     ├── .game-card[data-game="snake"]
  │     └── .game-card[data-game="eggs"]   ← NOVO (capa cartoon)
  └── #jogos-game-view                      ← genérico (compartilhado)
        ├── .game-header  [< Voltar] [TÍTULO dinâmico] [SCORE/PONTOS]
        └── #game-canvas + #game-overlay (#overlay-title/message/score)
```

**Fluxo (registry):**
```
click .game-card[data-game=X]
  → jogos.js: showGame(X)
      → games[X].module.init('game-canvas', onScore)
      → seta .game-title-active = games[X].title
click #btn-back-jogos
  → jogos.js: activeModule.stop(); showList()
```

---

## Estrutura de Arquivos

```
index.html             ← IDs genéricos no game-view + 2º card + <script chicken-eggs.js>
css/style.css          ← seletores genéricos (#game-canvas...) + capa cartoon + HUD eggs
js/jogos.js            ← view-manager com registry { snake, eggs }
js/snake.js            ← IDs genéricos (game-overlay/game-canvas/game-score-display)
js/chicken-eggs.js     ← NOVO: jogo portado (lógica pura + render cartoon)
```

---

## Port Python → JS (chicken-eggs.js)

Módulo IIFE `ChickenEggs` expondo `{ init(canvasId, onScore), stop() }`.

| Original | JS |
|---|---|
| `GameConstants` | `const C = { worldWidth:1420, worldHeight:500, gravity:980, eggRadius:18, pillowWidth:176, pillowHeight:42, pillowY:388, waterSurfaceY:444, portalStripWidth:108, maxLevel:10, ... }` |
| `RoundStatus` | strings `'WAITING_START'|'PLAYING'|'WON'|'LOST'` |
| `Egg`/`Pillow`/`GameState` | objetos literais `{x,y,vx,vy,uid}` etc. |
| `step_egg` + bounces | `stepEgg`, `resolveCeilingBounce`, `resolveLeftWallBounce` |
| `circle_aabb_normal_and_penetration` + `reflect_velocity` | `circleAabb`, `reflectVelocity`, `resolvePillowCollision` |
| `pillow_center_x_from_*` | `pillowFromMouse`, `pillowFromKeyboard`, `clampPillow` |
| `advance_state` | `advanceState` (substeps=4, spawn em fila por `eggLaunchInterval`, score portal/direita, água=LOST, fase++/WON) |
| `main` loop (`clock.tick(60)`) | `requestAnimationFrame` com `dt` clampado (ex.: máx 1/30s) |
| `high_score.py` | `localStorage['stc-eggs-highscore']` |

**Estado do módulo:** `state` (GameState), `pillowCenterX`, `lastMouseX`,
`keyLeft/keyRight`, `eggSquash` (Map uid→{s,v} p/ animação), `rafId`,
`highScore`, `winTimer`.

**Loop:** acumula `dt`, chama `advanceState`, atualiza squash, `render()`,
agenda próximo frame. Para via `stop()` (cancelAnimationFrame + remove listeners).

---

## Controles

| Input | Ação |
|---|---|
| `mousemove` sobre canvas | mapeia clientX→worldX; move almofada (só se cursor moveu) |
| setas ←/→ (keydown/keyup) | move almofada por velocidade; tem prioridade sobre mouse |
| ENTER / clique (em WAITING_START/LOST/WON) | inicia/recomeça |
| `R` | volta para fase 1 |

`stop()` remove todos os listeners (mousemove no canvas, keydown/keyup no document).

---

## Escala / Responsividade

Canvas backing store = mundo (1420×500). CSS: `#game-canvas { width:100%; max-width:100%; height:auto; aspect-ratio:1420/500 }`. Mapeamento de mouse usa `getBoundingClientRect` para converter px de tela → coords do mundo.

---

## Direção de Arte (Cartoon)

| Elemento | Render |
|---|---|
| Céu | gradiente vertical azul→turquesa |
| Nuvens | grupos de círculos brancos com leve bob (sin) |
| Água (perigo) | faixa inferior azul com ondinha senoidal |
| Galinheiro (esq.) | morrinho verde + galinha cartoon (corpo, crista, bico, asa batendo) |
| Ovos | elipse creme com brilho + leve rostinho/blush; squash ao quicar (s<1 → achata) |
| Almofada | retângulo arredondado listrado, "afunda" no frame de impacto |
| Portal (dir.) | faixa com espiral colorida girando (hsv rotativo) |
| HUD | fonte arredondada sans (não VT323); score central grande + fase + recorde |
| Overlays | início ("clique/ENTER para começar") e vitória ("VOCÊ ZEROU!") |

Contornos: `lineWidth` grosso + `lineJoin:'round'`. Sombras: `shadowBlur` suave.

---

## Tech Decisions

| Decisão | Escolha | Rationale |
|---|---|---|
| Loop | requestAnimationFrame + dt clampado | suave, padrão web (original usa 60fps fixo) |
| Coordenadas | mundo 1420×500, CSS escala | preserva física em unidades originais |
| Estado | espelhar GameState imutável do original | port fiel, menos bugs |
| view-manager | registry genérico | arquitetura correta p/ coleção de jogos (visão M3) |
| IDs do game-view | genéricos compartilhados | evita duplicar overlay/header por jogo |
| High score | localStorage | sem backend (original usa arquivo) |
| Visual | cartoon próprio | decisão do usuário (≠ Matrix, ≠ original) |

---

## Error Handling

| Cenário | Handling |
|---|---|
| Canvas não suportado | early-return em init (sem crash) |
| localStorage indisponível | try/catch; recorde vira sessão-only |
| dt grande (aba em background) | clamp de dt para evitar "tunneling" do ovo |
| Sair da seção com jogo ativo | botão Voltar chama stop(); navegação fora também deve parar |
