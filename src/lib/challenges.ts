import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import UserActivity from '@/models/UserActivity';

export const pointsFor = (difficulty: string, isWeekly = false) => {
  if (difficulty === 'easy') return isWeekly ? 40 : 20;
  if (difficulty === 'medium') return isWeekly ? 70 : 35;
  return isWeekly ? 100 : 50; // hard
};

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

    const weeklyChallenges = [
      {
        title: "Algorithm Mastery",
        description: "Solve 5 medium-difficulty algorithmic problems this week",
        type: "weekly",
        difficulty: "medium",
        topics: ["algorithms", "data-structures"],
        bonusPoints: 50,
        deadline: endOfWeek,
        category: "algorithms"
      },
      {
        title: "Consistency Champion",
        description: "Code for at least 5 days this week",
        type: "weekly",
        difficulty: "medium",
        topics: ["practice", "consistency"],
        bonusPoints: 40,
        deadline: endOfWeek,
        category: "consistency"
      },
      {
        title: "Hard Problem Conqueror",
        description: "Successfully solve one hard-rated problem",
        type: "weekly",
        difficulty: "hard",
        topics: ["advanced-algorithms", "complexity"],
        bonusPoints: 75,
        deadline: endOfWeek,
        category: "difficulty"
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
        for (const challengeData of weeklyChallenges) {
          await Challenge.create({
            userId,
            ...challengeData,
            points: pointsFor(String((challengeData as any).difficulty), true)
          });
        }
      }
    }

    console.log(`Generated challenges for user ${userId} (daily:${!!options.daily}, weekly:${!!options.weekly})`);
  } catch (error) {
    console.error('Error generating challenges for user:', error);
  }
}
