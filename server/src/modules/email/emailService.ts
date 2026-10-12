import nodemailer from "nodemailer";
import type { InvoiceData } from "../order/orderRepository";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!host || !Number.isInteger(port)) {
    throw new Error("SMTP_HOST and a valid SMTP_PORT are required.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    ...(user && password ? { auth: { user, pass: password } } : {}),
  });
}

type EmailAttachment = { filename: string; content: Buffer };

type EmailMessage = {
  from: string;
  to: string;
  subject: string;
  text: string;
  attachments?: EmailAttachment[];
};

// "Korn <orders@example.com>" -> { name: "Korn", email: "orders@example.com" }
export function parseSender(from: string) {
  const match = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return match
    ? { name: match[1] || undefined, email: match[2] }
    : { email: from.trim() };
}

async function sendWithBrevo(apiKey: string, message: EmailMessage) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: parseSender(message.from),
      to: [{ email: message.to }],
      subject: message.subject,
      textContent: message.text,
      ...(message.attachments?.length
        ? {
            attachment: message.attachments.map((file) => ({
              name: file.filename,
              content: file.content.toString("base64"),
            })),
          }
        : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo rejected the email (HTTP ${response.status}).`);
  }
}

// Production hosts like Railway block outbound SMTP on most plans, so when a
// Brevo API key is configured, emails go through Brevo's HTTPS API instead.
// Without it (local development), SMTP is used, e.g. Mailpit.
async function sendEmail(message: EmailMessage) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    await sendWithBrevo(brevoApiKey, message);
    return;
  }

  await getTransporter().sendMail(message);
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is required to send confirmations.");

  await sendEmail({
    from,
    to: email,
    subject: "Bienvenue dans la communauté Korn",
    text: [
      "Bienvenue,",
      "",
      "Merci de vous être inscrit à la newsletter Korn.",
      "Vous recevrez en avant-première nos nouvelles collections, drops exclusifs et offres membres.",
      "",
      "L'équipe Korn",
    ].join("\n"),
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is required to send confirmations.");

  await sendEmail({
    from,
    to: email,
    subject: "Réinitialisation de votre mot de passe Korn",
    text: [
      "Bonjour,",
      "",
      "Vous avez demandé la réinitialisation de votre mot de passe Korn.",
      `Cliquez sur ce lien pour en choisir un nouveau : ${resetUrl}`,
      "Ce lien expire dans 1 heure.",
      "",
      "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
      "",
      "L'équipe Korn",
    ].join("\n"),
  });
}

export async function sendPaymentConfirmationEmail(
  invoice: InvoiceData,
  pdf: Buffer,
) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM is required to send confirmations.");

  await sendEmail({
    from,
    to: invoice.customer_email,
    subject: `Confirmation de paiement - commande #${invoice.id_order}`,
    text: [
      `Bonjour ${invoice.shipping_first_name},`,
      "",
      `Nous confirmons le paiement de votre commande #${invoice.id_order}.`,
      `Montant payé : ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(invoice.total_price))}.`,
      `Votre facture ${invoice.invoice_number} est jointe à cet email.`,
      "",
      "Merci pour votre commande,",
      "L'équipe Korn",
    ].join("\n"),
    attachments: [
      {
        filename: `${invoice.invoice_number}.pdf`,
        content: pdf,
      },
    ],
  });
}
