import { OpenRouter } from '@openrouter/sdk';
import crypto from 'crypto';
import { redisGet, redisSet, redisIncr, redisExpire, redisDel, getRedisClient } from './redisClient';
import { logger } from './logger';

const CACHE_TTL_SECONDS = 24 * 60 * 60;
const CIRCUIT_FAILURE_WINDOW = 5 * 60; // 5 minutes
const CIRCUIT_FAILURE_THRESHOLD = 5;
const CIRCUIT_OPEN_SECONDS = 5 * 60; // 5 minutes

function generateRequestHash(payload: unknown) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

function getRandomJitter(base: number) {
  return Math.floor(Math.random() * base);
}

async function isCircuitOpen() {
  if (!getRedisClient()) return false;
  const openUntil = await redisGet('openrouter:circuitOpenUntil');
  if (!openUntil) return false;
  return Number(openUntil) > Date.now();
}

async function recordFailure() {
  if (!getRedisClient()) return;
  const failures = Number(await redisIncr('openrouter:failureCount') ?? 0);
  if (failures === 1) {
    await redisExpire('openrouter:failureCount', CIRCUIT_FAILURE_WINDOW);
  }
  if ((failures ?? 0) >= CIRCUIT_FAILURE_THRESHOLD) {
    await redisSet('openrouter:circuitOpenUntil', String(Date.now() + CIRCUIT_OPEN_SECONDS * 1000), CIRCUIT_OPEN_SECONDS);
  }
}

async function clearFailures() {
  if (!getRedisClient()) return;
  await redisDel('openrouter:failureCount');
  await redisDel('openrouter:circuitOpenUntil');
}

function createOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }
  return new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
}

export type OpenRouterChatRequest = {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
  temperature?: number;
};

export type OpenRouterChatResponse = {
  response: string;
  provider: string;
  cached: boolean;
};

export function createOpenRouterFallback(contextSummary?: string): OpenRouterChatResponse {
  const fallback = contextSummary
    ? `I can't reach the AI service right now, but I can still help you think through ${contextSummary}. Let's start from the main problem and your first idea.`
    : 'I can’t reach the AI service right now. Please try again in a few minutes.';

  return {
    response: fallback,
    provider: 'fallback',
    cached: false,
  };
}

export async function getOpenRouterHealth() {
  if (!process.env.OPENROUTER_API_KEY) {
    return {
      healthy: false,
      provider: 'openrouter',
      message: 'OPENROUTER_API_KEY is not configured',
      circuitOpen: false,
    };
  }

  const circuitOpen = await isCircuitOpen();
  return {
    healthy: !circuitOpen,
    provider: 'openrouter',
    message: circuitOpen ? 'OpenRouter circuit breaker is open' : 'OpenRouter configured and ready',
    circuitOpen,
  };
}

export async function callOpenRouterChat(requestPayload: OpenRouterChatRequest) {
  const requestHash = generateRequestHash(requestPayload);
  const cacheKey = `openrouter:chat:${requestHash}`;

  const cachedValue = await redisGet(cacheKey);
  if (cachedValue) {
    return {
      response: cachedValue,
      provider: 'openrouter',
      cached: true,
    };
  }

  if (await isCircuitOpen()) {
    return createOpenRouterFallback('your Rank Buddy request');
  }

  const client = createOpenRouterClient();
  const timeoutMs = 15_000;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const start = Date.now();
      const sendPromise = client.chat.send({
        model: requestPayload.model,
        messages: requestPayload.messages,
        maxTokens: requestPayload.maxTokens ?? 800,
        temperature: requestPayload.temperature ?? 0.7,
        stream: false,
      });

      const result = await Promise.race([
        sendPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('OpenRouter request timed out')), timeoutMs)
        ),
      ]);

      const duration = Date.now() - start;
      logger.info('OpenRouter request completed', { duration, attempt });

      const content = (result as any)?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid OpenRouter response format');
      }

      const responseText = content.trim();
      await redisSet(cacheKey, responseText, CACHE_TTL_SECONDS);
      await clearFailures();
      return { response: responseText, provider: 'openrouter', cached: false };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown OpenRouter error');
      logger.error('OpenRouter request failed', { attempt, error: lastError });
      await recordFailure();
      const backoff = 1000 * 2 ** attempt + getRandomJitter(500);
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  logger.error('OpenRouter all retries failed', lastError);
  return createOpenRouterFallback('your Rank Buddy request');
}
