// src/app/api/rankbuddy/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenRouter } from '@openrouter/sdk';

// Helper function to get fallback responses
function getFallbackResponse() {
  const fallbackResponses = [
    "That's a great question! Let's break it down together. What have you tried so far?",
    "I'm here to guide you through this. What's your initial approach to solving this problem?",
    "Let's think about this systematically. What are the key requirements?",
    "Have you considered the different ways to approach this problem?",
    "What concepts or techniques do you think might be relevant here?",
    "Let's explore this together. What's the first step that comes to mind?"
  ];

  const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

  return NextResponse.json({
    response: randomResponse,
    fallback: true,
    provider: 'error-fallback'
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { message, context, stream = false } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    // Initialize OpenRouter
    const openRouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Create a prompt that ensures the AI never gives direct answers
    const systemPrompt = `You are Rank Buddy, an AI coding tutor who NEVER gives direct answers or solutions to coding problems. Your role is to guide students through hints, questions, and learning techniques.

RULES:
1. NEVER provide code solutions or direct answers
2. Ask guiding questions to help students think
3. Give hints about concepts and approaches
4. Suggest debugging techniques
5. Encourage algorithmic thinking
6. Point to relevant data structures or algorithms
7. Ask about edge cases and test cases
8. Suggest breaking problems into smaller parts
9. Be encouraging and supportive
10. Focus on learning, not just solving

If someone asks for a direct solution, redirect them to think about the problem themselves.

Always respond in a conversational, encouraging way that helps students learn.`;

    // Prepare messages for OpenRouter
    const messages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if available
    if (context && context.length > 0) {
      // Take last 5 messages to keep context manageable
      const recentContext = context.slice(-5);
      recentContext.forEach((msg: any) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    try {
      const completion = await openRouter.chat.send({
        model: 'openai/gpt-4o',
        messages: messages,
        stream: false,
        maxTokens: 1024,
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

      return NextResponse.json({
        response: aiResponse,
        fallback: false,
        provider: 'openrouter'
      });

    } catch (error: any) {
      console.error('OpenRouter error:', error);

      // Fallback response
      return getFallbackResponse();
    }

  } catch (error) {
    console.error('Error in Rank Buddy chat:', error);

    // Fallback response
    return getFallbackResponse();
  }
}