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

    // Database must be healthy; optional services can be degraded
    const healthy = db.ok;
    const payload = {
      db,
      openRouter,
      email,
    };

    if (!healthy) {
      return NextResponse.json(
        errorResponse('SYSTEM_HEALTH_CHECK_FAILED', 'Database is unavailable', 503, payload),
        { status: 503 }
      );
    }

    // If database is OK but optional services are down, return 200 with degraded status
    const allServicesHealthy = db.ok && openRouter.healthy && email.healthy;
    const statusCode = allServicesHealthy ? 200 : 200;
    const message = allServicesHealthy ? 'System health check passed' : 'System healthy but some optional services degraded';

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

