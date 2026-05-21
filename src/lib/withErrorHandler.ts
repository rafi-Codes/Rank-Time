import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { errorResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 500,
    public details?: unknown
  ) {
    super(message);
  }
}

type RouteContext = {
  correlationId: string;
};

type Handler = (request: NextRequest, context: RouteContext) => Promise<Response>;

export function withErrorHandler(handler: Handler) {
  return async (request: NextRequest) => {
    const correlationId = randomUUID();

    try {
      const response = await handler(request, { correlationId });
      response.headers.set('x-correlation-id', correlationId);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        logger.warn('API request failed', {
          correlationId,
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
        });
        return errorResponse(error.code, error.message, error.statusCode, {
          ...((error.details && typeof error.details === 'object') ? error.details : {}),
          correlationId,
        });
      }

      if (error instanceof ZodError) {
        logger.warn('API validation failed', {
          correlationId,
          details: error.flatten(),
        });
        return errorResponse('VALIDATION_ERROR', 'Invalid request', 400, {
          fields: error.flatten().fieldErrors,
          correlationId,
        });
      }

      logger.error('Unhandled API error', { correlationId, error });
      return errorResponse('INTERNAL_SERVER_ERROR', 'Internal server error', 500, {
        correlationId,
      });
    }
  };
}
