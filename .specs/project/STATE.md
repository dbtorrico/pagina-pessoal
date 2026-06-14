# STATE — Torrico · Página Pessoal

_Atualizado: 2026-06-14_

---

## Status Geral

**Site publicado:** https://dbtorrico.github.io/pagina-pessoal/
**Branch principal:** `master`
**GitHub Pages:** ativo, branch `master`, raiz `/`

---

## Milestones

| Milestone | Features | Status |
|---|---|---|
| M1 — Layout Matrix | Layout base, counter, deploy | ✅ Completo |
| M2 — Poko Loko Lab | Grid de cards musicais/audiovisuais | ✅ Completo |
| M3 — Jogos | Cards de jogos + Snake inline | ✅ Completo |
| M3 — Jogos (Chicken Eggs) | Port do jogo pygame em estilo cartoon | ✅ Completo (`feat/jogo-chicken-eggs`) |
| M4 — Currículo | Timeline profissional + grid de skills | ✅ Completo |

---

## Decisões Registradas

**2026-06-14 — Port do jogo Save the Chicken Eggs**
- Origem: repo `dbtorrico/save-the-chicken-eggs` (pygame). Lógica é 100% funções puras → port quase 1:1 para JS; só o render é reescrito.
- Visual: estilo CARTOON próprio (decisão do usuário) — nem Matrix do site, nem o visual original do pygame.
- Escopo: Core completo (10 fases, mouse+setas, portal/água, vitória, recorde localStorage). Fora: pausa, momentum toggle, level-select, overlay gigante, touch.
- view-manager (`jogos.js`) generalizado para registry multi-jogo; IDs do game-view passam a ser genéricos (`#game-canvas`, `#game-overlay`, `#game-score-display`).
- Branch: `feat/jogo-chicken-eggs`.


**2026-06-14 — Removida animação Matrix rain**
- Decisão: substituída por fundo preto estático com textura tileada de pontos
- Razão: usuário optou por estilo anos 2000 em vez do efeito animado
- O arquivo `js/matrix-rain.js` existe mas retorna imediatamente (código preservado)

**2026-06-14 — Tema anos 2000 aplicado**
- Scanlines CRT via CSS (`body::after`)
- Fundo com `radial-gradient` de pontos verdes sutis (24x24px)
- Bordas `inset`/`outset` estilo Win98 nos cards e sidebar
- Cursor piscando `TORRICO_` no sidebar
- Status ticker `<marquee>` fixo no rodapé
- Contador de visitantes estilo LED âmbar (`#ff8c00`)
- Separadores `════════` e `─ ─ ─ ─` nos títulos

**2026-06-14 — CountAPI como contador de visitantes**
- Endpoint: `https://api.countapi.xyz/hit/dbtorrico/pagina-pessoal`
- Fallback: `[VISITORS: ----]` em caso de falha ou timeout de 5s

---

## Conteúdo Placeholder (para preencher depois)

- **Currículo:** anos, empresas e descrições são genéricos — preencher com dados reais
- **Poko Loko Lab:** 2 projetos reais (Fogo, Faz Academia) — adicionar mais conforme necessário
- **Jogos:** apenas Snake — adicionar novos jogos como cards futuros

---

## Ideias Futuras (do Roadmap)

- Efeito Matrix rain mais elaborado com chars japoneses (canvas, opt-in)
- Modo "scan lines" CRT ainda mais intenso
- Easter egg com código Konami
- Página individual por jogo com leaderboard
- Player de música embutido no Poko Loko Lab
- Internacionalização PT/EN

---

## Preferências de Trabalho

- Usar `/tlc-spec-driven` para continuar sessões
- Conteúdo real do Currículo a ser fornecido pelo usuário quando disponível
