# Torrico — Página Pessoal

**Vision:** Site pessoal estilo retrô Matrix (preto e verde) com menu lateral, apresentando os projetos musicais/visuais, jogos desenvolvidos e histórico profissional de Torrico.
**For:** Visitantes em geral — colegas da área tech, fãs de música, recrutadores e curiosos
**Solves:** Centralizar a identidade pessoal e profissional de Torrico num espaço único, com visual marcante e autoral

## Goals

- Publicar site funcional no GitHub Pages com identidade visual Matrix consolidada
- Exibir projetos do Poko Loko Lab (músicas e vídeos) de forma organizada e navegável
- Disponibilizar o jogo Snake jogável diretamente no browser, com lista de jogos em cards
- Apresentar histórico profissional (Engenheiro de Dados / Tech Lead / músico / ex-professor)
- Contador de visitantes real e visível (via CountAPI)

## Tech Stack

**Core:**
- Language: HTML5 + CSS3 + JavaScript (ES6+)
- Runtime: Browser (sem servidor)
- Hosting: GitHub Pages
- Visitor counter: CountAPI (API REST gratuita, chamada JS client-side)

**Key dependencies:** Nenhuma obrigatória — vanilla puro por padrão. Frameworks avaliados caso a caso conforme complexidade emergir.

## Scope

**v1 inclui:**
- Layout base: menu lateral fixo + área de conteúdo principal, tema Matrix (fundo preto, texto/detalhes verde neon, fonte monospace estilo terminal)
- Contador de visitantes no header/rodapé
- Seção **Poko Loko Lab**: grid de projetos musicais (lançamentos) e visuais (vídeos, clipes, filmes)
- Seção **Jogos**: lista de jogos em cards (título, descrição, imagem de capa) + jogo Snake jogável inline
- Seção **Currículo**: linha do tempo profissional (Engenheiro de Dados, Tech Lead, músico/produtor, ex-professor de Ciência da Computação)
- Responsividade básica (mobile-friendly)
- Deploy no GitHub Pages

**Explicitamente fora de escopo (v1):**
- CMS ou painel de administração de conteúdo
- Backend próprio ou banco de dados
- Sistema de comentários ou interação social
- Blog ou seção de artigos
- Autenticação de qualquer tipo
- Analytics avançado (Google Analytics, etc.)

## Constraints

- Timeline: Sem prazo definido — velocidade natural
- Technical: Vanilla HTML/CSS/JS por padrão; frameworks só se a complexidade justificar
- Resources: Hosting gratuito (GitHub Pages), serviços externos gratuitos (CountAPI)
- Content: Conteúdo do Currículo preenchido posteriormente; Poko Loko Lab e Jogos com dados iniciais placeholder até conteúdo real ser definido
