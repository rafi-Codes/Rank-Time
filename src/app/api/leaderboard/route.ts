// src/app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';
import { redisGet, redisSet } from '@/lib/redisClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CACHE_TTL_SECONDS = 60;

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'totalScore';
    const timeRange = searchParams.get('timeRange') || 'all';
    const cacheKey = `leaderboard:${sortBy}:${timeRange}`;

    const cached = await redisGet(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    const users = await User.find({})
      .select('name email usertag totalScore currentStreak maxStreak rank league totalSessions')
      .lean();

    const startDate = new Date();
    if (timeRange === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    }

    const sessionFilter: Record<string, unknown> = {};
    if (timeRange !== 'all') {
      sessionFilter.createdAt = { $gte: startDate };
    }

    const sessionStats = await Session.aggregate([
      { $match: sessionFilter },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          averageScore: { $avg: '$score' },
          totalSessions: { $sum: 1 }
        }
      }
    ]);

    const statsByUser = sessionStats.reduce<Record<string, { totalScore: number; averageScore: number; totalSessions: number }>>((acc, stat) => {
      acc[String(stat._id)] = {
        totalScore: stat.totalScore ?? 0,
        averageScore: stat.averageScore ?? 0,
        totalSessions: stat.totalSessions ?? 0,
      };
      return acc;
    }, {});

    const results = users.map((user) => {
      const stats = statsByUser[String(user._id)] ?? {
        totalScore: 0,
        averageScore: 0,
        totalSessions: 0,
      };

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        usertag: user.usertag,
        league: user.league,
        currentStreak: user.currentStreak ?? 0,
        maxStreak: user.maxStreak ?? 0,
        rank: user.rank ?? 0,
        totalScore: timeRange === 'all' ? user.totalScore ?? stats.totalScore : stats.totalScore,
        averageScore: stats.averageScore ?? 0,
        totalSessions: stats.totalSessions ?? 0,
      };
    });

    results.sort((a, b) => {
      const aValue = sortBy === 'currentStreak'
        ? a.currentStreak
        : sortBy === 'maxStreak'
        ? a.maxStreak
        : sortBy === 'averageScore'
        ? a.averageScore
        : sortBy === 'totalSessions'
        ? a.totalSessions
        : a.totalScore;

      const bValue = sortBy === 'currentStreak'
        ? b.currentStreak
        : sortBy === 'maxStreak'
        ? b.maxStreak
        : sortBy === 'averageScore'
        ? b.averageScore
        : sortBy === 'totalSessions'
        ? b.totalSessions
        : b.totalScore;

      return bValue - aValue;
    });

    const rankedResults = results.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    await redisSet(cacheKey, JSON.stringify(rankedResults), CACHE_TTL_SECONDS);

    return NextResponse.json(rankedResults);

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}