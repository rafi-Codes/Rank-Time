// test-openrouter.js - Test OpenRouter API connection
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

const { OpenRouter } = require('@openrouter/sdk');

async function testOpenRouter() {
  console.log('Testing OpenRouter API connection...');

  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('API Key configured:', !!apiKey);

  if (!apiKey) {
    console.error('❌ OpenRouter API key not found');
    return;
  }

  try {
    const openRouter = new OpenRouter({
      apiKey: apiKey,
    });

    console.log('Sending test message...');

    const completion = await openRouter.chat.send({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'user', content: 'Hello, can you respond with just "OpenRouter test successful"?' }
      ],
      stream: false,
      maxTokens: 50,
      temperature: 0.1,
    });

    const response = completion.choices[0].message.content;
    console.log('✅ OpenRouter API working!');
    console.log('Response:', response);

  } catch (error) {
    console.error('❌ OpenRouter API error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testOpenRouter();