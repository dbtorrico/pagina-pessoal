# Poko Loko Lab — Specification

## Problem Statement

A seção Poko Loko Lab precisa exibir os projetos musicais e audiovisuais do Torrico em cards visualmente atrativos, no estilo Matrix. Inicialmente 2 projetos reais do YouTube.

## Scope: Medium — spec breve, design inline, tasks implícitas

## Projetos reais (v1)

| Título | Tipo | URL | Thumbnail |
|---|---|---|---|
| Fogo | Música | https://music.youtube.com/watch?v=OshMymt1hC8 | https://img.youtube.com/vi/OshMymt1hC8/maxresdefault.jpg |
| Faz Academia Pra Amarrar Bandana | Audiovisual | https://www.youtube.com/watch?v=Cr6ZKs-swM4 | https://img.youtube.com/vi/Cr6ZKs-swM4/maxresdefault.jpg |

## Acceptance Criteria

1. WHEN a seção Poko Loko Lab é exibida THEN SHALL mostrar um grid com os 2 cards
2. WHEN um card é exibido THEN SHALL conter: thumbnail do YouTube, título, descrição breve, badge de tipo (Música / Audiovisual)
3. WHEN o usuário clica em um card THEN SHALL abrir o link do YouTube em nova aba
4. WHEN o cursor passa sobre um card THEN SHALL exibir efeito hover Matrix (borda verde brilhante / elevação)
5. WHEN a thumbnail do YouTube não carrega THEN SHALL exibir placeholder escuro com ícone

## Requirement IDs

| ID | Critério |
|---|---|
| PLK-01 | Grid de cards visível na seção |
| PLK-02 | Card com thumbnail, título, descrição, badge |
| PLK-03 | Click abre YouTube em nova aba |
| PLK-04 | Hover Matrix no card |
| PLK-05 | Fallback de imagem |
