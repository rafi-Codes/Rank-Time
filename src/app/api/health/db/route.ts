import { NextResponse } from 'next/server';
import { isDbHealthy } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const result = await isDbHealthy();

  if (!result.ok) {
    return NextResponse.json(
      errorResponse('DB_HEALTH_CHECK_FAILED', 'Database health check failed', 503, {
        state: result.state,
        error: result.error,
      }),
      { status: 503 }
    );
  }

  return NextResponse.json(
    successResponse({ database: { state: result.state } }, 'Database connection healthy', 200),
    { status: 200 }
  );
}
