import Mailjet from 'node-mailjet';

const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
const fromEmail = process.env.FROM_EMAIL || 'noreply@ranktime.com';
const fromName = process.env.FROM_NAME || 'RankTime';

let mailjet: any = null;

if (mailjetApiKey && mailjetSecretKey) {
  mailjet = new Mailjet({
    apiKey: mailjetApiKey,
    apiSecret: mailjetSecretKey,
  });
  console.log('Mailjet API configured for email sending');
} else {
  console.warn('Mailjet API not configured. Email sending will fail if attempted.');
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!mailjet) {
    throw new Error('Mailjet API not configured');
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
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
    console.error('Mailjet API error:', error);
    throw new Error('Failed to send email via Mailjet');
  }
}

export function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) otp += digits[Math.floor(Math.random() * digits.length)];
  return otp;
}
