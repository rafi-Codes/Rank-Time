// src/app/api/user/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Get recent sessions for additional stats
    const recentSessions = await Session.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate additional stats
    const allSessions = await Session.find({ userId: user._id });

    const totalTime = allSessions.reduce((sum, session) => sum + session.totalTime, 0);
    const averageScore = allSessions.length > 0
      ? allSessions.reduce((sum, session) => sum + session.score, 0) / allSessions.length
      : 0;

    const averageRating = allSessions.length > 0
      ? allSessions.reduce((sum, session) => sum + session.problemRating, 0) / allSessions.length
      : 0;

    // Calculate league progress
    const leagueThresholds = {
      'Beginner': 0,
      'Intermediate': 500,
      'Advanced': 1000,
      'Expert': 2500,
      'Master': 5000,
      'Legend': 10000
    };

    const leagues = Object.keys(leagueThresholds);
    const currentLeagueIndex = leagues.indexOf(user.league);
    const nextLeague = currentLeagueIndex < leagues.length - 1 ? leagues[currentLeagueIndex + 1] : null;
    const nextThreshold = nextLeague ? leagueThresholds[nextLeague as keyof typeof leagueThresholds] : null;
    const currentThreshold = leagueThresholds[user.league as keyof typeof leagueThresholds] || 0;

    const leagueProgress = nextThreshold
      ? ((user.totalScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100
      : 100;

    const stats = {
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        totalScore: user.totalScore,
        currentStreak: user.currentStreak,
        maxStreak: user.maxStreak,
        rank: user.rank,
        league: user.league,
        totalSessions: user.totalSessions
      },
      additionalStats: {
        totalTime,
        averageScore: Math.round(averageScore),
        averageRating: Math.round(averageRating),
        leagueProgress: Math.min(100, Math.max(0, leagueProgress)),
        nextLeague,
        nextThreshold
      },
      recentSessions
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}