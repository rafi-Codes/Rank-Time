import { NextResponse } from 'next/server';
import { getEmailQueueStatus } from '@/lib/emailQueue';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getEmailQueueStatus();

  return NextResponse.json(
    successResponse(
      status,
      status.healthy ? 'Email queue status loaded successfully' : 'Email queue status degraded',
      200
    ),
    { status: 200 }
  );
}
