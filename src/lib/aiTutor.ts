import User from '@/models/User';
import UserActivity from '@/models/UserActivity';
import Session from '@/models/Session';
import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import { callOpenRouterChat } from '@/lib/openRouterClient';
import { learningCurriculumSchema } from '@/lib/validation';

export async function generateLearningCurriculum(userId: any) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return getFallbackLearningCurriculum();
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivities = await UserActivity.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(30);

    const recentSessions = await Session.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);

    const completedChallenges = await Challenge.find({
      userId,
      completed: true,
      type: { $in: ['daily', 'weekly'] }
    }).sort({ completedAt: -1 }).limit(20);

    const badges = await Badge.find({ userId, earned: true });

    const skillSummary = {
      league: user.league || 'bronze',
      currentStreak: user.currentStreak || 0,
      totalScore: user.totalScore || 0,
      recentSessionCount: recentSessions.length,
      recentActivityCount: recentActivities.length,
      completedChallengeCount: completedChallenges.length,
      earnedBadges: badges.map((badge) => badge.badgeId),
      averageSessionRating: recentSessions.length > 0
        ? recentSessions.reduce((sum, session) => sum + session.problemRating, 0) / recentSessions.length
        : 0,
      averageSessionScore: recentSessions.length > 0
        ? recentSessions.reduce((sum, session) => sum + session.score, 0) / recentSessions.length
        : 0,
    };

    const prompt = `You are an expert AI tutoring coach for competitive programmers.

User profile:
${JSON.stringify(skillSummary, null, 2)}

Recent activity summary:
- Activity count: ${recentActivities.length}
- Session count: ${recentSessions.length}
- Completed challenges: ${completedChallenges.length}
- Badges earned: ${badges.map((badge) => badge.badgeId).join(', ') || 'none'}

Create a 4-week personalized learning curriculum for this user.
Each week should include a focus area, concrete goals, practice exercises, and resource suggestions.

Return only valid JSON in this exact shape:
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "curriculum": [
    {
      "week": number,
      "focus": "string",
      "goals": ["string"],
      "practice": ["string"],
      "resources": ["string"]
    }
  ]
}

The curriculum should be realistic, aligned to a learner preparing for competitive programming improvement, and tailored to the user's league and recent performance.
`;

    const completion = await callOpenRouterChat({
      model: 'anthropic/claude-3-haiku',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 1800,
    });

    const responseText = completion.response;
    if (!responseText || typeof responseText !== 'string') {
      return getFallbackLearningCurriculum();
    }

    let rawPayload: any;
    try {
      const match = responseText.match(/\{[\s\S]*\}$/);
      rawPayload = match ? JSON.parse(match[0]) : JSON.parse(responseText);
    } catch (error) {
      console.error('AI curriculum JSON parse failed:', error, 'response:', responseText);
      return getFallbackLearningCurriculum();
    }

    const parsed = learningCurriculumSchema.safeParse(rawPayload);
    if (!parsed.success) {
      console.error('Learning curriculum validation failed:', parsed.error.format());
      return getFallbackLearningCurriculum();
    }

    return parsed.data;
  } catch (error) {
    console.error('Error generating learning curriculum:', error);
    return getFallbackLearningCurriculum();
  }
}

function getFallbackLearningCurriculum() {
  return {
    strengths: [
      'Strong consistency in recent activity',
      'Good progress in current league challenges',
    ],
    weaknesses: [
      'Needs more structured problem-solving practice',
      'Time management on harder problems could improve',
    ],
    recommendations: [
      'Focus on a weekly review cycle to cement learning',
      'Mix algorithm practice with timed problem sessions',
      'Use easy problems to sharpen fundamentals before moving up',
    ],
    curriculum: [
      {
        week: 1,
        focus: 'Core problem-solving patterns',
        goals: [
          'Study 5 common algorithm patterns',
          'Solve 3 easy problems using those patterns',
        ],
        practice: [
          'Array manipulation problems',
          'Two-pointer and sliding window exercises',
        ],
        resources: [
          'Read a guide on common algorithmic patterns',
          'Practice on a competitive programming platform for 30 minutes each day',
        ],
      },
      {
        week: 2,
        focus: 'Data structures and efficiency',
        goals: [
          'Review stacks, queues, and hash maps',
          'Solve 3 medium problems that require data structure selection',
        ],
        practice: [
          'Use hash maps for frequency counting',
          'Implement stack-based parsing problems',
        ],
        resources: [
          'Study a data structure cheat sheet',
          'Practice time-optimized solutions for array problems',
        ],
      },
      {
        week: 3,
        focus: 'Timed problem solving',
        goals: [
          'Complete 2 timed practice sessions',
          'Analyze mistakes and create a correction plan',
        ],
        practice: [
          'Try medium-rated problems under a 45-minute timer',
          'Review edge cases and test strategies',
        ],
        resources: [
          'Use an online judge timer mode',
          'Read a writeup for one problem each day',
        ],
      },
      {
        week: 4,
        focus: 'Focused review and consolidation',
        goals: [
          'Refine solutions from earlier weeks',
          'Attempt one problem slightly above current comfort level',
        ],
        practice: [
          'Review and optimize previous solutions',
          'Solve a single challenging problem with strong debugging',
        ],
        resources: [
          'Review coding notes and practice with flashcards',
          'Watch a tutorial on problem decomposition',
        ],
      },
    ],
  };
}
