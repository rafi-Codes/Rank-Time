import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCachedValue, setCachedValue } from '@/lib/cache';
import { successResponse } from '@/lib/apiResponse';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_SORT_FIELDS = new Set([
  'totalScore',
  'currentStreak',
  'maxStreak',
  'averageScore',
  'totalSessions',
]);

function getStartDate(timeRange: string) {
  const startDate = new Date();
  if (timeRange === 'week') {
    startDate.setDate(startDate.getDate() - 7);
    return startDate;
  }
  if (timeRange === 'month') {
    startDate.setMonth(startDate.getMonth() - 1);
    return startDate;
  }
  return null;
}

type LeaderboardUser = {
  _id: unknown;
  name: string;
  email: string;
  usertag: string;
  totalScore: number;
  currentStreak: number;
  maxStreak: number;
  rank: number;
  league: string;
  totalSessions: number;
  averageScore: number;
};

export const GET = withErrorHandler(async (request: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sort') || 'totalScore';
  const timeRange = searchParams.get('timeRange') || 'all';
  const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0);
  const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 100), 1), 100);

  if (!ALLOWED_SORT_FIELDS.has(sortBy)) {
    throw new ApiError('INVALID_SORT', 'Unsupported leaderboard sort field', 400);
  }

  if (!['all', 'week', 'month'].includes(timeRange)) {
    throw new ApiError('INVALID_TIME_RANGE', 'Unsupported leaderboard time range', 400);
  }

  const cacheKey = `leaderboard:${sortBy}:${timeRange}:${offset}:${limit}`;
  const cached = await getCachedValue<LeaderboardUser[]>(cacheKey);
  if (cached) {
    return successResponse(cached, 'Leaderboard fetched');
  }

  const startedAt = Date.now();
  const startDate = getStartDate(timeRange);
  const sessionMatch = startDate ? [{ $match: { createdAt: { $gte: startDate } } }] : [];

  const scoreFields =
    timeRange === 'all'
      ? {
          totalScore: '$totalScore',
          totalSessions: '$totalSessions',
        }
      : {
          totalScore: { $sum: '$sessions.score' },
          totalSessions: { $size: '$sessions' },
        };

  const users = await User.aggregate<LeaderboardUser>([
    {
      $lookup: {
        from: 'sessions',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
          ...sessionMatch,
          { $project: { score: 1 } },
        ],
        as: 'sessions',
      },
    },
    {
      $addFields: {
        ...scoreFields,
        averageScore: { $ifNull: [{ $avg: '$sessions.score' }, 0] },
      },
    },
    { $sort: { [sortBy]: -1, createdAt: 1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $project: {
        name: 1,
        email: 1,
        usertag: 1,
        totalScore: 1,
        currentStreak: 1,
        maxStreak: 1,
        league: 1,
        totalSessions: 1,
        averageScore: 1,
      },
    },
  ]);

  const ranked = users.map((user, index) => ({
    ...user,
    rank: offset + index + 1,
    averageScore: Math.round((user.averageScore || 0) * 10) / 10,
  }));

  await setCachedValue(cacheKey, ranked, 5 * 60);
  logger.info('Leaderboard fetched', {
    sortBy,
    timeRange,
    offset,
    limit,
    durationMs: Date.now() - startedAt,
  });

  return successResponse(ranked, 'Leaderboard fetched');
});