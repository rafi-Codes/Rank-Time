import { NextRequest } from 'next/server';
import { CodeforcesClientError, getCodeforcesProfile } from '@/lib/codeforcesClient';
import { successResponse } from '@/lib/apiResponse';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';

export const dynamic = 'force-dynamic';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');
  const limit = Number(searchParams.get('limit') ?? 100);

  if (!handle) {
    throw new ApiError('MISSING_HANDLE', 'Handle parameter is required', 400);
  }

  try {
    const profile = await getCodeforcesProfile(handle, Number.isFinite(limit) ? limit : 100);
    return successResponse(profile, 'Codeforces profile fetched');
  } catch (error) {
    if (error instanceof CodeforcesClientError) {
      throw new ApiError(error.code, error.message, error.statusCode);
    }
    throw error;
  }
});