import { logger } from './logger';

export async function measureExecution<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const durationMs = Date.now() - start;
    logger.info(`Metric: ${label}`, { durationMs, success: true });
    return result;
  } catch (error) {
    const durationMs = Date.now() - start;
    logger.warn(`Metric: ${label}`, {
      durationMs,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export function recordMetric(event: string, value: number, meta?: Record<string, unknown>) {
  logger.debug(`Metric record: ${event}`, { value, ...meta });
}
