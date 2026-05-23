import { NextResponse } from 'next/server';
import { getOpenRouterHealth } from '@/lib/openRouterClient';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await getOpenRouterHealth();

  return NextResponse.json(
    successResponse(
      health,
      health.healthy ? 'OpenRouter health check passed' : 'OpenRouter health check degraded',
      200
    ),
    { status: 200 }
  );
}
