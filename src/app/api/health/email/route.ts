import { NextResponse } from 'next/server';
import { getEmailQueueHealth } from '@/lib/emailQueue';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await getEmailQueueHealth();

  return NextResponse.json(
    successResponse(
      health,
      health.healthy ? 'Email queue health check passed' : 'Email queue health check degraded',
      200
    ),
    { status: 200 }
  );
}
