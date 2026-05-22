import { NextResponse } from 'next/server';
import { isDbHealthy } from '@/lib/db';
import { getOpenRouterHealth } from '@/lib/openRouterClient';
import { getEmailQueueHealth } from '@/lib/emailQueue';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await isDbHealthy();
  const openRouter = await getOpenRouterHealth();
  const email = await getEmailQueueHealth();

  const healthy = db.ok && openRouter.healthy && email.healthy;
  const payload = {
    db,
    openRouter,
    email,
  };

  if (!healthy) {
    return NextResponse.json(
      errorResponse('SYSTEM_HEALTH_CHECK_FAILED', 'One or more services are degraded', 503, payload),
      { status: 503 }
    );
  }

  return NextResponse.json(
    successResponse(payload, 'System health check passed', 200),
    { status: 200 }
  );
}
