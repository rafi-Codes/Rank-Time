import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import UserActivity from '@/models/UserActivity';
import Session from '@/models/Session';
import { OpenRouter } from '@openrouter/sdk';

export const pointsFor = (difficulty: string, isWeekly = false) => {
  if (difficulty === 'easy') return isWeekly ? 40 : 20;
  if (difficulty === 'medium') return isWeekly ? 70 : 35;
  return isWeekly ? 100 : 50; // hard
};

async function generateAIWeeklyChallenges(userId: any) {
  try {
    console.log('Starting AI weekly challenge generation for user:', userId);

    // Get user data for personalization
    const user = await require('@/models/User').default.findById(userId);
    if (!user) {
      console.log('User not found, using fallback');
      return getFallbackWeeklyChallenges();
    }

    console.log('User found:', user.name, 'League:', user.league);

    // Get recent activities and sessions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivities = await UserActivity.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(20);

    const recentSessions = await Session.find({
      userId,
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

    // Initialize OpenRouter
    const openRouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

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
    "bonusPoints": number (20-100 based on difficulty),
    "category": "algorithms" | "data-structures" | "consistency" | "difficulty" | "practice" | "learning"
  }
]

Consider their league level (${userData.league}) and recent performance when setting difficulty and goals.
`;

    const completion = await openRouter.chat.send({
      model: 'anthropic/claude-3-haiku',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      maxTokens: 1000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response || typeof response !== 'string') {
      console.log('No valid AI response received');
      throw new Error('No valid response from AI');
    }

    console.log('AI response received, parsing...');

    // Parse and validate the response
    let challenges;
    try {
      // Extract JSON from response (AI might add extra text)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      challenges = JSON.parse(jsonString);

      if (!Array.isArray(challenges) || challenges.length !== 3) {
        throw new Error('Invalid challenge format');
      }

      // Validate each challenge
      challenges.forEach((challenge: any, index: number) => {
        if (!challenge.title || !challenge.description || !challenge.difficulty ||
            !challenge.topics || !Array.isArray(challenge.topics) ||
            typeof challenge.bonusPoints !== 'number') {
          throw new Error(`Invalid challenge ${index + 1} format`);
        }

        // Ensure valid difficulty
        if (!['easy', 'medium', 'hard'].includes(challenge.difficulty)) {
          challenge.difficulty = 'medium';
        }

        // Ensure valid category
        const validCategories = ['algorithms', 'data-structures', 'consistency', 'difficulty', 'practice', 'learning'];
        if (!validCategories.includes(challenge.category)) {
          challenge.category = 'practice';
        }

        // Ensure reasonable bonus points
        if (challenge.bonusPoints < 20 || challenge.bonusPoints > 100) {
          challenge.bonusPoints = pointsFor(challenge.difficulty, true) * 0.5;
        }
      });

    } catch (parseError) {
      console.error('Failed to parse AI response:', response);
      // Fallback to default challenges if AI fails
      console.log('Using fallback challenges due to parse error');
      return getFallbackWeeklyChallenges();
    }

    console.log('Successfully generated', challenges.length, 'AI challenges');
    return challenges;

  } catch (error) {
    console.error('Error generating AI weekly challenges:', error);
    // Return fallback challenges if AI generation fails
    console.log('Using fallback challenges due to error');
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
      bonusPoints: 50,
      category: "algorithms"
    },
    {
      title: "Consistency Champion",
      description: "Code for at least 5 days this week",
      difficulty: "medium",
      topics: ["practice", "consistency"],
      bonusPoints: 40,
      category: "consistency"
    },
    {
      title: "Hard Problem Conqueror",
      description: "Successfully solve one hard-rated problem",
      difficulty: "hard",
      topics: ["advanced-algorithms", "complexity"],
      bonusPoints: 75,
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
        bonusPoints: 10,
        deadline: endOfDay,
        category: "problem-solving"
      },
      {
        title: "Practice Arrays & Strings",
        description: "Solve 2 problems involving arrays or strings",
        type: "daily",
        difficulty: "easy",
        topics: ["arrays", "strings"],
        bonusPoints: 15,
        deadline: endOfDay,
        category: "data-structures"
      },
      {
        title: "Time Management Challenge",
        description: "Solve a problem in under 30 minutes",
        type: "daily",
        difficulty: "medium",
        topics: ["optimization", "algorithms"],
        bonusPoints: 25,
        deadline: endOfDay,
        category: "efficiency"
      }
    ];

    if (options.daily) {
      const existingDaily = await Challenge.findOne({ userId, type: 'daily', deadline: { $gte: now }, completed: false });
      if (!existingDaily) {
        for (const challengeData of dailyChallenges) {
          await Challenge.create({
            userId,
            ...challengeData,
            points: pointsFor(String((challengeData as any).difficulty), false)
          });
        }
      }
    }

    if (options.weekly) {
      const existingWeekly = await Challenge.findOne({ userId, type: 'weekly', deadline: { $gte: now }, completed: false });
      if (!existingWeekly) {
        // Generate AI-powered weekly challenges
        const weeklyChallenges = await generateAIWeeklyChallenges(userId);

        for (const challengeData of weeklyChallenges) {
          await Challenge.create({
            userId,
            ...challengeData,
            type: 'weekly',
            deadline: endOfWeek,
            points: pointsFor(String(challengeData.difficulty), true)
          });
        }
      }
    }

    console.log(`Generated challenges for user ${userId} (daily:${!!options.daily}, weekly:${!!options.weekly})`);
  } catch (error) {
    console.error('Error generating challenges for user:', error);
  }
}
