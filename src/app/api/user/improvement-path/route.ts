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
      userId: user._id,
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
  try {
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
        duration: s.duration,
        problemsSolved: s.problemsSolved?.length || 0,
        rating: s.rating
      }))
    };

    // Create AI prompt
    const prompt = `
You are an expert competitive programming coach. Analyze this user's performance data and provide personalized improvement recommendations.

User Performance Data:
${JSON.stringify(performanceData, null, 2)}

Based on this data, provide a comprehensive improvement path with:

1. **Current Strengths**: What they're doing well
2. **Areas for Improvement**: Key weaknesses to address
3. **Personalized Recommendations**: Specific, actionable advice
4. **Next Steps**: Concrete goals for the next 1-2 weeks
5. **Long-term Strategy**: 1-3 month improvement plan

Format your response as a JSON object with these keys:
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": [
    {
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
  "longTermStrategy": ["string"],
  "insights": {
    "consistency": number (0-100),
    "progressRate": "slow|moderate|fast",
    "focusAreas": ["string"]
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
      // Fallback to basic recommendations
      improvementPath = {
        strengths: ['Active participation'],
        weaknesses: ['Need more analysis'],
        recommendations: [{
          title: 'Continue practicing',
          description: 'Keep up the good work',
          priority: 'medium',
          action: 'Practice regularly'
        }],
        nextSteps: [{
          title: 'Daily practice',
          description: 'Code every day',
          items: [{ title: 'Solve one problem daily', type: 'goal' }]
        }],
        longTermStrategy: ['Build consistency'],
        insights: {
          consistency: calculateConsistency(activities),
          progressRate: 'moderate',
          focusAreas: ['consistency']
        }
      };
    }

    return improvementPath;
  } catch (error) {
    console.error('AI improvement path generation error:', error);
    // Return fallback response
    return {
      strengths: ['Showing interest in improvement'],
      weaknesses: ['AI analysis temporarily unavailable'],
      recommendations: [{
        title: 'Continue regular practice',
        description: 'Keep solving problems consistently',
        priority: 'medium',
        action: 'Practice daily'
      }],
      nextSteps: [{
        title: 'Maintain momentum',
        description: 'Keep your current practice routine',
        items: [{ title: 'Solve problems regularly', type: 'goal' }]
      }],
      longTermStrategy: ['Focus on consistent improvement'],
      insights: {
        consistency: calculateConsistency(activities),
        progressRate: 'moderate',
        focusAreas: ['consistency']
      }
    };
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