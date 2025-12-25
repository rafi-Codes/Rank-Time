import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import UserActivity from '@/models/UserActivity';
import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Analyze user's activity patterns
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get recent activities
    const recentActivities = await UserActivity.find({
      userId: session.user.id,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Get challenge completion stats
    const challengeStats = await Challenge.aggregate([
      { $match: { userId: session.user.id, completed: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgTime: { $avg: '$estimatedTime' },
          difficulties: { $push: '$difficulty' }
        }
      }
    ]);

    // Get earned badges
    const earnedBadges = await Badge.find({
      userId: session.user.id,
      earned: true
    });

    // Analyze patterns and generate recommendations
    const recommendations = await generateRecommendations(
      recentActivities,
      challengeStats,
      earnedBadges
    );

    // Generate next steps
    const nextSteps = await generateNextSteps(recommendations, session.user.id);

    return NextResponse.json({
      recommendations,
      nextSteps,
      insights: {
        totalActivities: recentActivities.length,
        categoriesWorked: challengeStats.length,
        badgesEarned: earnedBadges.length,
        consistency: calculateConsistency(recentActivities)
      }
    });
  } catch (error) {
    console.error('Error generating improvement path:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateRecommendations(
  activities: any[],
  challengeStats: any[],
  earnedBadges: any[]
) {
  const recommendations = [];

  // Analyze activity frequency
  const activityFrequency = activities.length / 30; // activities per day

  if (activityFrequency < 0.5) {
    recommendations.push({
      type: 'consistency',
      title: 'Build Consistent Practice Habits',
      description: 'You\'re practicing less than once every two days. Try to code daily, even if just for 30 minutes.',
      priority: 'high',
      action: 'Set daily coding reminders and start with small, achievable goals.'
    });
  } else if (activityFrequency >= 1) {
    recommendations.push({
      type: 'consistency',
      title: 'Great Consistency!',
      description: 'You\'re practicing daily - keep up the excellent work!',
      priority: 'low',
      action: 'Consider increasing session length or difficulty to continue progressing.'
    });
  }

  // Analyze category diversity
  const categories = challengeStats.map(stat => stat._id);
  if (categories.length < 3) {
    recommendations.push({
      type: 'diversity',
      title: 'Explore New Problem Types',
      description: `You've worked on ${categories.length} categories. Try exploring other areas like graphs, dynamic programming, or string algorithms.`,
      priority: 'medium',
      action: 'Look for challenges in underrepresented categories to build well-rounded skills.'
    });
  }

  // Analyze difficulty progression
  const difficultyCount = challengeStats.reduce((acc, stat) => {
    stat.difficulties.forEach((diff: string) => {
      acc[diff] = (acc[diff] || 0) + 1;
    });
    return acc;
  }, {});

  const hardChallenges = difficultyCount.hard || 0;
  const mediumChallenges = difficultyCount.medium || 0;

  if (hardChallenges < mediumChallenges * 0.3) {
    recommendations.push({
      type: 'difficulty',
      title: 'Challenge Yourself More',
      description: 'You\'re mostly solving medium difficulty problems. Try harder challenges to accelerate your growth.',
      priority: 'medium',
      action: 'Start incorporating more hard difficulty problems into your practice routine.'
    });
  }

  // Badge-based recommendations
  const badgeCategories = earnedBadges.map(badge => badge.category);
  if (!badgeCategories.includes('streak')) {
    recommendations.push({
      type: 'streak',
      title: 'Build a Streak',
      description: 'Consistent daily practice leads to better retention and faster improvement.',
      priority: 'high',
      action: 'Aim for a 7-day coding streak to earn your first streak badge.'
    });
  }

  // Time-based analysis
  const avgSessionTime = activities.reduce((sum, activity) => {
    // Estimate session time from activity patterns
    return sum + 30; // Rough estimate
  }, 0) / activities.length;

  if (avgSessionTime < 45) {
    recommendations.push({
      type: 'focus',
      title: 'Increase Session Length',
      description: 'Longer, focused sessions lead to deeper understanding and better problem-solving skills.',
      priority: 'medium',
      action: 'Try extending your coding sessions to 60+ minutes for more meaningful progress.'
    });
  }

  return recommendations;
}

async function generateNextSteps(recommendations: any[], userId: string) {
  const nextSteps = [];

  // Get user's current challenge progress
  const activeChallenges = await Challenge.find({
    userId,
    completed: false,
    deadline: { $gte: new Date() }
  }).limit(3);

  if (activeChallenges.length > 0) {
    nextSteps.push({
      title: 'Complete Active Challenges',
      description: `You have ${activeChallenges.length} active challenges waiting.`,
      items: activeChallenges.map(challenge => ({
        id: challenge._id,
        title: challenge.title,
        difficulty: challenge.difficulty,
        deadline: challenge.deadline
      }))
    });
  }

  // Suggest next challenge types based on recommendations
  const weakAreas = recommendations
    .filter(rec => rec.priority === 'high' || rec.priority === 'medium')
    .map(rec => rec.type);

  if (weakAreas.includes('difficulty')) {
    nextSteps.push({
      title: 'Try Harder Problems',
      description: 'Push your boundaries with more challenging problems.',
      items: [
        { title: 'Solve 2-3 hard difficulty problems this week', type: 'goal' },
        { title: 'Focus on problems that take 45+ minutes to solve', type: 'goal' }
      ]
    });
  }

  if (weakAreas.includes('diversity')) {
    nextSteps.push({
      title: 'Explore New Topics',
      description: 'Broaden your algorithmic knowledge.',
      items: [
        { title: 'Try graph algorithms if you haven\'t recently', type: 'goal' },
        { title: 'Practice dynamic programming problems', type: 'goal' },
        { title: 'Work on string manipulation algorithms', type: 'goal' }
      ]
    });
  }

  if (weakAreas.includes('consistency')) {
    nextSteps.push({
      title: 'Build Daily Habits',
      description: 'Consistency is key to mastery.',
      items: [
        { title: 'Code for at least 30 minutes every day', type: 'goal' },
        { title: 'Set phone reminders for coding sessions', type: 'goal' },
        { title: 'Track your daily progress in a journal', type: 'goal' }
      ]
    });
  }

  return nextSteps;
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