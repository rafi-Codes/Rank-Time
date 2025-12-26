import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { generateChallengesForUser } from '@/lib/challenges';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Generating weekly challenges for user:', user.email);

    // Generate weekly challenges for this user
    await generateChallengesForUser(user._id, { daily: false, weekly: true });

    return NextResponse.json({
      success: true,
      message: 'Weekly challenges generated successfully'
    });
  } catch (error) {
    console.error('Error generating weekly challenges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}