import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import {Resend} from 'resend';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const {name, company, whatsapp, email, city, type, message} = req.body as {
    name: string;
    company: string;
    whatsapp: string;
    email: string;
    city: string;
    type: string;
    message: string;
  };

  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) {
    res.status(500).json({error: 'Email service not configured'});
    return;
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'CM Engenharia <onboarding@resend.dev>';
  const toEmail = process.env['CONTACT_EMAIL'] ?? 'contato@cmengenharia.com';

  const {error} = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `Novo Orçamento — ${type} | ${name}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #191c1e;">
        <div style="background: #131b2e; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fcdeb5; font-size: 20px; margin: 0; letter-spacing: -0.02em;">CM Engenharia</h1>
          <p style="color: #7c839b; font-size: 13px; margin: 4px 0 0;">Novo pedido de orçamento</p>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #c6c6cd; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 13px; color: #45464d; width: 40%;">Nome</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 14px; font-weight: 600; color: #191c1e;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 13px; color: #45464d;">Empresa / Franquia</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 14px; font-weight: 600; color: #191c1e;">${company}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 13px; color: #45464d;">WhatsApp</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 14px; font-weight: 600; color: #191c1e;">${whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 13px; color: #45464d;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 14px; font-weight: 600; color: #191c1e;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 13px; color: #45464d;">Cidade / Estado</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 14px; font-weight: 600; color: #191c1e;">${city || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 13px; color: #45464d;">Tipo de Obra</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eceef0; font-size: 14px; font-weight: 600; color: #191c1e;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 13px; color: #45464d; vertical-align: top;">Mensagem</td>
              <td style="padding: 10px 0; font-size: 14px; color: #191c1e; line-height: 1.6;">${message || '—'}</td>
            </tr>
          </table>
          <div style="margin-top: 32px; padding: 16px; background: #f7f9fb; border-radius: 6px; font-size: 12px; color: #45464d;">
            Responda a este email para entrar em contato diretamente com o cliente.
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    res.status(500).json({error: 'Falha ao enviar o email. Tente novamente.'});
    return;
  }

  res.json({success: true});
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
