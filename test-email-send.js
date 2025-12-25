// test-email-send.js - Test actual email sending
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');

  envLines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  });
}

const Mailjet = require('node-mailjet');

const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
const fromEmail = process.env.FROM_EMAIL || 'noreply@ranktime.com';
const fromName = process.env.FROM_NAME || 'RankTime';

async function testEmailSending() {
  console.log('Testing actual email sending with Mailjet...');

  if (!mailjetApiKey || !mailjetSecretKey) {
    console.error('❌ Mailjet API credentials not found');
    return;
  }

  const mailjet = new Mailjet({
    apiKey: mailjetApiKey,
    apiSecret: mailjetSecretKey,
  });

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
              Email: 'rafihasan27rafi@gmail.com', // Replace with your actual email for testing
            },
          ],
          Subject: 'RankTime Email Test',
          TextPart: 'This is a test email from RankTime using Mailjet API.',
          HTMLPart: '<p>This is a <strong>test email</strong> from RankTime using Mailjet API.</p><p>If you received this, the integration is working!</p>',
        },
      ],
    });

    const result = await request;
    console.log('✅ Email sent successfully!');
    console.log('Response:', JSON.stringify(result.body, null, 2));
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testEmailSending();