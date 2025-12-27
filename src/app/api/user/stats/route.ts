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
    console.log('User stats API called');
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Connecting to database...');
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get recent sessions for additional stats
    const recentSessions = await Session.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate current rank based on totalScore
    const allUsers = await User.find({}).select('totalScore');
    const sortedUsers = allUsers.sort((a, b) => b.totalScore - a.totalScore);
    const currentUserRank = sortedUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;

    // Calculate additional stats
    const allSessions = await Session.find({ user: user._id });

    const totalTime = allSessions.reduce((sum, session) => sum + (session.totalTime || 0), 0);
    const totalScore = allSessions.reduce((sum, session) => sum + (session.score || 0), 0);
    const totalRating = allSessions.reduce((sum, session) => sum + (session.problemRating || 0), 0);

    const averageScore = allSessions.length > 0 ? totalScore / allSessions.length : 0;
    const averageRating = allSessions.length > 0 ? totalRating / allSessions.length : 0;

    // Calculate league progress
    const leagueThresholds = {
      'Beginner': 0,
      'Intermediate': 1200,
      'Advanced': 2500,
      'Expert': 6000,
      'Master': 12000,
      'Legend': 25000
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
        name: user.name || 'User',
        email: user.email,
        usertag: user.usertag || '',
        image: user.image || null,
        totalScore: user.totalScore || 0,
        currentStreak: user.currentStreak || 0,
        maxStreak: user.maxStreak || 0,
        rank: currentUserRank,
        league: user.league || 'Beginner',
        totalSessions: user.totalSessions || 0
      },
      additionalStats: {
        totalTime: totalTime || 0,
        averageScore: Math.round(averageScore || 0),
        averageRating: Math.round(averageRating || 0),
        leagueProgress: Math.min(100, Math.max(0, leagueProgress || 0)),
        nextLeague,
        nextThreshold
      },
      recentSessions: recentSessions || []
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}