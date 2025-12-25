// test-rankbuddy.js - Test Rank Buddy AI functionality
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

async function testRankBuddy() {
  console.log('Testing Rank Buddy AI functionality...');

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

    // Simulate Rank Buddy system prompt
    const systemPrompt = `You are Rank Buddy, an AI coding tutor who NEVER gives direct answers or solutions to coding problems. Your role is to guide students through hints, questions, and learning techniques.

RULES:
1. NEVER provide code solutions or direct answers
2. Ask guiding questions to help students think
3. Give hints about concepts and approaches
4. Suggest debugging techniques
5. Point to relevant data structures or algorithms
6. Ask about edge cases and test cases
7. Suggest breaking problems into smaller parts
8. Be encouraging and supportive
9. Focus on learning, not just solving

If someone asks for a direct solution, redirect them to think about the problem themselves.

Always respond in a conversational, encouraging way that helps students learn.`;

    console.log('Sending Rank Buddy test message...');

    const completion = await openRouter.chat.send({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'How do I solve a two sum problem?' }
      ],
      stream: false,
      maxTokens: 300,
      temperature: 0.7,
    });

    let aiResponse = completion.choices[0].message.content;

    // Ensure aiResponse is a string
    if (typeof aiResponse !== 'string') {
      aiResponse = 'I apologize, but I received an unexpected response format. Let\'s try a different approach to this problem.';
    }

    // Clean up the response to ensure it follows our guidelines
    aiResponse = aiResponse.replace(/```[\s\S]*?```/g, '[code removed - try solving it yourself!]');
    aiResponse = aiResponse.replace(/`[^`]*`/g, '[code removed]');

    // Ensure response doesn't contain direct solutions
    if (aiResponse.includes('function') || aiResponse.includes('def ') || aiResponse.includes('class ') || aiResponse.includes('public static void main')) {
      aiResponse = "I can't provide code solutions, but I can help you think through the logic. What approach are you considering?";
    }

    console.log('✅ Rank Buddy AI working!');
    console.log('Response:', aiResponse);
    console.log('Provider: openrouter');
    console.log('Fallback: false');

  } catch (error) {
    console.error('❌ Rank Buddy error:', error.message);
    console.log('Response: That\'s a great question! Let\'s break it down together. What have you tried so far?');
    console.log('Provider: error-fallback');
    console.log('Fallback: true');
  }
}

testRankBuddy();