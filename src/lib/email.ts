import Mailjet from 'node-mailjet';
import { sendEmailWithRetry } from '@/lib/emailQueue';
import { logger } from '@/lib/logger';

const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
const fromEmail = process.env.FROM_EMAIL || 'noreply@ranktime.com';
const fromName = process.env.FROM_NAME || 'RankTime';

declare global {
  // eslint-disable-next-line no-var
  var _mailjetInstance: any | undefined;
}

function getMailjet() {
  if (global._mailjetInstance) return global._mailjetInstance;
  if (mailjetApiKey && mailjetSecretKey) {
    global._mailjetInstance = new Mailjet({
      apiKey: mailjetApiKey,
      apiSecret: mailjetSecretKey,
    });
    logger.info('Mailjet API configured for email sending');
  } else {
    logger.warn('Mailjet API not configured. Email sending will fail if attempted.');
  }
  return global._mailjetInstance;
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  return sendEmailWithRetry({ to, subject, text, html }, sendEmailOnce);
}

async function sendEmailOnce(to: string, subject: string, text: string, html?: string) {
  const mj = getMailjet();
  if (!mj) {
    throw new Error('Mailjet API not configured');
  }

  try {
    const request = mj.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        },
      ],
    });

    const result = await request;
    return result.body;
  } catch (error) {
    logger.warn('Mailjet API error', { to, subject, error });
    throw new Error('Failed to send email via Mailjet');
  }
}

export function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) otp += digits[Math.floor(Math.random() * digits.length)];
  return otp;
}
