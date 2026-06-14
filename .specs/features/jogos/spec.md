# Jogos — Specification

## Problem Statement

A seção Jogos precisa exibir uma lista de jogos em cards e permitir jogar o Snake diretamente na página, substituindo a view de cards pelo jogo ao clicar no card.

## Goals

- [ ] Exibir lista de jogos em cards (mesmo padrão visual do Poko Loko Lab)
- [ ] Snake jogável inline com visual Matrix
- [ ] Navegação fluida entre lista de cards e o jogo (view B: substitui seção)

## Out of Scope

| Feature | Reason |
|---|---|
| Leaderboard persistente | Requer backend — fora de escopo v1 |
| Múltiplos jogos além do Snake | V1 só tem Snake |
| Som/áudio no jogo | Fora de escopo |
| Mobile touch controls | Nice-to-have — não bloqueia MVP |

---

## User Stories

### P1: Lista de jogos em cards ⭐ MVP

**User Story:** Como visitante, quero ver os jogos disponíveis em cards com título, descrição e capa para saber o que posso jogar.

**Acceptance Criteria:**

1. WHEN a seção Jogos é exibida THEN SHALL mostrar `#jogos-list-view` com grid de cards
2. WHEN um card de jogo é exibido THEN SHALL conter: imagem de capa (CSS), título, descrição, badge `JOGO`
3. WHEN o cursor passa sobre um card THEN SHALL exibir hover Matrix (borda + glow)

**Independent Test:** Navegar para Jogos e ver o card do Snake com visual correto.

---

### P1: Abrir jogo ao clicar no card ⭐ MVP

**User Story:** Como visitante, quero clicar no card e ver o jogo aparecer no lugar da lista para jogar sem sair da página.

**Acceptance Criteria:**

1. WHEN o usuário clica no card Snake THEN `#jogos-list-view` SHALL ser ocultado e `#jogos-game-view` SHALL ser exibido
2. WHEN `#jogos-game-view` é exibido THEN SHALL mostrar: botão "← Voltar", título do jogo ativo, score e o canvas do Snake
3. WHEN o usuário clica em "← Voltar" THEN `#jogos-game-view` SHALL ser ocultado, `#jogos-list-view` SHALL ser exibido e o jogo SHALL ser parado/resetado

**Independent Test:** Clicar no card → jogo aparece. Clicar voltar → lista reaparece.

---

### P1: Snake jogável ⭐ MVP

**User Story:** Como visitante, quero jogar Snake com visual Matrix (preto e verde) usando teclado.

**Acceptance Criteria:**

1. WHEN o jogo Snake é exibido THEN SHALL mostrar tela de início com instrução para pressionar Enter/Espaço
2. WHEN o usuário pressiona Enter ou Espaço THEN o jogo SHALL iniciar com cobra se movendo
3. WHEN o usuário pressiona ←→↑↓ ou WASD THEN a cobra SHALL mudar de direção correspondente
4. WHEN a cobra come a comida THEN o score SHALL incrementar e nova comida SHALL aparecer em posição aleatória
5. WHEN a cobra colide com a parede ou com ela mesma THEN o jogo SHALL parar e exibir tela de Game Over com score final
6. WHEN o usuário pressiona Enter/Espaço na tela de Game Over THEN o jogo SHALL reiniciar do zero
7. WHEN o jogo está ativo THEN o score SHALL ser exibido em tempo real no formato `SCORE: 0042`
8. WHEN o canvas é exibido THEN a cobra, comida e fundo SHALL usar a paleta Matrix (`#050a05`, `#00FF41`, `#CCFFCC`)

**Independent Test:** Jogar uma partida completa do início ao game over e reiniciar.

---

## Requirement Traceability

| Requirement ID | Story | Status |
|---|---|---|
| JOG-01 | P1: Lista de cards visível | Pending |
| JOG-02 | P1: Card com capa, título, descrição, badge | Pending |
| JOG-03 | P1: Hover Matrix no card | Pending |
| JOG-04 | P1: Click abre game-view, fecha list-view | Pending |
| JOG-05 | P1: Game-view com header (voltar, título, score) | Pending |
| JOG-06 | P1: Voltar reseta e esconde jogo | Pending |
| JOG-07 | P1: Tela de início com instrução | Pending |
| JOG-08 | P1: Enter/Espaço inicia o jogo | Pending |
| JOG-09 | P1: Controles ←→↑↓ e WASD | Pending |
| JOG-10 | P1: Cobra come comida → score++ + nova comida | Pending |
| JOG-11 | P1: Colisão → Game Over com score | Pending |
| JOG-12 | P1: Enter/Espaço no Game Over → restart | Pending |
| JOG-13 | P1: Score em tempo real `SCORE: 0042` | Pending |
| JOG-14 | P1: Visual Matrix no canvas | Pending |

## Success Criteria

- [ ] Card do Snake visível ao entrar na seção Jogos
- [ ] Clicar no card substitui a view pelo jogo
- [ ] Partida completa jogável do início ao Game Over
- [ ] Botão Voltar restaura a lista de cards
- [ ] Visual 100% Matrix em todo o jogo
