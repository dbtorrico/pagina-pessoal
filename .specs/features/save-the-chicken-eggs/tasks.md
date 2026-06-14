# Save the Chicken Eggs — Tasks

**Design:** `.specs/features/save-the-chicken-eggs/design.md`
**Status:** Approved

---

## Execution Plan

```
T1 (refactor view-manager) ──► T2 (port lógica) ──► T3 (render cartoon)
                                                          │
                                   T4 (card + capa) ──────┤
                                                          ▼
                                                   T5 (polish + verify)
```

---

## T1: Generalizar view-manager (multi-jogo)

**What:** Tornar o game-view genérico e transformar jogos.js em registry, mantendo o Snake intacto.
**Where:** `index.html`, `js/snake.js`, `js/jogos.js`, `css/style.css`
**Depends on:** None
**Requirement:** EGG-02, EGG-10, EGG-11

**Done when:**
- [ ] IDs genéricos: `#game-canvas`, `#game-overlay`, `#game-score-display`
- [ ] `snake.js` usa os IDs genéricos; lógica inalterada
- [ ] `jogos.js` é um registry `{ snake:{module,title,scoreLabel}, ... }`
- [ ] CSS atualizado para os seletores genéricos
- [ ] Snake abre, joga, game-over e volta — sem regressão

**Commit:** `refactor(jogos): generalize game-view for multiple games`

---

## T2: Portar lógica do jogo

**What:** `js/chicken-eggs.js` com constantes, física, colisão, input e advanceState (render placeholder).
**Where:** `js/chicken-eggs.js`
**Depends on:** T1
**Requirement:** EGG-03, EGG-04, EGG-05, EGG-06, EGG-07

**Done when:**
- [ ] `ChickenEggs` IIFE expõe `init`, `stop`
- [ ] Física espelha o original (gravidade, quiques, colisão almofada)
- [ ] advanceState: substeps, spawn em fila, score, água=LOST, fase++/WON
- [ ] Mouse + setas movem a almofada
- [ ] Loop rAF com dt clampado; render placeholder mostra ovos/almofada

**Commit:** `feat(eggs): port game logic to JS (physics, collision, rules)`

---

## T3: Render cartoon

**What:** Reescrever `render()` com a direção de arte cartoon + overlays.
**Where:** `js/chicken-eggs.js`, `css/style.css`
**Depends on:** T2
**Requirement:** EGG-08, EGG-12

**Done when:**
- [ ] Cenário (céu, nuvens, água, galinheiro, galinha, portal)
- [ ] Ovos cartoon com squash; almofada com afundar
- [ ] HUD (score central, fase, recorde)
- [ ] Overlays de início e vitória

**Commit:** `feat(eggs): cartoon rendering and overlays`

---

## T4: Card + capa cartoon

**What:** 2º card na lista com thumbnail cartoon (ovo + portal) em CSS.
**Where:** `index.html`, `css/style.css`
**Depends on:** T1
**Requirement:** EGG-01

**Done when:**
- [ ] `.game-card[data-game="eggs"]` na grade
- [ ] Capa cartoon (CSS, sem asset externo)
- [ ] Badge/título/descrição/hint coerentes

**Commit:** `feat(eggs): add games-list card with cartoon cover`

---

## T5: Polish + verificação

**What:** localStorage, escala responsiva, auto-restart de vitória, verificação E2E.
**Where:** `js/chicken-eggs.js`, `css/style.css`
**Depends on:** T3, T4
**Requirement:** EGG-08, EGG-09

**Done when:**
- [ ] Recorde persiste via localStorage (reload mantém)
- [ ] Canvas escala dentro da área de conteúdo (desktop + mobile)
- [ ] Vitória → overlay → auto-restart
- [ ] Verificação E2E completa (incl. regressão do Snake)

**Commit:** `feat(eggs): localStorage high score, responsive scaling, win flow`

---

## Test Co-location

Projeto vanilla sem testes automatizados — gate manual via preview (porta 8765),
seguindo a convenção do `pagina-pessoal`.
