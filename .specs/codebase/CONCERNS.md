# Codebase Concerns

**Analysis Date:** 2026-06-13

## Known Bugs

**Formulário de contato não envia dados:**

- Symptoms: Clicando "Enviar" aparece mensagem de sucesso ("dados encaminhados com sucesso"), mas nenhum dado é transmitido
- Trigger: Preencher qualquer campo do formulário e clicar "Enviar"
- Files: `script.js:1-6`, `Pagina1.html:67-82`
- Root cause: Função `Enviar()` apenas exibe `alert()` — não há endpoint de backend, serviço de email nem armazenamento
- Fix approach: Integrar serviço de formulário (ex: Formspree, Netlify Forms, EmailJS) ou implementar backend

**Link de Google+ morto:**

- Symptoms: Link de rede social leva a página inexistente
- Trigger: Clicar no ícone Google+
- Files: `Pagina1.html:85`
- Root cause: Google+ foi desligado em abril de 2019
- Fix approach: Remover link ou substituir por LinkedIn/outra rede ativa

## Security Considerations

**Input não sanitizado exibido em alert:**

- Risk: O valor do campo nome é concatenado diretamente no `alert()` — risco baixo de XSS (contexto local, sem persistência)
- Files: `script.js:5`
- Current mitigation: Nenhuma
- Recommendations: Sanitizar input antes de exibir; considerar usar `textContent` em vez de concatenação

**Portfolio links usando HTTP em vez de HTTPS:**

- Risk: Mixed content em páginas HTTPS; conexão não criptografada
- Files: `Pagina1.html:24, 27`
- Current mitigation: Nenhuma
- Recommendations: Atualizar para `https://` ou verificar se os domínios suportam HTTPS

## Dependencies at Risk

**Google+ (descontinuado):**

- Risk: Serviço encerrado em 2019 — link permanentemente quebrado
- Impact: Ícone de rede social sem destino válido
- Migration plan: Remover o ícone `g+.png` e substituir por LinkedIn ou outra rede ativa

**Fonte Montserrat-Bold.ttf (não utilizada):**

- Risk: Asset morto aumentando tamanho do repositório sem benefício
- Impact: Nenhum funcional, mas gera ruído
- Migration plan: Remover o arquivo ou utilizá-la no CSS

## Missing Critical Features

**Formulário de contato funcional:**

- Problem: O formulário atual não envia dados — a promessa de "encaminhar dados" é falsa
- Current workaround: Nenhum — visitantes interessados não têm como entrar em contato via site
- Blocks: Geração de leads, comunicação com potenciais clientes
- Implementation complexity: Baixa — integrar Formspree (gratuito) requer ~5 linhas de HTML

**Responsividade da tabela de horários:**

- Problem: A tabela `Pagina1.html:91-181` não tem media queries — quebra em telas estreitas
- Current workaround: Nenhum
- Blocks: Usabilidade mobile
- Implementation complexity: Baixa-Média — adicionar overflow-x: auto ou reformatar para mobile

## Test Coverage Gaps

**Nenhum teste automatizado:**

- What's not tested: 100% do comportamento (formulário, links, renderização)
- Risk: Qualquer mudança no CSS/JS pode quebrar funcionalidade sem ser percebida
- Priority: Baixa (projeto simples) — testes manuais são suficientes por ora
- Difficulty to test: Baixa — Playwright ou Cypress poderiam cobrir os fluxos principais em ~2h

## Tech Debt

**Conteúdo hardcoded no HTML:**

- Issue: Portfolio, experiências, horários e redes sociais estão todos hardcoded em `Pagina1.html`
- Files: `Pagina1.html` (todo o arquivo)
- Why: Projeto inicial simples sem CMS
- Impact: Cada atualização de conteúdo requer edição direta do HTML — propenso a erro
- Fix approach: Extrair dados para JSON ou adotar gerador estático (Eleventy, Astro) com templates

**Dados placeholder na tabela de horários:**

- Issue: Maioria das células contém "teste", "Col2", dados incompletos — `Pagina1.html:103-181`
- Files: `Pagina1.html:91-181`
- Impact: Tabela visualmente inacabada — prejudica credibilidade
- Fix approach: Preencher com horários reais ou remover a seção

**Fonte Montserrat carregada como TTF:**

- Issue: `estilo.css:2-3` carrega TTF sem fallback WOFF2
- Files: `estilo.css:1-4`
- Impact: Performance (~2x maior que WOFF2) e sem fallback para system fonts se o arquivo falhar
- Fix approach: Converter para WOFF2, adicionar stack de fallback: `font-family: 'Montserrat', sans-serif`

---

_Concerns audit: 2026-06-13_
_Atualizar conforme issues forem resolvidas ou novas descobertas surgirem_
