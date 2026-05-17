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

## Build de produção

```bash
npm run build
npm run serve:ssr:app
```

O servidor SSR sobe na porta definida pela variável `PORT` (padrão: `4000`).

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
