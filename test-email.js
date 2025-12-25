// test-email.js - Simple test for email configuration
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
        const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes if present
        process.env[key] = value;
      }
    }
  });
}

console.log('Testing email configuration...');

// Check environment variables
const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
const fromEmail = process.env.FROM_EMAIL;

console.log('Mailjet API Key configured:', !!mailjetApiKey);
console.log('Mailjet Secret Key configured:', !!mailjetSecretKey);
console.log('From Email configured:', !!fromEmail);

if (mailjetApiKey && mailjetSecretKey) {
  console.log('✅ Mailjet API is configured - email service ready');
} else {
  console.log('❌ Mailjet API not configured. Please set up Mailjet API credentials.');
}

console.log('\nTo test actual email sending, configure your Mailjet credentials in .env.local and run the app.');