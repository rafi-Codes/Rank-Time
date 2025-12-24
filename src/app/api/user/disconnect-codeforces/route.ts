// src/app/api/user/disconnect-codeforces/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $unset: { codeforcesHandle: 1 } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Codeforces account disconnected successfully'
    });
  } catch (error: any) {
    console.error('Error disconnecting Codeforces:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Codeforces account' },
      { status: 500 }
    );
  }
}