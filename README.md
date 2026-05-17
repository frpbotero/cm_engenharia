# CM Engenharia — Landing Page

Landing page institucional da CM Engenharia, especializada em construção comercial para franquias e varejo.

Construída com **Angular 21 + SSR**, **Tailwind CSS v4** e **Angular Material**. O formulário de contato envia emails via **Resend**.

## Tecnologias

- Angular 21 (SSR com Express)
- Tailwind CSS v4
- Angular Material (ícones)
- Resend (envio de email do formulário de contato)

## Pré-requisitos

- Node.js v20 ou superior
- Conta no [Resend](https://resend.com) com domínio verificado (para envio de email em produção)

## Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `RESEND_API_KEY` | Chave da API do Resend. Obtenha em [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Endereço remetente (ex: `CM Engenharia <noreply@seudominio.com>`). O domínio precisa estar verificado no Resend. Em desenvolvimento use `onboarding@resend.dev` |
| `CONTACT_EMAIL` | Email de destino que recebe as submissões do formulário |

## Rodando localmente

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Build de produção (servidor Node.js)

```bash
npm run build
npm run serve:ssr:app
```

O servidor SSR sobe na porta definida pela variável `PORT` (padrão: `4000`).

## Deploy no Vercel

### Arquivos de configuração

| Arquivo | Descrição |
|---|---|
| `vercel.json` | Build command, região (`gru1` / São Paulo) e roteamento |
| `vercel-entry.mjs` | Adaptador que expõe o servidor Express como função serverless |
| `.vercelignore` | Arquivos excluídos do upload |

### Via Vercel CLI

```bash
npm i -g vercel
vercel deploy
```

### Via GitHub / GitLab (recomendado)

1. Faça push do repositório
2. Importe o projeto em [vercel.com/new](https://vercel.com/new)
3. O Vercel detecta automaticamente as configurações do `vercel.json`
4. Não altere nenhuma configuração de build — elas já estão no `vercel.json`

### Variáveis de ambiente

Configure as variáveis abaixo em **Settings → Environment Variables** no painel do Vercel:

| Variável | Descrição |
|---|---|
| `RESEND_API_KEY` | Chave do Resend para envio de email do formulário |
| `RESEND_FROM_EMAIL` | Endereço remetente (domínio precisa estar verificado no Resend) |
| `CONTACT_EMAIL` | Email de destino dos orçamentos |

> Durante testes, use `RESEND_FROM_EMAIL=onboarding@resend.dev` (domínio de sandbox do Resend, não precisa de verificação).

## Estrutura

```
src/
  app/
    app.ts          # Componente raiz — lógica do menu mobile e formulário reativo
    app.html        # Template da landing page (nav, hero, sobre, diferenciais,
    app.css         #   serviços, portfólio, processo, contato, footer)
    app.config.ts   # Providers Angular (Router, HttpClient)
    app.routes.ts   # Rotas (atualmente vazio — single-page)
  server.ts         # Express SSR + rota POST /api/contact (Resend)
  styles.css        # Design tokens (cores, tipografia, espaçamentos) via @theme
  index.html        # Shell HTML
```

## Seções da landing page

| Seção | Âncora |
|---|---|
| Serviços | `#servicos` |
| Diferenciais | `#diferenciais` |
| Portfólio | `#portfolio` |
| Contato / Formulário | `#contato` |


@Botero