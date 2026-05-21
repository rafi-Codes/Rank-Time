import { NextRequest } from 'next/server';
import { pingDatabase } from '@/lib/db';
import { successResponse } from '@/lib/apiResponse';
import { withErrorHandler } from '@/lib/withErrorHandler';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = withErrorHandler(async (_request: NextRequest) => {
  const health = await pingDatabase();
  return successResponse({ database: health }, 'Database connection healthy');
});
