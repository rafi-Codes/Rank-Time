import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import { successResponse } from '@/lib/apiResponse';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';
import { getCachedValue, setCachedValue } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'Unauthorized', 401);
    }

    const { targetUserId } = await request.json();

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      throw new ApiError('INVALID_TARGET_USER', 'Valid target user ID is required', 400);
    }

    if (targetUserId === session.user.id) {
      throw new ApiError('CANNOT_FOLLOW_SELF', 'Cannot follow yourself', 400);
    }

    const idempotencyKey = request.headers.get('idempotency-key');
    const cacheKey = idempotencyKey ? `follow:${session.user.id}:${idempotencyKey}` : null;
    if (cacheKey) {
      const cached = await getCachedValue<{ targetUser: unknown }>(cacheKey);
      if (cached) {
        return successResponse(cached, 'Successfully followed user');
      }
    }

    await connectDB();

    const targetUser = await User.findById(targetUserId).select('name usertag');
    if (!targetUser) {
      throw new ApiError('USER_NOT_FOUND', 'User not found', 404);
    }

    const currentUser = await User.findOneAndUpdate(
      { _id: session.user.id, following: { $ne: targetUserId } },
      { $addToSet: { following: targetUserId } },
      { new: true }
    );

    if (!currentUser) {
      const exists = await User.exists({ _id: session.user.id });
      if (!exists) {
        throw new ApiError('USER_NOT_FOUND', 'User not found', 404);
      }
      throw new ApiError('ALREADY_FOLLOWING', 'Already following this user', 400);
    }

    const response = {
      targetUser: {
        id: targetUser._id,
        name: targetUser.name,
        usertag: targetUser.usertag
      }
    };
    if (cacheKey) {
      await setCachedValue(cacheKey, response, 24 * 60 * 60);
    }

    return successResponse(response, 'Successfully followed user');
});

export const DELETE = withErrorHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      throw new ApiError('INVALID_TARGET_USER', 'Valid target user ID is required', 400);
    }

    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
      $pull: { following: targetUserId }
    });

    return successResponse({ targetUserId }, 'Successfully unfollowed user');
});
