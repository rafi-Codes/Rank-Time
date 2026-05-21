import crypto from 'crypto';

type RetryOptions = {
  retries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
  jitterMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
};

type CircuitState = {
  failures: number[];
  openUntil: number;
};

declare global {
  // eslint-disable-next-line no-var
  var _rankTimeCircuitBreakers: Map<string, CircuitState> | undefined;
}

const circuits = global._rankTimeCircuitBreakers ?? new Map<string, CircuitState>();
global._rankTimeCircuitBreakers = circuits;

export function hashRequest(value: unknown) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(operation: () => Promise<T>, timeoutMs?: number): Promise<T> {
  if (!timeoutMs) return operation();

  return Promise.race([
    operation(),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  {
    retries = 3,
    baseDelayMs = 1000,
    timeoutMs,
    jitterMs = 250,
    shouldRetry = () => true,
  }: RetryOptions = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await withTimeout(operation, timeoutMs);
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !shouldRetry(error, attempt)) break;

      const jitter = Math.floor(Math.random() * jitterMs);
      await wait(baseDelayMs * 2 ** attempt + jitter);
    }
  }

  throw lastError;
}

export function isCircuitOpen(name: string) {
  const state = circuits.get(name);
  return Boolean(state && state.openUntil > Date.now());
}

export function recordCircuitSuccess(name: string) {
  circuits.delete(name);
}

export function recordCircuitFailure(
  name: string,
  {
    maxFailures = 5,
    windowMs = 5 * 60 * 1000,
    openMs = 5 * 60 * 1000,
  } = {}
) {
  const now = Date.now();
  const state = circuits.get(name) ?? { failures: [], openUntil: 0 };
  const failures = [...state.failures.filter((time) => now - time <= windowMs), now];
  circuits.set(name, {
    failures,
    openUntil: failures.length > maxFailures ? now + openMs : state.openUntil,
  });
}
