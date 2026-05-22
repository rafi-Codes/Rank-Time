import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import UserActivity from '@/models/UserActivity';
import Session from '@/models/Session';
import User from '@/models/User';
import { callOpenRouterChat } from '@/lib/openRouterClient';
import { challengeSchema } from '@/lib/validation';

export const pointsFor = (difficulty: string, isWeekly = false) => {
  if (difficulty === 'easy') return isWeekly ? 5 : 2;
  if (difficulty === 'medium') return isWeekly ? 10 : 3;
  return isWeekly ? 20 : 5; // hard
};

async function generateAIWeeklyChallenges(userId: any) {
  try {
    console.log('Starting AI weekly challenge generation for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found, using fallback');
      return getFallbackWeeklyChallenges();
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivities = await UserActivity.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(20);

    const recentSessions = await Session.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);

    const earnedBadges = await Badge.find({ userId, earned: true });

    const challengeStats = await Challenge.aggregate([
      { $match: { userId, type: 'weekly' } },
      {
        $group: {
          _id: null,
          totalCompleted: { $sum: { $cond: ['$completed', 1, 0] } },
          totalActive: { $sum: { $cond: ['$completed', 0, 1] } },
          avgPoints: { $avg: '$points' },
          categories: { $addToSet: '$category' },
          difficulties: { $addToSet: '$difficulty' }
        }
      }
    ]);

    const userData = {
      name: user.name || 'User',
      league: user.league || 'bronze',
      totalScore: user.totalScore || 0,
      currentStreak: user.currentStreak || 0,
      maxStreak: user.maxStreak || 0,
      recentActivity: {
        count: recentActivities.length,
        categories: Array.from(new Set(recentActivities.map(a => a.metadata?.category).filter(Boolean))),
        pointsEarned: recentActivities.reduce((sum, a) => sum + (a.points || 0), 0)
      },
      sessions: recentSessions.slice(0, 5).map(s => ({
        date: s.createdAt,
        duration: s.totalTime || 0,
        rating: s.problemRating || 0,
        score: s.score || 0
      })),
      badges: earnedBadges.map(b => b.badgeId),
      challengeStats: challengeStats[0] || {
        totalCompleted: 0,
        totalActive: 0,
        avgPoints: 0,
        categories: [],
        difficulties: []
      }
    };

    const prompt = `
You are a competitive programming coach generating personalized weekly challenges.

User Profile:
${JSON.stringify(userData, null, 2)}

Create exactly 3 weekly challenges for this user. Each challenge should:
1. Be achievable within one week
2. Build on the user's current strengths and growth areas
3. Include a measurable goal
4. Cover different aspects of competitive programming
5. Use difficulty levels appropriate to the user's current league

Return only valid JSON in this format:
[
  {
    "title": "...",
    "description": "...",
    "difficulty": "easy|medium|hard",
    "topics": ["..."],
    "bonusPoints": 5,
    "category": "algorithms|data-structures|consistency|difficulty|practice|learning"
  }
]
`;

    const completion = await callOpenRouterChat({
      model: 'anthropic/claude-3-haiku',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    const response = completion?.response;
    if (!response || typeof response !== 'string') {
      throw new Error('Invalid AI response');
    }
    if (completion.provider === 'fallback') {
      console.warn('OpenRouter fallback returned for challenge generation');
      return getFallbackWeeklyChallenges();
    }

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : response;
    const rawChallenges = JSON.parse(jsonString) as any[];
    if (!Array.isArray(rawChallenges) || rawChallenges.length !== 3) {
      throw new Error('AI did not return exactly 3 challenges');
    }

    const validatedChallenges = rawChallenges.map((challenge, index) => {
      const parsed = challengeSchema.safeParse({
        ...challenge,
        deadline: challenge.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      if (!parsed.success) {
        throw new Error(`Challenge validation failed at index ${index}: ${JSON.stringify(parsed.error.format())}`);
      }
      return parsed.data;
    });

    return validatedChallenges;
  } catch (error) {
    console.error('Error generating AI weekly challenges:', error);
    return getFallbackWeeklyChallenges();
  }
}

function getFallbackWeeklyChallenges() {
  return [
    {
      title: "Algorithm Mastery",
      description: "Solve 5 medium-difficulty algorithmic problems this week",
      difficulty: "medium",
      topics: ["algorithms", "data-structures"],
      bonusPoints: 10,
      category: "algorithms"
    },
    {
      title: "Consistency Champion",
      description: "Code for at least 5 days this week",
      difficulty: "medium",
      topics: ["practice", "consistency"],
      bonusPoints: 10,
      category: "consistency"
    },
    {
      title: "Hard Problem Conqueror",
      description: "Successfully solve one hard-rated problem",
      difficulty: "hard",
      topics: ["advanced-algorithms", "complexity"],
      bonusPoints: 20,
      category: "difficulty"
    }
  ];
}

export async function generateChallengesForUser(userId: any, options: { daily?: boolean; weekly?: boolean; idempotencyKey?: string } = { daily: true, weekly: true }) {
  try {
    const now = new Date();

    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    const endOfWeek = new Date(endOfDay);
    const daysUntilSunday = 7 - endOfWeek.getUTCDay();
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilSunday);

    const dailyChallenges = [
      {
        title: 'Solve 3 Easy Problems',
        description: 'Complete 3 easy-rated coding problems today',
        type: 'daily',
        difficulty: 'easy',
        topics: ['implementation', 'math'],
        bonusPoints: 5,
        deadline: endOfDay,
        category: 'practice',
      },
      {
        title: 'Practice Arrays & Strings',
        description: 'Solve 2 problems involving arrays or strings',
        type: 'daily',
        difficulty: 'easy',
        topics: ['arrays', 'strings'],
        bonusPoints: 5,
        deadline: endOfDay,
        category: 'data-structures',
      },
      {
        title: 'Time Management Challenge',
        description: 'Solve a problem in under 30 minutes',
        type: 'daily',
        difficulty: 'medium',
        topics: ['optimization', 'algorithms'],
        bonusPoints: 10,
        deadline: endOfDay,
        category: 'difficulty',
      }
    ];

    if (options.daily) {
      const existingDaily = await Challenge.findOne({ userId, type: 'daily', deadline: { $gte: now }, completed: false });
      if (!existingDaily) {
        for (const challengeData of dailyChallenges) {
          await Challenge.updateOne(
            {
              userId,
              type: challengeData.type,
              title: challengeData.title,
              deadline: challengeData.deadline,
            },
            {
              $setOnInsert: {
                userId,
                ...challengeData,
                points: pointsFor(challengeData.difficulty, false),
              },
            },
            { upsert: true }
          );
        }
      }
    }

    if (options.weekly) {
      const existingWeekly = await Challenge.findOne({ userId, type: 'weekly', deadline: { $gte: now }, completed: false });
      if (!existingWeekly) {
        const weeklyChallenges = await generateAIWeeklyChallenges(userId);
        const batchKey = options.idempotencyKey || `weekly-${endOfWeek.toISOString()}`;

        for (const challengeData of weeklyChallenges) {
          const validated = challengeSchema.safeParse({
            ...challengeData,
            type: 'weekly',
            deadline: endOfWeek,
          });
          if (!validated.success) {
            console.warn('Skipping invalid AI challenge', validated.error.format());
            continue;
          }

          const filter = options.idempotencyKey
            ? { userId, idempotencyKey: batchKey, type: 'weekly', title: validated.data.title }
            : { userId, type: 'weekly', title: validated.data.title, deadline: endOfWeek };

          await Challenge.updateOne(
            filter,
            {
              $setOnInsert: {
                userId,
                ...validated.data,
                points: pointsFor(validated.data.difficulty, true),
                idempotencyKey: batchKey,
              },
            },
            { upsert: true }
          );
        }
      }
    }

    console.log(`Generated challenges for user ${userId} (daily:${!!options.daily}, weekly:${!!options.weekly})`);
  } catch (error) {
    console.error('Error generating challenges for user:', error);
  }
}
