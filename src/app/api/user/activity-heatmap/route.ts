import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import UserActivity from '@/models/UserActivity';
import User from '@/models/User';
import { getCachedValue, setCachedValue } from '@/lib/cache';
import { successResponse } from '@/lib/apiResponse';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';

export const GET = withErrorHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new ApiError('UNAUTHORIZED', 'Unauthorized', 401);
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found', 404);
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const activityType = searchParams.get('type'); // Optional filter
    const sparse = searchParams.get('sparse') === 'true';

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        throw new ApiError('INVALID_PERIOD', 'Period must be one of 7d, 30d, 90d, or 1y', 400);
    }

    const cacheKey = `activity-heatmap:${user._id}:${period}:${activityType || 'all'}:${sparse}`;
    const cached = await getCachedValue<unknown>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Activity heatmap fetched');
    }

    const query: Record<string, unknown> = {
      userId: user._id,
      date: { $gte: startDate, $lte: now }
    };

    if (activityType) {
      query.activityType = activityType;
    }

    // Aggregate activities by date
    const activities = await UserActivity.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalSessions: { $sum: '$sessions' },
          totalTime: { $sum: '$totalTime' },
          averageScore: { $avg: '$averageScore' },
          activities: {
            $push: {
              sessions: '$sessions',
              totalTime: '$totalTime',
              averageScore: '$averageScore',
              topics: '$topics',
              time: '$createdAt'
            }
          }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Create a map of date -> activity data
    const activityMap: { [key: string]: any } = {};
    activities.forEach(activity => {
      activityMap[activity._id] = {
        date: activity._id,
        count: activity.totalSessions,
        points: activity.totalSessions * 10, // Simple points calculation
        totalTime: activity.totalTime,
        averageScore: activity.averageScore,
        activities: activity.activities
      };
    });

    const heatmapData = sparse ? Object.values(activityMap) : [];

    if (!sparse) {
      const currentDate = new Date(startDate);
      while (currentDate <= now) {
        const dateStr = currentDate.toISOString().split('T')[0];
        heatmapData.push({
          date: dateStr,
          count: activityMap[dateStr]?.count || 0,
          points: activityMap[dateStr]?.points || 0,
          totalTime: activityMap[dateStr]?.totalTime || 0,
          averageScore: activityMap[dateStr]?.averageScore || 0,
          activities: activityMap[dateStr]?.activities || []
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Calculate statistics
    const totalActivities = activities.reduce((sum, activity) => sum + activity.totalSessions, 0);
    const totalPoints = activities.reduce((sum, activity) => sum + (activity.totalSessions * 10), 0);
    const totalTime = activities.reduce((sum, activity) => sum + activity.totalTime, 0);
    const averageDaily = heatmapData.length > 0 ? totalActivities / heatmapData.length : 0;

    // Find most active day
    const mostActiveDay = activities.reduce((max, activity) =>
      activity.totalSessions > max.totalSessions ? activity : max,
      { _id: '', totalSessions: 0, totalTime: 0, averageScore: 0, activities: [] }
    );

    const result = {
      heatmapData,
      statistics: {
        totalActivities,
        totalPoints,
        totalTime,
        averageDaily: Math.round(averageDaily * 10) / 10,
        mostActiveDay: mostActiveDay._id,
        period
      }
    };

    await setCachedValue(cacheKey, result, 60 * 60);
    return successResponse(result, 'Activity heatmap fetched');
});