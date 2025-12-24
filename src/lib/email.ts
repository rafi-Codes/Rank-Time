import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.FROM_EMAIL || process.env.SMTP_USER;

if (!host || !port || !user || !pass) {
  // We don't throw here because dev may not use email sending locally.
  console.warn('SMTP not fully configured. Email sending will fail if attempted.');
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!host || !port || !user || !pass) {
    throw new Error('SMTP not configured');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}

export function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) otp += digits[Math.floor(Math.random() * digits.length)];
  return otp;
}
