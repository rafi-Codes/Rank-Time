import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import UserActivity from '@/models/UserActivity';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

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
      userId: session.user.id,
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
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          activities: {
            $push: {
              type: '$activityType',
              description: '$description',
              points: '$points',
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
        count: activity.count,
        points: activity.totalPoints,
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
        activities: activityMap[dateStr]?.activities || []
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate statistics
    const totalActivities = activities.reduce((sum, activity) => sum + activity.count, 0);
    const totalPoints = activities.reduce((sum, activity) => sum + activity.totalPoints, 0);
    const averageDaily = totalActivities / heatmapData.length;

    // Find most active day
    const mostActiveDay = activities.reduce((max, activity) =>
      activity.count > max.count ? activity : max,
      { _id: '', count: 0, totalPoints: 0, activities: [] }
    );

    return NextResponse.json({
      heatmapData,
      statistics: {
        totalActivities,
        totalPoints,
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