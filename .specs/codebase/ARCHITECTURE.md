# Architecture

**Pattern:** Static Single Page — HTML/CSS/JS vanilla, sem framework

## High-Level Structure

```
Pagina1.html  →  estilo.css   (apresentação visual)
              →  script.js    (comportamento mínimo)
              →  fontes/      (tipografia customizada)
              →  imagens/     (ativos visuais)
```

## Identified Patterns

### Página Única Monolítica

**Location:** `Pagina1.html` (183 linhas)
**Purpose:** Concentra toda a estrutura, conteúdo e dados do site
**Implementation:** HTML semântico com seções: cabeçalho de perfil, portfolio, experiência, horário de atendimento, formulário de contato, redes sociais
**Example:** `Pagina1.html:1-183`

### Estilo Global Centralizado

**Location:** `estilo.css`
**Purpose:** Único arquivo de estilos para toda a página
**Implementation:** Classes kebab-case, sem SCSS/LESS, sem metodologia (BEM, SMACSS, etc.)
**Example:** `.container-principal`, `.info-1`, `.img-principal`

### JavaScript Mínimo de Comportamento

**Location:** `script.js` (6 linhas)
**Purpose:** Única interação da página — validação superficial do formulário
**Implementation:** Função global `Enviar()` que valida campo nome e exibe alert
**Example:** `script.js:1-6`

## Data Flow

### Fluxo de Carregamento

```
Browser → Pagina1.html → estilo.css (bloqueante) → script.js (bloqueante) → render
```

### Fluxo do Formulário de Contato

```
User preenche form → click "Enviar" → onclick="Enviar()" → valida nome ≠ "" → alert()
                                                                             ↳ Dados NÃO enviados para nenhum servidor
```

## Code Organization

**Approach:** Monolítico — sem separação de concerns, sem módulos, sem componentes

**Structure:**
- Conteúdo, estrutura e metadados no HTML
- Apresentação visual no CSS
- Comportamento no JS (trivial)
- Assets em subdiretórios por tipo

**Module boundaries:** Não há — projeto de arquivo único
