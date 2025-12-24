// src/app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'totalScore';
    const timeRange = searchParams.get('timeRange') || 'all';

    let users = await User.find({}).select(
      'name email totalScore currentStreak maxStreak rank league totalSessions'
    );

    // Calculate time-based stats if needed
    if (timeRange !== 'all') {
      const startDate = new Date();
      if (timeRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (timeRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      }

      // Get sessions within time range for each user
      for (const user of users) {
        const sessions = await Session.find({
          userId: user._id,
          createdAt: { $gte: startDate }
        });

        if (sortBy === 'totalScore') {
          user.totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
        } else if (sortBy === 'averageScore') {
          user.averageScore = sessions.length > 0
            ? sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length
            : 0;
        } else if (sortBy === 'totalSessions') {
          user.totalSessions = sessions.length;
        }
      }
    }

    // Calculate average score for all users
    for (const user of users) {
      if (!user.averageScore) {
        const sessions = await Session.find({ userId: user._id });
        user.averageScore = sessions.length > 0
          ? sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length
          : 0;
      }
    }

    // Sort users based on the selected criteria
    users.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'totalScore':
          aValue = a.totalScore;
          bValue = b.totalScore;
          break;
        case 'currentStreak':
          aValue = a.currentStreak;
          bValue = b.currentStreak;
          break;
        case 'maxStreak':
          aValue = a.maxStreak;
          bValue = b.maxStreak;
          break;
        case 'averageScore':
          aValue = a.averageScore;
          bValue = b.averageScore;
          break;
        case 'totalSessions':
          aValue = a.totalSessions;
          bValue = b.totalSessions;
          break;
        default:
          aValue = a.totalScore;
          bValue = b.totalScore;
      }

      return bValue - aValue; // Descending order
    });

    // Update ranks
    users.forEach((user, index) => {
      user.rank = index + 1;
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}