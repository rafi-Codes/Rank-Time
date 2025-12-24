// src/app/api/user/update-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { avatarUrl } = await request.json();

    if (!avatarUrl) {
      return NextResponse.json({ message: 'Avatar URL is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { image: avatarUrl },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Avatar updated successfully',
      avatar: user.image
    });

  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}