import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import UserActivity from '@/models/UserActivity';
import Session from '@/models/Session';
import User from '@/models/User';
import { logger } from '@/lib/logger';
import { sendOpenRouterChat } from '@/lib/openRouterClient';
import { challengeSchema } from '@/lib/validation';
import { z } from 'zod';

const weeklyChallengeAiSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(5).max(250),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topics: z.array(z.string().min(1).max(50)).min(1).max(8),
  bonusPoints: z.number().int().min(5).max(20),
  category: z.enum(['algorithms', 'data-structures', 'consistency', 'difficulty', 'practice', 'learning']),
});

export const pointsFor = (difficulty: string, isWeekly = false) => {
  if (difficulty === 'easy') return isWeekly ? 5 : 2;
  if (difficulty === 'medium') return isWeekly ? 10 : 3;
  return isWeekly ? 20 : 5; // hard
};

async function generateAIWeeklyChallenges(userId: any) {
  try {
    logger.info('Starting AI weekly challenge generation', { userId });

    // Get user data for personalization
    const user = await User.findById(userId);
    if (!user) {
      logger.warn('User not found for weekly challenge generation', { userId });
      return getFallbackWeeklyChallenges();
    }

    // Get recent activities and sessions
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

    const earnedBadges = await Badge.find({
      userId,
      earned: true
    });

    // Get challenge completion stats
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

    // Prepare user data for AI
    const userData = {
      name: user.name || 'User',
      league: user.league || 'Beginner',
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
        problemsSolved: s.problemsSolved?.length || 0,
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

    // Create AI prompt for weekly challenges
    const prompt = `
You are an expert competitive programming coach creating personalized weekly challenges.

User Profile:
${JSON.stringify(userData, null, 2)}

Generate 3 personalized weekly challenges that will help this user improve. Each challenge should:

1. **Be achievable within 1 week** but challenging enough to promote growth
2. **Build on their current skills and weaknesses**
3. **Include specific, measurable goals**
4. **Cover different aspects**: problem-solving, consistency, difficulty progression, or learning new topics
5. **Have appropriate difficulty levels** based on their current league and performance

Return exactly 3 challenges in this JSON format:
[
  {
    "title": "Challenge Title (max 50 chars)",
    "description": "Detailed description of what to do (max 200 chars)",
    "difficulty": "easy" | "medium" | "hard",
    "topics": ["topic1", "topic2"],
    "bonusPoints": number (5-20 based on difficulty),
    "category": "algorithms" | "data-structures" | "consistency" | "difficulty" | "practice" | "learning"
  }
]

Consider their league level (${userData.league}) and recent performance when setting difficulty and goals.
`;

    const completion = await sendOpenRouterChat({
      circuitName: 'weekly-challenges',
      cacheKeyParts: ['weekly-challenges', userId.toString(), userData],
      fallback: '',
      request: {
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        maxTokens: 1000
      },
    });

    const response = completion.content;
    if (!response || typeof response !== 'string') {
      throw new Error('No valid response from AI');
    }

    let challenges;
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      challenges = JSON.parse(jsonString);
      challenges = z.array(weeklyChallengeAiSchema).length(3).parse(challenges);
    } catch (parseError) {
      logger.warn('Failed to parse AI challenge response', { userId, response, error: parseError });
      return getFallbackWeeklyChallenges();
    }

    logger.info('AI weekly challenges generated', { userId, count: challenges.length });
    return challenges;

  } catch (error) {
    logger.warn('AI weekly challenge generation failed', { userId, error });
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

export async function generateChallengesForUser(userId: any, options: { daily?: boolean; weekly?: boolean } = { daily: true, weekly: true }) {
  try {
    const now = new Date();

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const endOfWeek = new Date(now);
    const daysUntilSunday = 7 - now.getDay();
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    const dailyChallenges = [
      {
        title: "Solve 3 Easy Problems",
        description: "Complete 3 easy-rated coding problems today",
        type: "daily",
        difficulty: "easy",
        topics: ["implementation", "math"],
        bonusPoints: 2,
        deadline: endOfDay,
        category: "problem-solving"
      },
      {
        title: "Practice Arrays & Strings",
        description: "Solve 2 problems involving arrays or strings",
        type: "daily",
        difficulty: "easy",
        topics: ["arrays", "strings"],
        bonusPoints: 3,
        deadline: endOfDay,
        category: "data-structures"
      },
      {
        title: "Time Management Challenge",
        description: "Solve a problem in under 30 minutes",
        type: "daily",
        difficulty: "medium",
        topics: ["optimization", "algorithms"],
        bonusPoints: 5,
        deadline: endOfDay,
        category: "efficiency"
      }
    ];

    if (options.daily) {
      for (const challengeData of dailyChallenges) {
        const idempotencyKey = `${challengeData.type}:${challengeData.title.toLowerCase().replace(/\s+/g, '-')}`;
        const parsed = challengeSchema.parse({
          ...challengeData,
          points: pointsFor(challengeData.difficulty, false),
        });
        await Challenge.updateOne(
          { userId, type: parsed.type, deadline: parsed.deadline, idempotencyKey },
          {
            $setOnInsert: {
              userId,
              ...parsed,
              idempotencyKey,
              completed: false,
            },
          },
          { upsert: true }
        );
      }
    }

    if (options.weekly) {
      const existingWeekly = await Challenge.exists({ userId, type: 'weekly', deadline: { $gte: now }, completed: false });
      if (!existingWeekly) {
        const weeklyChallenges = await generateAIWeeklyChallenges(userId);

        for (const challengeData of weeklyChallenges) {
          const idempotencyKey = `weekly:${challengeData.title.toLowerCase().replace(/\s+/g, '-')}`;
          const parsed = challengeSchema.parse({
            ...challengeData,
            type: 'weekly',
            deadline: endOfWeek,
            points: pointsFor(challengeData.difficulty, true)
          });
          await Challenge.updateOne(
            { userId, type: parsed.type, deadline: parsed.deadline, idempotencyKey },
            {
              $setOnInsert: {
                userId,
                ...parsed,
                idempotencyKey,
                completed: false,
              },
            },
            { upsert: true }
          );
        }
      }
    }

    logger.info('Generated challenges for user', { userId, daily: !!options.daily, weekly: !!options.weekly });
  } catch (error) {
    logger.error('Error generating challenges for user', { userId, error });
  }
}
