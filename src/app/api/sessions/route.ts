import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import { successResponse } from '@/lib/apiResponse';
import { sessionSchema } from '@/lib/validation';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';
import { createSessionForUser } from '@/services/sessionService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandler(async (request: NextRequest, { correlationId }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new ApiError('UNAUTHORIZED', 'Unauthorized', 401);
  }

  await connectDB();

  const body = await request.json();
  const input = sessionSchema.parse(body);
  const result = await createSessionForUser(session.user.email, input, correlationId);

  if (!result) {
    throw new ApiError('USER_NOT_FOUND', 'User not found', 404);
  }

  return successResponse(
    {
      session: result.session,
      scoreBreakdown: result.scoreBreakdown,
    },
    'Session saved successfully'
  );
});

export const GET = withErrorHandler(async (_request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new ApiError('UNAUTHORIZED', 'Unauthorized', 401);
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    throw new ApiError('USER_NOT_FOUND', 'User not found', 404);
  }

  const sessions = await Session.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  return successResponse(sessions, 'Sessions fetched');
});
