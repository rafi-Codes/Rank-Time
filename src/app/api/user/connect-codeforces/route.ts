import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { CodeforcesClientError, getCodeforcesProfile } from '@/lib/codeforcesClient';
import { successResponse } from '@/lib/apiResponse';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';

export const dynamic = 'force-dynamic';

export const POST = withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new ApiError('UNAUTHORIZED', 'Unauthorized', 401);
  }

  const { handle } = await request.json();
  if (!handle || typeof handle !== 'string') {
    throw new ApiError('INVALID_CODEFORCES_HANDLE', 'Valid handle is required', 400);
  }

  let profile;
  try {
    profile = await getCodeforcesProfile(handle, 1);
  } catch (error) {
    if (error instanceof CodeforcesClientError) {
      throw new ApiError(error.code, error.message, error.statusCode);
    }
    throw error;
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { codeforcesHandle: profile.user.handle },
    { new: true }
  );

  if (!user) {
    throw new ApiError('USER_NOT_FOUND', 'User not found', 404);
  }

  return successResponse(
    {
      handle: user.codeforcesHandle,
      message: 'Codeforces account connected successfully',
    },
    'Codeforces account connected successfully'
  );
});