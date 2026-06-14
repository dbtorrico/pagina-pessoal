# Layout Matrix — Specification

## Problem Statement

O site atual é uma página estática sem identidade visual. Precisamos construir do zero a estrutura base com tema Matrix (preto + verde neon), menu lateral fixo e navegação entre as 3 seções principais. Esta é a fundação sobre a qual todas as demais features serão construídas.

## Goals

- [ ] Estabelecer identidade visual Matrix consistente em todo o site
- [ ] Menu lateral fixo com navegação funcional entre seções (Poko Loko Lab, Jogos, Currículo)
- [ ] Contador de visitantes real e visível
- [ ] Site publicado e acessível via GitHub Pages

## Out of Scope

| Feature | Reason |
|---|---|
| Conteúdo real das seções | Cada seção é uma feature separada (M2, M3, M4) |
| CMS ou painel de admin | Fora de escopo do projeto |
| Analytics avançado | Contador simples é suficiente por ora |
| Animação Matrix rain elaborada | P3 — não bloqueia o MVP |
| Backend próprio | Hosting estático (GitHub Pages) |

---

## User Stories

### P1: Visual Matrix Base ⭐ MVP

**User Story:** Como visitante, quero ver um site com visual marcante estilo Matrix (preto e verde neon) para sentir que é um espaço autoral e diferenciado.

**Why P1:** É a identidade central do projeto — sem isso, nada mais faz sentido.

**Acceptance Criteria:**

1. WHEN a página carrega THEN o fundo SHALL ser preto (#0D0D0D ou #000000)
2. WHEN qualquer texto principal é exibido THEN a cor SHALL ser verde neon (#00FF41 ou equivalente)
3. WHEN qualquer elemento de destaque (títulos, bordas, ícones) é exibido THEN SHALL usar a paleta verde neon
4. WHEN qualquer fonte é renderizada THEN SHALL ser monospace (estilo terminal)
5. WHEN o cursor passa sobre links interativos THEN SHALL exibir efeito de hover estilo terminal (ex: cor muda, sublinhado, ou prefixo `>`)

**Independent Test:** Abrir `index.html` no browser — fundo preto, texto verde, fonte monospace visíveis sem precisar navegar.

---

### P1: Menu Lateral Fixo ⭐ MVP

**User Story:** Como visitante, quero um menu lateral fixo com as seções do site para navegar entre elas sem perder o contexto visual.

**Why P1:** É a estrutura de navegação — sem menu, o site é inacessível.

**Acceptance Criteria:**

1. WHEN a página carrega THEN o menu lateral SHALL estar visível à esquerda com as opções: `Poko Loko Lab`, `Jogos`, `Currículo`
2. WHEN o usuário clica em um item do menu THEN o sistema SHALL exibir o conteúdo da seção correspondente na área principal (sem recarregar a página)
3. WHEN uma seção está ativa THEN o item de menu correspondente SHALL ter destaque visual diferenciado (ex: `> Jogos` ou cor mais brilhante)
4. WHEN o usuário rola a página THEN o menu lateral SHALL permanecer fixo na tela (não rolar junto)
5. WHEN o menu é exibido THEN SHALL conter o nome/logo do site no topo (ex: `TORRICO.DEV` ou similar)

**Independent Test:** Clicar em cada item do menu e confirmar que a área de conteúdo muda e o item ativo fica destacado.

---

### P1: Contador de Visitantes ⭐ MVP

**User Story:** Como Torrico, quero ver quantas pessoas visitaram meu site para ter senso de alcance.

**Why P1:** Feature simples com impacto visual Matrix ("quantos hackers passaram por aqui").

**Acceptance Criteria:**

1. WHEN a página carrega THEN o sistema SHALL incrementar o contador via CountAPI
2. WHEN o contador é carregado THEN SHALL exibir o número formatado estilo terminal (ex: `[VISITORS: 0042]`)
3. WHEN a API CountAPI estiver indisponível THEN o sistema SHALL exibir `[VISITORS: ---]` sem quebrar a página
4. WHEN o contador é exibido THEN SHALL estar posicionado no rodapé ou cabeçalho do menu lateral

**Independent Test:** Abrir a página, recarregar, confirmar que o número aumenta e é exibido no formato correto.

---

### P1: Deploy GitHub Pages ⭐ MVP

**User Story:** Como Torrico, quero o site publicado em URL pública para compartilhar com pessoas.

**Why P1:** Sem deploy, o site só existe localmente.

**Acceptance Criteria:**

1. WHEN o repositório tem GitHub Pages ativado THEN o site SHALL ser acessível em `https://dbtorrico.github.io/pagina-pessoal`
2. WHEN qualquer asset (fontes, imagens, JS, CSS) é referenciado THEN SHALL carregar corretamente no domínio do GitHub Pages (paths relativos corretos)
3. WHEN o site é acessado via mobile THEN o layout SHALL ser utilizável (menu acessível, conteúdo legível)

**Independent Test:** Acessar a URL do GitHub Pages em browser desktop e mobile e confirmar que tudo carrega.

---

### P2: Efeito Matrix Rain (Background)

**User Story:** Como visitante, quero ver a animação de chuva de caracteres do Matrix no fundo para imersão total no visual.

**Why P2:** Eleva muito a experiência visual, mas não bloqueia o MVP. Pode ser adicionado depois sem impacto na estrutura.

**Acceptance Criteria:**

1. WHEN a página carrega THEN um canvas SHALL renderizar colunas de caracteres caindo em verde sobre fundo preto
2. WHEN o efeito está ativo THEN o conteúdo principal SHALL permanecer legível (efeito no background, conteúdo à frente)
3. WHEN o usuário prefere movimento reduzido (`prefers-reduced-motion`) THEN o efeito SHALL ser desativado automaticamente

**Independent Test:** Abrir a página e ver a animação de chuva visível atrás do conteúdo sem prejudicar leitura.

---

### P3: Easter Egg — Código Konami

**User Story:** Como visitante curioso, quero descobrir um easter egg secreto para ter uma experiência surpresa.

**Why P3:** Nice-to-have, sem impacto funcional.

**Acceptance Criteria:**

1. WHEN o usuário digita a sequência Konami (↑↑↓↓←→←→BA) THEN o sistema SHALL exibir alguma reação surpresa temática Matrix

**Independent Test:** Digitar a sequência e ver a reação.

---

## Edge Cases

- WHEN CountAPI retorna erro (timeout, 429, 5xx) THEN o contador SHALL exibir `[VISITORS: ---]` sem bloquear o resto da página
- WHEN o site é acessado em tela estreita (< 480px) THEN o menu lateral SHALL colapsar ou se tornar acessível via botão/ícone
- WHEN JavaScript está desabilitado THEN o conteúdo da primeira seção SHALL ser visível por padrão (sem depender de JS para renderizar conteúdo inicial)
- WHEN fontes customizadas falham ao carregar THEN o fallback SHALL ser `monospace` do sistema

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---|---|---|---|
| LAY-01 | P1: Visual Matrix — fundo preto | Design | Pending |
| LAY-02 | P1: Visual Matrix — texto verde neon | Design | Pending |
| LAY-03 | P1: Visual Matrix — fonte monospace | Design | Pending |
| LAY-04 | P1: Visual Matrix — hover estilo terminal | Design | Pending |
| LAY-05 | P1: Menu lateral fixo visível | Design | Pending |
| LAY-06 | P1: Menu — navegação entre seções (SPA-like) | Design | Pending |
| LAY-07 | P1: Menu — item ativo destacado | Design | Pending |
| LAY-08 | P1: Menu — fixo no scroll | Design | Pending |
| LAY-09 | P1: Menu — nome/logo no topo | Design | Pending |
| LAY-10 | P1: Contador via CountAPI | Design | Pending |
| LAY-11 | P1: Contador — formato terminal | Design | Pending |
| LAY-12 | P1: Contador — fallback se API falhar | Design | Pending |
| LAY-13 | P1: Deploy GitHub Pages acessível | Design | Pending |
| LAY-14 | P1: Assets com paths relativos corretos | Design | Pending |
| LAY-15 | P1: Layout utilizável em mobile | Design | Pending |
| LAY-16 | P2: Matrix rain canvas | - | Pending |
| LAY-17 | P2: Matrix rain — conteúdo legível à frente | - | Pending |
| LAY-18 | P2: Matrix rain — respeita prefers-reduced-motion | - | Pending |
| LAY-19 | P3: Easter egg Konami | - | Pending |

**Coverage:** 19 requisitos, 0 mapeados para tasks ⚠️

---

## Success Criteria

- [ ] Site acessível em `https://dbtorrico.github.io/pagina-pessoal`
- [ ] Visual Matrix reconhecível imediatamente ao abrir (preto + verde + monospace)
- [ ] Navegação entre as 3 seções funciona sem recarregar a página
- [ ] Contador exibe número de visitas corretamente
- [ ] Nenhum erro no console ao carregar
