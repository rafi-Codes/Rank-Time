// src/app/api/user/connect-codeforces/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { handle } = await request.json();
    if (!handle || typeof handle !== 'string') {
      return NextResponse.json({ error: 'Valid handle is required' }, { status: 400 });
    }

    // Validate handle with Codeforces API
    const userResponse = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
      {
        headers: {
          'User-Agent': 'RankTime-App/1.0',
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid Codeforces handle' },
        { status: 400 }
      );
    }

    const userData = await userResponse.json();
    if (userData.status !== 'OK' || !userData.result || userData.result.length === 0) {
      return NextResponse.json(
        { error: 'Codeforces handle not found' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { codeforcesHandle: handle },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      handle: user.codeforcesHandle,
      message: 'Codeforces account connected successfully'
    });
  } catch (error: any) {
    console.error('Error connecting Codeforces:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to connect Codeforces account' },
      { status: 500 }
    );
  }
}