import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOpenRouterChat } from '@/lib/openRouterClient';
import { successResponse } from '@/lib/apiResponse';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';

// Helper function to get fallback responses
function getFallbackResponse(message?: string) {
  const fallbackResponses = [
    message ? `Let's reason about "${message.slice(0, 80)}" step by step. What constraints or edge cases stand out first?` : "Let's break it down together. What have you tried so far?",
    "Start by identifying the input size, constraints, and the simplest brute-force approach before optimizing.",
    "Try writing down the invariant you need to preserve, then test it against a small example.",
    "Have you considered the different ways to approach this problem?",
    "What concepts or techniques do you think might be relevant here?",
    "Compare a few sample cases manually and look for repeated subproblems or monotonic behavior."
  ];

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

export const POST = withErrorHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new ApiError('UNAUTHORIZED', 'Unauthorized', 401);
    }

    const { message, context } = await request.json();

    if (!message || typeof message !== 'string') {
      throw new ApiError('MISSING_MESSAGE', 'Message is required', 400);
    }

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

    const messages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(context) && context.length > 0) {
      const recentContext = context.slice(-5);
      recentContext.forEach((msg: unknown) => {
        if (msg && typeof msg === 'object' && 'content' in msg && typeof msg.content === 'string') {
          messages.push({
            role: 'role' in msg && msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await sendOpenRouterChat({
      circuitName: 'rankbuddy-chat',
      cacheKeyParts: ['rankbuddy-chat', messages],
      fallback: getFallbackResponse(message),
      request: {
        model: 'openai/gpt-4o',
        messages: messages,
        stream: false,
        maxTokens: 1024,
        temperature: 0.7,
      },
    });

    let aiResponse = completion.content;

    aiResponse = aiResponse.replace(/```[\s\S]*?```/g, '[code removed - try solving it yourself!]');
    aiResponse = aiResponse.replace(/`[^`]*`/g, '[code removed]');

    if (aiResponse.includes('function') || aiResponse.includes('def ') || aiResponse.includes('class ') || aiResponse.includes('public static void main')) {
      aiResponse = "I can't provide code solutions, but I can help you think through the logic. What approach are you considering?";
    }

    return successResponse({
        response: aiResponse,
        fallback: completion.fallback,
        provider: completion.provider
      }, 'Rank Buddy response generated');
});
