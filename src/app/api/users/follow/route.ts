import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(errorResponse('UNAUTHORIZED', 'Unauthorized', 401), { status: 401 });
    }

    const { targetUserId } = await request.json();

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(errorResponse('INVALID_INPUT', 'Valid target user ID is required', 400), { status: 400 });
    }

    if (targetUserId === session.user.id) {
      return NextResponse.json(errorResponse('INVALID_ACTION', 'Cannot follow yourself', 400), { status: 400 });
    }

    await connectDB();

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(errorResponse('TARGET_NOT_FOUND', 'User not found', 404), { status: 404 });
    }

    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(errorResponse('USER_NOT_FOUND', 'Current user not found', 404), { status: 404 });
    }

    const isAlreadyFollowing = currentUser.following.some(
      (followedUserId: mongoose.Types.ObjectId) => followedUserId.toString() === targetUserId
    );

    if (isAlreadyFollowing) {
      return NextResponse.json(errorResponse('ALREADY_FOLLOWING', 'Already following this user', 400), { status: 400 });
    }

    await User.updateOne(
      { _id: currentUser._id },
      { $addToSet: { following: targetUserId } }
    );

    return NextResponse.json(successResponse({
      targetUser: {
        id: targetUser._id.toString(),
        name: targetUser.name,
        usertag: targetUser.usertag,
      },
    }, 'Successfully followed user', 200), { status: 200 });
  }, {
    fallbackCode: 'FOLLOW_UPDATE_FAILED',
    fallbackMessage: 'Unable to follow user',
  });
}

export async function DELETE(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(errorResponse('UNAUTHORIZED', 'Unauthorized', 401), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(errorResponse('INVALID_INPUT', 'Valid target user ID is required', 400), { status: 400 });
    }

    await connectDB();

    await User.updateOne(
      { _id: session.user.id },
      { $pull: { following: targetUserId } }
    );

    return NextResponse.json(successResponse({}, 'Successfully unfollowed user', 200), { status: 200 });
  }, {
    fallbackCode: 'UNFOLLOW_UPDATE_FAILED',
    fallbackMessage: 'Unable to unfollow user',
  });
}
