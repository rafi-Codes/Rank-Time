import { NextResponse } from 'next/server';
import { getEmailQueueHealth } from '@/lib/emailQueue';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await getEmailQueueHealth();
  if (!health.healthy) {
    return NextResponse.json(
      errorResponse('EMAIL_QUEUE_HEALTH_CHECK_FAILED', health.message, 503, health),
      { status: 503 }
    );
  }

  return NextResponse.json(
    successResponse(health, 'Email queue health check passed', 200),
    { status: 200 }
  );
}
