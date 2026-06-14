# Save the Chicken Eggs — Specification

## Problem Statement

A seção Jogos só tem o Snake. O Torrico já começou um jogo 2D em pygame
(repo `save-the-chicken-eggs`) e quer trazê-lo para a página pessoal como
segundo jogo jogável inline. O jogo deve ser **portado para JavaScript/Canvas**
e re-skinado num **estilo cartoon** (diferente do tema Matrix do site e também
do visual original do pygame).

## Scope: Large — port completo de lógica + nova camada de render + refactor do view-manager

## Premissa de Origem

A lógica do jogo original é 100% funções puras sem dependência de pygame
(`types.py`, `physics.py`, `collision.py`, `input_model.py`, `rules.py`).
Apenas `main.py` usa pygame. O port traduz a lógica quase 1:1 para JS e
reescreve só o render.

## Conceito do Jogo

Uma galinha lança ovos em arco a partir da esquerda. O jogador move uma almofada
(mouse ou setas ←/→) para rebater os ovos, impedindo que toquem a água (perde) e
guiando-os até o portal dimensional na borda direita — ou para fora pela direita
(1 ponto por ovo). Cada fase N tem N ovos no mesmo arco. Zerar as 10 fases = vitória.

## Acceptance Criteria

1. WHEN a seção Jogos é exibida THEN SHALL mostrar 2 cards: Snake e Save the Chicken Eggs
2. WHEN o usuário clica no card de ovos THEN SHALL abrir o game-view com o jogo carregado
3. WHEN o jogo está ativo THEN ovos SHALL cair em arco com gravidade e quicar na almofada
4. WHEN o usuário move o mouse sobre o canvas OU pressiona setas ←/→ THEN a almofada SHALL acompanhar
5. WHEN um ovo entra no portal (faixa direita) ou sai pela borda direita THEN SHALL marcar +1 ponto
6. WHEN um ovo toca a água THEN o jogo SHALL ser perdido e resetar para a fase 1 (mantendo a almofada)
7. WHEN todos os ovos de uma fase são salvos THEN SHALL avançar para a próxima fase
8. WHEN a fase 10 é zerada THEN SHALL exibir tela de vitória e reiniciar automaticamente
9. WHEN o jogador faz um novo recorde THEN SHALL persistir via localStorage
10. WHEN o usuário clica em Voltar THEN o jogo SHALL parar (stop) e voltar à lista
11. WHEN o Snake é aberto após o refactor THEN SHALL continuar funcionando 100% (regressão)
12. O visual SHALL ser cartoon (cores vivas, contornos marcados, squash dos ovos ao quicar)

## Requirement IDs

| ID | Critério |
|---|---|
| EGG-01 | Lista com 2 cards (Snake + ovos) |
| EGG-02 | Card de ovos abre o game-view genérico |
| EGG-03 | Física: arco + gravidade + quique (teto, parede esquerda, almofada) |
| EGG-04 | Controle da almofada por mouse e setas |
| EGG-05 | Pontuação no portal / saída pela direita |
| EGG-06 | Perder ao tocar a água; reset p/ fase 1 |
| EGG-07 | Progressão de fases 1→10 (fase N = N ovos) |
| EGG-08 | Tela de vitória + auto-restart |
| EGG-09 | Recorde via localStorage |
| EGG-10 | Botão Voltar para o jogo ativo (stop) |
| EGG-11 | Snake intacto após generalização do view-manager |
| EGG-12 | Render cartoon (cenário, galinha, ovos com squash, almofada, portal, HUD) |

## Fora do Core (melhorias futuras)

- Pausa (P), toggle de impulso da almofada (T), seleção de fase (1-9/0)
- Overlay gigante "ZEROUU PARABEINS"
- Controles touch para mobile
