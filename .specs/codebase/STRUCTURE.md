# Project Structure

**Root:** `/Users/torrico-estudio/Documents/Claude/code/pagina-pessoal`

## Directory Tree

```
pagina-pessoal/
├── Pagina1.html          # Página principal (183 linhas)
├── estilo.css            # Estilos globais (90 linhas)
├── script.js             # Comportamento (6 linhas)
│
├── fontes/               # Fontes customizadas
│   ├── Montserrat-Regular.ttf   (~29KB, em uso)
│   └── Montserrat-Bold.ttf      (~29KB, não utilizado)
│
└── imagens/              # Assets visuais
    ├── torricoST.jpg     (~92KB — foto de perfil)
    ├── fb.png            (~3.6KB — ícone Facebook)
    ├── g+.png            (~6KB — ícone Google+)
    ├── in.png            (~5.2KB — ícone Instagram)
    └── yt.png            (~6KB — ícone YouTube)
```

## Module Organization

### Página Principal

**Purpose:** Estrutura, conteúdo e layout do site completo
**Location:** `Pagina1.html`
**Key files:** `Pagina1.html`

Seções internas do HTML (sem separação física de arquivos):
1. Perfil (foto, nome, cargo) — linhas ~1-20
2. Portfolio (links de trabalhos) — linhas ~21-30
3. Experiência (lista de habilidades) — linhas ~31-65
4. Formulário de contato — linhas ~67-82
5. Redes sociais — linhas ~83-90
6. Tabela de horários — linhas ~91-181

### Estilos

**Purpose:** Apresentação visual de todos os elementos
**Location:** `estilo.css`
**Key files:** `estilo.css`

### Comportamento

**Purpose:** Única interação JS — validação do formulário
**Location:** `script.js`
**Key files:** `script.js`

### Assets Estáticos

**Purpose:** Fontes e imagens utilizadas no HTML/CSS
**Location:** `fontes/`, `imagens/`

## Where Things Live

**Conteúdo e Dados:**
- Todo o conteúdo: `Pagina1.html` (hardcoded)
- Sem CMS, sem banco de dados, sem API

**Apresentação Visual:**
- Estilos: `estilo.css`
- Fontes: `fontes/`
- Imagens: `imagens/`

**Lógica de Negócio:**
- Não há (site estático de apresentação pessoal)

**Configuração:**
- Não há arquivos de configuração
