# Layout Matrix — Decisões de Contexto

**Data:** 2026-06-13

## Paleta de Cores

Baseada na imagem de referência fornecida pelo Torrico:

- **Background:** `#050a05` (preto com leve tint verde — não preto puro)
- **Texto principal:** `#00FF41` (verde Matrix clássico)
- **Glow / brilho:** `#00FF41` com `text-shadow` em camadas para efeito bloom
- **Caracteres da chuva (rain):** gradiente do brilhante (`#00FF41`) ao escuro (`#003B00`) para simular profundidade — caracteres no topo mais brilhantes, sumindo ao cair
- **Fundo dos painéis/menu:** `rgba(5, 10, 5, 0.85)` — semi-transparente sobre o rain

## Fonte

- **VT323** (Google Fonts) — pixel art retro, estilo terminal antigo, consistente com a imagem de referência
- Fallback: `'Courier New', Courier, monospace`
- O número "6" e "FALLING LETTERS" na imagem confirmam o estilo pixel que o Torrico quer

## Matrix Rain

- Caracteres: mix de katakana japonês + números + símbolos (`ア`, `ウ`, `エ`, `オ` + `0-9` + `$`, `%`, `@`, etc.)
- Renderização: `<canvas>` fullscreen, z-index atrás de todo o conteúdo
- Efeito de brilho: caractere mais recente da coluna em branco (`#FFFFFF`) ou verde claro, os demais em verde escurecendo progressivamente
- Respeita `prefers-reduced-motion` (desativa animação)

## Mobile

- Menu lateral colapsa em telas < 768px
- Ícone `☰` (hambúrguer) visível no canto superior esquerdo
- Ao clicar: menu desliza da esquerda sobre o conteúdo (overlay)
- Ao clicar fora do menu: fecha automaticamente
