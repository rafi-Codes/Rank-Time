import Mailjet from 'node-mailjet';

const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
const fromEmail = process.env.FROM_EMAIL || 'noreply@ranktime.com';
const fromName = process.env.FROM_NAME || 'RankTime';

let mailjetClient: any;

function getMailjetClient() {
  if (mailjetClient) return mailjetClient;
  if (!mailjetApiKey || !mailjetSecretKey) {
    throw new Error('Mailjet credentials are not set');
  }

  mailjetClient = new Mailjet({
    apiKey: mailjetApiKey,
    apiSecret: mailjetSecretKey,
  });
  return mailjetClient;
}

export async function sendEmailNow(to: string, subject: string, text: string, html?: string) {
  const client = getMailjetClient();
  const response = await client.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: { Email: fromEmail, Name: fromName },
        To: [{ Email: to }],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  });
  return response.body;
}

export function getMailjetHealth() {
  if (!mailjetApiKey || !mailjetSecretKey) {
    return { healthy: false, message: 'Mailjet is not configured' };
  }
  return { healthy: true, message: 'Mailjet configured' };
}
