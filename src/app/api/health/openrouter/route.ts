import { NextResponse } from 'next/server';
import { getOpenRouterHealth } from '@/lib/openRouterClient';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await getOpenRouterHealth();
  if (!health.healthy) {
    return NextResponse.json(
      errorResponse('OPENROUTER_HEALTH_CHECK_FAILED', health.message, 503, health),
      { status: 503 }
    );
  }

  return NextResponse.json(
    successResponse(health, 'OpenRouter health check passed', 200),
    { status: 200 }
  );
}
