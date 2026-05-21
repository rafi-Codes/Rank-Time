import { OpenRouter } from '@openrouter/sdk';
import { getCachedValue, setCachedValue } from '@/lib/cache';
import { logger } from '@/lib/logger';
import {
  hashRequest,
  isCircuitOpen,
  recordCircuitFailure,
  recordCircuitSuccess,
  retryWithBackoff,
} from '@/lib/resilience';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  stream?: false;
};

type SendOpenRouterChatInput = {
  circuitName: string;
  request: ChatRequest;
  fallback: string;
  cacheKeyParts: unknown[];
  timeoutMs?: number;
};

declare global {
  // eslint-disable-next-line no-var
  var _rankTimeOpenRouter: OpenRouter | undefined;
}

function getOpenRouter() {
  if (!process.env.OPENROUTER_API_KEY) return null;
  if (!global._rankTimeOpenRouter) {
    global._rankTimeOpenRouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
  return global._rankTimeOpenRouter;
}

export async function sendOpenRouterChat({
  circuitName,
  request,
  fallback,
  cacheKeyParts,
  timeoutMs = 15000,
}: SendOpenRouterChatInput) {
  const cacheKey = `openrouter:${hashRequest(cacheKeyParts)}`;
  const cached = await getCachedValue<{ content: string; provider: string; fallback: boolean }>(cacheKey);
  if (cached) return cached;

  const openRouter = getOpenRouter();
  if (!openRouter || isCircuitOpen(circuitName)) {
    return { content: fallback, provider: 'fallback', fallback: true };
  }

  const startedAt = Date.now();
  try {
    const completion = await retryWithBackoff(
      () => openRouter.chat.send(request),
      { retries: 3, baseDelayMs: 1000, timeoutMs }
    );

    const content = completion.choices[0]?.message?.content;
    const result = {
      content: typeof content === 'string' ? content : fallback,
      provider: 'openrouter',
      fallback: typeof content !== 'string',
    };

    recordCircuitSuccess(circuitName);
    await setCachedValue(cacheKey, result, 24 * 60 * 60);
    logger.info('OpenRouter request completed', {
      circuitName,
      durationMs: Date.now() - startedAt,
      success: true,
    });
    return result;
  } catch (error) {
    recordCircuitFailure(circuitName);
    logger.warn('OpenRouter request failed', {
      circuitName,
      durationMs: Date.now() - startedAt,
      error,
    });
    return { content: fallback, provider: 'fallback', fallback: true };
  }
}
