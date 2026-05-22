import { NextResponse } from 'next/server';
import { errorResponse } from './apiResponse';
import { logger, createCorrelationId } from './logger';

function getCorrelationId() {
  const possible = (globalThis as any)?.__requestCorrelationId;
  return (
    typeof possible === 'string' && possible.length > 0
      ? possible
      : createCorrelationId()
  );
}

export async function withErrorHandler<T>(
  handler: () => Promise<T>,
  opts?: {
    fallbackCode?: string;
    fallbackMessage?: string;
  }
) {
  try {
    const result = await handler();
    if (result instanceof Response) {
      return result;
    }
    return NextResponse.json(result as any);
  } catch (err) {
    const correlationId = getCorrelationId();
    const errorMessage = err instanceof Error ? err.message : String(err);

    logger.error('API handler error', {
      correlationId,
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
    });

    const code = opts?.fallbackCode ?? 'INTERNAL_ERROR';
    const message = opts?.fallbackMessage ?? 'Internal server error';

    return NextResponse.json(
      errorResponse(code, message, 500),
      { status: 500 }
    );
  }
}

