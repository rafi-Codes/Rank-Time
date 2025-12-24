// src/app/api/users/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { message: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Search for users by usertag or name (case-insensitive)
    const users = await User.find({
      $and: [
        {
          $or: [
            { usertag: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } }
          ]
        },
        { _id: { $ne: session.user.id } } // Exclude current user
      ]
    })
    .select('name usertag image league totalScore')
    .limit(20);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('User search error:', error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}