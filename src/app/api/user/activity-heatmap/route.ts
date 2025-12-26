import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import UserActivity from '@/models/UserActivity';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find the user by email
    const User = (await import('@/models/User')).default;
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const activityType = searchParams.get('type'); // Optional filter

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
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Build query
    let query: any = {
      userId: user._id,
      createdAt: { $gte: startDate }
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

    // Fill in missing dates with zero activity
    const heatmapData = [];
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

    // Calculate statistics
    const totalActivities = activities.reduce((sum, activity) => sum + activity.totalSessions, 0);
    const totalPoints = activities.reduce((sum, activity) => sum + (activity.totalSessions * 10), 0);
    const totalTime = activities.reduce((sum, activity) => sum + activity.totalTime, 0);
    const averageDaily = totalActivities / heatmapData.length;

    // Find most active day
    const mostActiveDay = activities.reduce((max, activity) =>
      activity.totalSessions > max.totalSessions ? activity : max,
      { _id: '', totalSessions: 0, totalTime: 0, averageScore: 0, activities: [] }
    );

    return NextResponse.json({
      heatmapData,
      statistics: {
        totalActivities,
        totalPoints,
        totalTime,
        averageDaily: Math.round(averageDaily * 10) / 10,
        mostActiveDay: mostActiveDay._id,
        period
      }
    });
  } catch (error) {
    console.error('Error fetching activity heatmap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}