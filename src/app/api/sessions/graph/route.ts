// src/app/api/sessions/graph/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await Session.find({
      userId: user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    const graphData = sessions.map(session => ({
      date: session.createdAt.toISOString().split('T')[0],
      score: session.score - session.streakBonus, // Base score without streak bonus
      rating: session.problemRating,
      time: session.totalTime,
      totalTime: session.totalTime
    }));

    return NextResponse.json(graphData);

  } catch (error) {
    console.error('Error fetching graph data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}