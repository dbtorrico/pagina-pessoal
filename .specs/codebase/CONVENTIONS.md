# Code Conventions

## Naming Conventions

**Files:**
- Inconsistente: `Pagina1.html` (PascalCase com número) vs `estilo.css` e `script.js` (minúsculas)
- Diretórios em português descritivo: `fontes/`, `imagens/`
- Exemplos: `Pagina1.html`, `estilo.css`, `script.js`

**Functions/Methods:**
- PascalCase (não segue convenção JS de camelCase)
- Exemplo: `function Enviar()` — `script.js:1`

**Variables:**
- camelCase para variáveis locais
- Usa `var` (ES5 — não usa `let`/`const`)
- Exemplo: `var nome = document.getElementById("nomeid")` — `script.js:2`

**CSS Classes:**
- kebab-case: `.container-principal`, `.info-1`, `.info-2`, `.info-3`, `.redes-sociais`, `.tabela-horario`, `.img-principal`

**HTML IDs:**
- camelCase: `nomeid`, `foneid`, `emailid`

## Code Organization

**Import/Dependency Declaration:**
```html
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="estilo.css">
<script src="script.js"></script>
```
- Ordem: Meta → CSS → JS (correta)
- Script sem `async`/`defer` — carregamento bloqueante

**File Structure:**
- HTML: `<!DOCTYPE>` → `<head>` (meta+links) → `<body>` (conteúdo linear, sem template)
- CSS: regras globais seguidas de classes por seção
- JS: função global única

## Error Handling

**Pattern:** Ausente — nenhum try-catch, nenhum fallback, nenhum tratamento de erro
- Formulário valida apenas presença do nome (não valida email, telefone, formato)
- Exemplo: `if (nome.value != "")` — `script.js:3` (usa `!=` loose em vez de `!==`)

## Comments/Documentation

**Style:** Praticamente ausentes
- Único comentário HTML: `<!--Segunda-->` — `Pagina1.html:104`
- Nenhuma documentação de função, propósito ou estrutura

## Type Safety

**Approach:** Nenhum — JavaScript sem TypeScript, sem JSDoc, sem validação de tipos
