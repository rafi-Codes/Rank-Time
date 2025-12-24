// src/app/api/users/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId } = await request.json();

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        { message: 'Valid target user ID is required' },
        { status: 400 }
      );
    }

    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { message: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already following
    const currentUser = await User.findById(session.user.id);
    if (currentUser.following.includes(targetUserId)) {
      return NextResponse.json(
        { message: 'Already following this user' },
        { status: 400 }
      );
    }

    // Add to following list
    await User.findByIdAndUpdate(session.user.id, {
      $push: { following: targetUserId }
    });

    return NextResponse.json({
      message: 'Successfully followed user',
      targetUser: {
        id: targetUser._id,
        name: targetUser.name,
        usertag: targetUser.usertag
      }
    });
  } catch (error) {
    console.error('Follow user error:', error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        { message: 'Valid target user ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Remove from following list
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { following: targetUserId }
    });

    return NextResponse.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}