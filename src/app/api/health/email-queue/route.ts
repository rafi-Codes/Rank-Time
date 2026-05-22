import { NextResponse } from 'next/server';
import { getEmailQueueStatus } from '@/lib/emailQueue';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getEmailQueueStatus();
  if (!status.healthy) {
    return NextResponse.json(
      errorResponse('EMAIL_QUEUE_STATUS_FAILED', status.message, 503, status),
      { status: 503 }
    );
  }

  return NextResponse.json(
    successResponse(status, 'Email queue status loaded successfully', 200),
    { status: 200 }
  );
}
