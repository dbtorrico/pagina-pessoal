# Roadmap

**Current Milestone:** M4 completo — Deploy em andamento
**Status:** Em produção (GitHub Pages)

---

## M1 — Estrutura Base + Visual Matrix

**Goal:** Site no ar no GitHub Pages com layout Matrix funcional, menu lateral navegável e contador de visitantes
**Target:** Site publicável e visualmente completo, mesmo com conteúdo placeholder

### Features

**Layout Matrix** - PLANNED

- Fundo preto com texto verde neon (#00FF41 ou similar)
- Fonte monospace (ex: VT323, Share Tech Mono, ou Courier)
- Menu lateral fixo com links de navegação para as 3 seções + efeito hover estilo terminal
- Área de conteúdo principal à direita do menu
- Efeito visual opcional: chuva de caracteres Matrix no background (canvas)

**Contador de Visitantes** - PLANNED

- Integração com CountAPI (GET + POST a cada visita)
- Exibição discreta no rodapé ou header estilo `[VISITORS: 0042]`

**Deploy GitHub Pages** - PLANNED

- Configurar repositório para publicar via GitHub Pages
- Garantir que todos os assets (fontes, imagens) carregam corretamente no domínio `dbtorrico.github.io/pagina-pessoal`

---

## M2 — Poko Loko Lab

**Goal:** Seção de projetos musicais e visuais navegável, com conteúdo real ou bem estruturado para receber conteúdo

### Features

**Grid de Projetos Musicais** - PLANNED

- Cards com: título da música/álbum, ano de lançamento, imagem de capa, link para streaming (Spotify, SoundCloud, YouTube, etc.)
- Layout em grid responsivo estilo "discografia"
- Filtro por tipo: Música / Visual (opcional)

**Grid de Projetos Visuais** - PLANNED

- Cards para vídeos, clipes, filmes
- Embed de YouTube ou link externo ao clicar
- Mesmo padrão visual dos cards musicais

---

## M3 — Seção Jogos

**Goal:** Lista de jogos em cards + Snake jogável diretamente no browser

### Features

**Lista de Jogos em Cards** - PLANNED

- Card por jogo: título, descrição curta, imagem de capa
- Click no card abre/carrega o jogo ou navega para a página do jogo
- Layout em grid consistente com o visual Matrix

**Jogo Snake** - DONE

- Snake clássico jogável inline na página (canvas JS)
- Visual Matrix: fundo preto, cobra e comida em verde neon
- Controles: setas ou WASD
- Placar de pontuação
- Tela de game over com opção de reiniciar

**Jogo Save the Chicken Eggs** - IN PROGRESS

- Port do jogo pygame `save-the-chicken-eggs` para JS/Canvas
- Visual cartoon próprio (≠ Matrix, ≠ original)
- Galinha lança ovos em arco; almofada (mouse/setas) rebate até o portal
- 10 fases, perde na água, tela de vitória, recorde via localStorage
- Spec: `.specs/features/save-the-chicken-eggs/`

---

## M4 — Currículo

**Goal:** Histórico profissional completo e visualmente organizado

### Features

**Linha do Tempo Profissional** - PLANNED

- Experiências: Engenheiro de Dados, Tech Lead, músico/produtor, ex-professor de Ciência da Computação
- Formato de timeline vertical estilo terminal (`> 2020 — Tech Lead @ ...`)
- Habilidades técnicas (data engineering, Python, SQL, cloud, etc.)
- Links para GitHub, LinkedIn, Poko Loko Lab (interno)

---

## Future Considerations

- Efeito Matrix rain animado mais elaborado (canvas com caracteres japoneses)
- Modo "scan lines" CRT para efeito retrô ainda mais intenso
- Easter egg interativo (ex: código Konami ativa algo)
- Página de cada jogo com leaderboard (requer backend ou serviço externo)
- Player de música embutido no Poko Loko Lab
- Internacionalização (PT/EN)
