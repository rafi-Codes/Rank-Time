import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import UserActivity from '@/models/UserActivity';
import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import Session from '@/models/Session';
import User from '@/models/User';
import { OpenRouter } from '@openrouter/sdk';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Gather comprehensive user performance data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get recent activities
    const recentActivities = await UserActivity.find({
      userId: user._id,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Get challenge stats
    const challengeStats = await Challenge.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalCompleted: { $sum: { $cond: ['$completed', 1, 0] } },
          totalActive: { $sum: { $cond: [{ $and: ['$completed', false, { $gte: ['$deadline', new Date()] }] }, 1, 0] } },
          categories: { $addToSet: '$category' },
          difficulties: { $push: '$difficulty' },
          avgPoints: { $avg: { $add: ['$points', '$bonusPoints'] } }
        }
      }
    ]);

    // Get earned badges
    const earnedBadges = await Badge.find({
      userId: user._id,
      earned: true
    });

    // Get recent sessions
    const recentSessions = await Session.find({
      user: user._id,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);

    // Generate AI-powered improvement path
    const improvementPath = await generateAIImprovementPath(
      user,
      recentActivities,
      challengeStats[0] || {},
      earnedBadges,
      recentSessions
    );

    return NextResponse.json(improvementPath);
  } catch (error) {
    console.error('Error generating improvement path:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateAIImprovementPath(
  user: any,
  activities: any[],
  challengeStats: any,
  badges: any[],
  sessions: any[]
) {
  const fallbackResponse = {
    recommendations: [
      {
        type: 'practice',
        title: 'Keep your practice cadence steady',
        description: 'Consistency matters more than occasional long sessions.',
        priority: 'high' as const,
        action: 'Aim for at least one focused session on most days this week.',
      },
      {
        type: 'review',
        title: 'Review recent sessions',
        description: 'Use your recent attempts to spot patterns in speed and difficulty.',
        priority: 'medium' as const,
        action: 'After each session, write one note about what slowed you down.',
      },
    ],
    nextSteps: [
      {
        title: 'This week',
        description: 'A simple short-term plan based on your recent activity.',
        items: [
          { title: 'Complete 3 focused problem-solving sessions', type: 'goal' },
          { title: 'Attempt one problem slightly above your comfort zone', type: 'challenge' },
          { title: 'Review one past session replay for improvement ideas', type: 'practice' },
        ],
      },
    ],
    insights: {
      totalActivities: activities.length,
      categoriesWorked: Array.from(new Set(activities.map(a => a.metadata?.category).filter(Boolean))).length,
      badgesEarned: badges.length,
      consistency: calculateConsistency(activities),
    },
  };

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return fallbackResponse;
    }

    // Initialize OpenRouter
    const openRouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Prepare performance data for AI analysis
    const performanceData = {
      userInfo: {
        name: user.name || 'User',
        joinDate: user.createdAt,
        totalActivities: activities.length,
        totalBadges: badges.length
      },
      recentActivity: {
        last30Days: activities.length,
        consistency: calculateConsistency(activities),
        categories: Array.from(new Set(activities.map(a => a.metadata?.category).filter(Boolean))),
        pointsEarned: activities.reduce((sum, a) => sum + (a.points || 0), 0)
      },
      challenges: {
        totalCompleted: challengeStats.totalCompleted || 0,
        activeChallenges: challengeStats.totalActive || 0,
        categories: challengeStats.categories || [],
        avgPoints: Math.round(challengeStats.avgPoints || 0),
        difficultyDistribution: challengeStats.difficulties?.reduce((acc: any, diff: string) => {
          acc[diff] = (acc[diff] || 0) + 1;
          return acc;
        }, {}) || {}
      },
      badges: badges.map(b => ({
        name: b.badgeId,
        earnedAt: b.earnedAt
      })),
      sessions: sessions.slice(0, 5).map(s => ({
        date: s.createdAt,
        duration: s.totalTime,
        rating: s.problemRating,
        score: s.score,
        laps: s.laps?.length || 0,
      }))
    };

    // Create AI prompt
    const prompt = `
You are an expert competitive programming coach. Analyze this user's performance data and provide personalized improvement recommendations.

User Performance Data:
${JSON.stringify(performanceData, null, 2)}

Based on this data, provide a comprehensive improvement path with:

Return only JSON using this exact shape:
{
  "recommendations": [
    {
      "type": "practice|review|challenge",
      "title": "string",
      "description": "string",
      "priority": "high|medium|low",
      "action": "string"
    }
  ],
  "nextSteps": [
    {
      "title": "string",
      "description": "string",
      "items": [
        {
          "title": "string",
          "type": "goal|challenge|practice"
        }
      ]
    }
  ],
  "insights": {
    "totalActivities": number,
    "categoriesWorked": number,
    "badgesEarned": number,
    "consistency": number
  }
}

Be specific, encouraging, and realistic. Tailor advice to their current level and patterns.
`;

    // Call OpenRouter
    const completion = await openRouter.chat.send({
      model: 'anthropic/claude-3-haiku',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      maxTokens: 2000
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse || typeof aiResponse !== 'string') {
      throw new Error('No valid response from AI');
    }

    // Parse AI response
    let improvementPath;
    try {
      improvementPath = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      improvementPath = fallbackResponse;
    }

    return {
      recommendations: Array.isArray(improvementPath.recommendations) ? improvementPath.recommendations : fallbackResponse.recommendations,
      nextSteps: Array.isArray(improvementPath.nextSteps) ? improvementPath.nextSteps : fallbackResponse.nextSteps,
      insights: {
        totalActivities: Number(improvementPath.insights?.totalActivities ?? fallbackResponse.insights.totalActivities),
        categoriesWorked: Number(improvementPath.insights?.categoriesWorked ?? fallbackResponse.insights.categoriesWorked),
        badgesEarned: Number(improvementPath.insights?.badgesEarned ?? fallbackResponse.insights.badgesEarned),
        consistency: Number(improvementPath.insights?.consistency ?? fallbackResponse.insights.consistency),
      },
    };
  } catch (error) {
    console.error('AI improvement path generation error:', error);
    return fallbackResponse;
  }
}

function calculateConsistency(activities: any[]) {
  if (activities.length === 0) return 0;

  // Group activities by date
  const activityDates = new Set(
    activities.map(activity =>
      activity.createdAt.toISOString().split('T')[0]
    )
  );

  const totalDays = 30; // Last 30 days
  const activeDays = activityDates.size;

  return Math.round((activeDays / totalDays) * 100);
}
