import { NextResponse } from 'next/server';
import { isDbHealthy } from '@/lib/db';
import { getOpenRouterHealth } from '@/lib/openRouterClient';
import { getEmailQueueHealth } from '@/lib/emailQueue';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await isDbHealthy();
    
    let openRouter = { healthy: false, provider: 'openrouter', message: 'OpenRouter check failed', circuitOpen: false };
    let email = { healthy: false, message: 'Email queue check failed' };

    try {
      openRouter = await getOpenRouterHealth();
    } catch (error) {
      console.error('OpenRouter health check error:', error);
    }

    try {
      email = await getEmailQueueHealth();
    } catch (error) {
      console.error('Email queue health check error:', error);
    }

    const payload = {
      db,
      openRouter,
      email,
    };

    const statusCode = 200;
    const message = db.ok && openRouter.healthy && email.healthy
      ? 'System health check passed'
      : 'System health check loaded with degraded services';

    return NextResponse.json(
      successResponse(payload, message, statusCode),
      { status: statusCode }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      errorResponse('HEALTH_CHECK_ERROR', 'Failed to check system health', 500, { error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500 }
    );
  }
}

