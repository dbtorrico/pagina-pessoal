# External Integrations

## Portfolio Links

**Service:** vozdivina.com.br e horadeninar.com.br
**Purpose:** Exibir trabalhos anteriores do autor
**Implementation:** Links `<a href>` com `target="_blank"` em `Pagina1.html:23-28`
**Authentication:** Nenhuma — links públicos
**Type:** Links externos simples (sem API, sem embed)

```html
<a href="http://www.vozdivina.com.br" target="_blank">Portal Clube da Fé - Voz Divina</a>
<a href="http://www.horadeninar.com.br" target="_blank">Hora de Ninar</a>
```

## Redes Sociais

**Service:** Facebook, Instagram, YouTube, Google+ (descontinuado)
**Purpose:** Conectar visitantes aos perfis do autor
**Implementation:** Links de ícones em `Pagina1.html:83-88`
**Authentication:** Nenhuma — links públicos de perfil
**Type:** Links externos simples (sem API Social, sem widget)

```html
<a href="https://www.facebook.com/dbtorrico" target="_blank">
<a href="https://plus.google.com/111377473893322206318/posts" target="_blank">  <!-- MORTO -->
<a href="https://www.instagram.com/dbtorrico/" target="_blank">
<a href="https://www.youtube.com/channel/UCLbStTbw4SGCMESqur1m-Rw" target="_blank">
```

## APIs Consumidas

Nenhuma.

## Webhooks

Nenhum.

## Background Jobs

Nenhum.

## Formulário de Contato

**Status:** NÃO funcional — dados não são enviados a lugar nenhum
**Implementation:** `script.js:1-6` — apenas valida campo nome e exibe `alert()`
**Sem:** endpoint de backend, serviço de email (Formspree, Netlify Forms, etc.), armazenamento

## Variáveis de Ambiente

Nenhuma — projeto completamente estático, sem configuração de ambiente.
