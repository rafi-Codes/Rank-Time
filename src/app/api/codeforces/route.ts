// src/app/api/codeforces/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface CodeforcesUser {
  handle: string;
  rating?: number;
  rank?: string;
  maxRating?: number;
  maxRank?: string;
  contribution?: number;
  friendOfCount?: number;
  titlePhoto?: string;
  avatar?: string;
  registrationTimeSeconds?: number;
  lastOnlineTimeSeconds?: number;
}

interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    rating?: number;
    tags?: string[];
  };
  verdict: string;
  programmingLanguage: string;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  creationTimeSeconds: number;
}

interface CategoryStats {
  categoryName: string;
  totalSolved: number;
  totalAttempted: number;
  successRate: number;
  averageTime: number;
}

interface RatingStats {
  rating: number | string;
  count: number;
  solved: number;
  successRate: number;
  avgTimeMillis: number;
  avgMemoryBytes: number;
  tags: string[];
}

interface LanguageStats {
  language: string;
  count: number;
  accepted: number;
  successRate: number;
}

interface TimeAnalysis {
  periodLabel: string;
  submissions: number;
  accepted: number;
  successRate: number;
}

interface EnhancedStats {
  solvedProblems: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  wrongAnswer: number;
  timeLimitExceeded: number;
  memoryLimitExceeded: number;
  runtimeError: number;
  compilationError: number;
  recentSubmissions: CodeforcesSubmission[];
  
  // New analytics
  categoryBreakdown: CategoryStats[];
  ratingDistribution: RatingStats[];
  languagePreference: LanguageStats[];
  timeSpentByRating: Record<string, { totalTime: number; count: number }>;
  ratingTendency: {
    preferredRatingRange: { min: number; max: number };
    averageSolvedRating: number;
    easyProblems: number; // rating <= 1200
    mediumProblems: number; // 1200 < rating <= 2000
    hardProblems: number; // 2000 < rating <= 3000
    veryHardProblems: number; // rating > 3000
  };
  successRateByRating: Record<string, number>;
  practiceIntensity: {
    submissionsPerDay: number;
    daysActive: number;
    consistency: number; // 0-100, based on activity distribution
  };
  topProblems: Array<{
    name: string;
    rating?: number;
    tags?: string[];
    index: string;
    verdicts: Record<string, number>;
  }>;
  verdictDistribution: Record<string, number>;
}

function categorizeTag(tag: string): string {
  const tagCategories: Record<string, string[]> = {
    'Data Structures': ['greedy', 'data structures', 'trees', 'graphs', 'heap', 'segment tree', 'fenwick tree'],
    'Algorithms': ['sorting', 'binary search', 'dynamic programming', 'dfs and bfs', 'two pointers', 'implementation', 'greedy'],
    'Math': ['math', 'number theory', 'combinatorics', 'geometry', 'matrix exponentiation'],
    'Graph Theory': ['graphs', 'dfs and bfs', 'shortest paths', 'minimum spanning tree', 'bipartite matching', 'flow', 'tree'],
    'Dynamic Programming': ['dynamic programming', 'bitmask'],
    'String Processing': ['string suffix structures', 'strings', 'hashing'],
    'Advanced': ['divide and conquer', 'probabilities', 'game theory', 'ternary search'],
  };

  const lowerTag = tag.toLowerCase();
  for (const [category, tags] of Object.entries(tagCategories)) {
    if (tags.some(t => lowerTag.includes(t))) {
      return category;
    }
  }
  return 'Other';
}

function getRatingCategory(rating?: number): string {
  if (!rating) return 'Unrated';
  if (rating <= 1200) return '1000-1200 (Easy)';
  if (rating <= 1600) return '1200-1600 (Easy-Medium)';
  if (rating <= 2000) return '1600-2000 (Medium)';
  if (rating <= 2400) return '2000-2400 (Medium-Hard)';
  if (rating <= 3000) return '2400-3000 (Hard)';
  return '3000+ (Very Hard)';
}

function calculateConsistency(submissions: CodeforcesSubmission[]): number {
  if (submissions.length === 0) return 0;

  // Group submissions by day
  const submissionsByDay = new Map<string, number>();
  submissions.forEach(sub => {
    const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
    submissionsByDay.set(date, (submissionsByDay.get(date) || 0) + 1);
  });

  // Calculate standard deviation of submissions per day
  const dailyCounts = Array.from(submissionsByDay.values());
  const avgDaily = dailyCounts.reduce((a, b) => a + b, 0) / dailyCounts.length;
  const variance = dailyCounts.reduce((sum, count) => sum + Math.pow(count - avgDaily, 2), 0) / dailyCounts.length;
  const stdDev = Math.sqrt(variance);

  // Normalize to 0-100 scale (lower stdDev = higher consistency)
  const consistency = Math.max(0, 100 - (stdDev * 10));
  return Math.round(consistency);
}

function analyzeTimeByRating(submissions: CodeforcesSubmission[]): Record<string, { totalTime: number; count: number }> {
  const timeByRating: Record<string, { totalTime: number; count: number }> = {};

  submissions.forEach(sub => {
    const ratingCategory = getRatingCategory(sub.problem.rating);
    if (!timeByRating[ratingCategory]) {
      timeByRating[ratingCategory] = { totalTime: 0, count: 0 };
    }
    timeByRating[ratingCategory].totalTime += sub.creationTimeSeconds;
    timeByRating[ratingCategory].count += 1;
  });

  return timeByRating;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json(
      { error: 'Handle parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch user info
    const userResponse = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
      {
        headers: {
          'User-Agent': 'RankTime-App/1.0',
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data from Codeforces');
    }

    const userData = await userResponse.json();

    if (userData.status !== 'OK' || !userData.result || userData.result.length === 0) {
      throw new Error('User not found on Codeforces');
    }

    const user: CodeforcesUser = userData.result[0];

    // Fetch all user submissions (increased limit for better analytics)
    const submissionsResponse = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`,
      {
        headers: {
          'User-Agent': 'RankTime-App/1.0',
        },
      }
    );

    let stats: EnhancedStats = {
      solvedProblems: 0,
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      wrongAnswer: 0,
      timeLimitExceeded: 0,
      memoryLimitExceeded: 0,
      runtimeError: 0,
      compilationError: 0,
      recentSubmissions: [],
      categoryBreakdown: [],
      ratingDistribution: [],
      languagePreference: [],
      timeSpentByRating: {},
      ratingTendency: {
        preferredRatingRange: { min: 0, max: 0 },
        averageSolvedRating: 0,
        easyProblems: 0,
        mediumProblems: 0,
        hardProblems: 0,
        veryHardProblems: 0,
      },
      successRateByRating: {},
      practiceIntensity: {
        submissionsPerDay: 0,
        daysActive: 0,
        consistency: 0,
      },
      topProblems: [],
      verdictDistribution: {},
    };

    if (submissionsResponse.ok) {
      const submissionsData = await submissionsResponse.json();

      if (submissionsData.status === 'OK' && submissionsData.result) {
        const submissions: CodeforcesSubmission[] = submissionsData.result;
        stats.totalSubmissions = submissions.length;

        // Track solved problems, categories, and languages
        const solvedProblems = new Set<string>();
        const categoryMap = new Map<string, { solved: number; attempted: number }>();
        const ratingMap = new Map<string, { count: number; solved: number; times: number[]; memories: number[] }>();
        const languageMap = new Map<string, { count: number; accepted: number }>();
        const problemMap = new Map<string, { name: string; rating?: number; tags?: string[]; index: string; verdicts: Record<string, number> }>();
        const verdictMap = new Map<string, number>();

        // Calculate time range for practice intensity
        let firstSubmissionTime = Infinity;
        let lastSubmissionTime = 0;

        submissions.forEach((submission) => {
          firstSubmissionTime = Math.min(firstSubmissionTime, submission.creationTimeSeconds);
          lastSubmissionTime = Math.max(lastSubmissionTime, submission.creationTimeSeconds);
          
          const problemKey = `${submission.problem.contestId || 'gym'}-${submission.problem.index}`;
          const ratingCategory = getRatingCategory(submission.problem.rating);

          // Track verdict distribution
          const verdict = submission.verdict;
          verdictMap.set(verdict, (verdictMap.get(verdict) || 0) + 1);

          // Track problem attempts
          if (!problemMap.has(problemKey)) {
            problemMap.set(problemKey, {
              name: submission.problem.name,
              rating: submission.problem.rating,
              tags: submission.problem.tags || [],
              index: submission.problem.index,
              verdicts: {},
            });
          }
          const problem = problemMap.get(problemKey)!;
          problem.verdicts[verdict] = (problem.verdicts[verdict] || 0) + 1;

          // Count verdict types
          switch (verdict) {
            case 'OK':
              stats.acceptedSubmissions++;
              solvedProblems.add(problemKey);
              break;
            case 'WRONG_ANSWER':
              stats.wrongAnswer++;
              break;
            case 'TIME_LIMIT_EXCEEDED':
              stats.timeLimitExceeded++;
              break;
            case 'MEMORY_LIMIT_EXCEEDED':
              stats.memoryLimitExceeded++;
              break;
            case 'RUNTIME_ERROR':
              stats.runtimeError++;
              break;
            case 'COMPILATION_ERROR':
              stats.compilationError++;
              break;
          }

          // Track by category
          if (submission.problem.tags && submission.problem.tags.length > 0) {
            submission.problem.tags.forEach(tag => {
              const category = categorizeTag(tag);
              if (!categoryMap.has(category)) {
                categoryMap.set(category, { solved: 0, attempted: 0 });
              }
              const catStats = categoryMap.get(category)!;
              catStats.attempted++;
              if (verdict === 'OK') {
                catStats.solved++;
              }
            });
          }

          // Track by rating
          if (!ratingMap.has(ratingCategory)) {
            ratingMap.set(ratingCategory, { count: 0, solved: 0, times: [], memories: [] });
          }
          const ratingStats = ratingMap.get(ratingCategory)!;
          ratingStats.count++;
          ratingStats.times.push(submission.timeConsumedMillis);
          ratingStats.memories.push(submission.memoryConsumedBytes);
          if (verdict === 'OK') {
            ratingStats.solved++;
          }

          // Track by language
          const lang = submission.programmingLanguage;
          if (!languageMap.has(lang)) {
            languageMap.set(lang, { count: 0, accepted: 0 });
          }
          const langStats = languageMap.get(lang)!;
          langStats.count++;
          if (verdict === 'OK') {
            langStats.accepted++;
          }

          // Track rating tendency
          if (submission.problem.rating && verdict === 'OK') {
            if (submission.problem.rating <= 1200) {
              stats.ratingTendency.easyProblems++;
            } else if (submission.problem.rating <= 2000) {
              stats.ratingTendency.mediumProblems++;
            } else if (submission.problem.rating <= 3000) {
              stats.ratingTendency.hardProblems++;
            } else {
              stats.ratingTendency.veryHardProblems++;
            }
          }
        });

        stats.solvedProblems = solvedProblems.size;

        // Build category breakdown
        stats.categoryBreakdown = Array.from(categoryMap.entries())
          .map(([categoryName, data]) => ({
            categoryName,
            totalSolved: data.solved,
            totalAttempted: data.attempted,
            successRate: data.attempted > 0 ? Math.round((data.solved / data.attempted) * 100) : 0,
            averageTime: 0, // Placeholder for average time spent
          }))
          .sort((a, b) => b.totalSolved - a.totalSolved);

        // Build rating distribution
        stats.ratingDistribution = Array.from(ratingMap.entries())
          .map(([rating, data]) => ({
            rating: rating as any,
            count: data.count,
            solved: data.solved,
            successRate: data.count > 0 ? Math.round((data.solved / data.count) * 100) : 0,
            avgTimeMillis: data.times.length > 0 ? Math.round(data.times.reduce((a, b) => a + b, 0) / data.times.length) : 0,
            avgMemoryBytes: data.memories.length > 0 ? Math.round(data.memories.reduce((a, b) => a + b, 0) / data.memories.length) : 0,
            tags: [],
          }))
          .sort((a, b) => {
            const ratingOrder: Record<string, number> = {
              'Unrated': 0,
              '1000-1200 (Easy)': 1,
              '1200-1600 (Easy-Medium)': 2,
              '1600-2000 (Medium)': 3,
              '2000-2400 (Medium-Hard)': 4,
              '2400-3000 (Hard)': 5,
              '3000+ (Very Hard)': 6,
            };
            return (ratingOrder[a.rating as string] || 0) - (ratingOrder[b.rating as string] || 0);
          });

        // Build language preference
        stats.languagePreference = Array.from(languageMap.entries())
          .map(([language, data]) => ({
            language,
            count: data.count,
            accepted: data.accepted,
            successRate: data.count > 0 ? Math.round((data.accepted / data.count) * 100) : 0,
          }))
          .sort((a, b) => b.count - a.count);

        // Time spent by rating
        stats.timeSpentByRating = analyzeTimeByRating(submissions);

        // Calculate rating tendency
        const solvedRatings: number[] = [];
        submissions.forEach(sub => {
          if (sub.problem.rating && sub.verdict === 'OK') {
            solvedRatings.push(sub.problem.rating);
          }
        });

        if (solvedRatings.length > 0) {
          const avgRating = solvedRatings.reduce((a, b) => a + b, 0) / solvedRatings.length;
          const minRating = Math.min(...solvedRatings);
          const maxRating = Math.max(...solvedRatings);

          stats.ratingTendency.averageSolvedRating = Math.round(avgRating);
          stats.ratingTendency.preferredRatingRange = { min: minRating, max: maxRating };

          // Calculate success rate by rating
          ratingMap.forEach((data, rating) => {
            const successRate = data.count > 0 ? (data.solved / data.count) * 100 : 0;
            stats.successRateByRating[rating] = Math.round(successRate);
          });
        }

        // Practice intensity metrics
        const daysActive = Math.ceil((lastSubmissionTime - firstSubmissionTime) / (24 * 60 * 60));
        stats.practiceIntensity.daysActive = Math.max(1, daysActive);
        stats.practiceIntensity.submissionsPerDay = Math.round((submissions.length / Math.max(1, daysActive)) * 100) / 100;
        stats.practiceIntensity.consistency = calculateConsistency(submissions);

        // Top problems (most attempted)
        stats.topProblems = Array.from(problemMap.values())
          .sort((a, b) => {
            const aTotal = Object.values(a.verdicts).reduce((x, y) => x + y, 0);
            const bTotal = Object.values(b.verdicts).reduce((x, y) => x + y, 0);
            return bTotal - aTotal;
          })
          .slice(0, 15);

        // Verdict distribution
        stats.verdictDistribution = Object.fromEntries(verdictMap);

        // Get recent submissions (last 20)
        stats.recentSubmissions = submissions.slice(0, 20).map(submission => ({
          id: submission.id,
          contestId: submission.contestId,
          problem: {
            contestId: submission.problem.contestId,
            index: submission.problem.index,
            name: submission.problem.name,
            rating: submission.problem.rating,
            tags: submission.problem.tags,
          },
          verdict: submission.verdict,
          programmingLanguage: submission.programmingLanguage,
          timeConsumedMillis: submission.timeConsumedMillis,
          memoryConsumedBytes: submission.memoryConsumedBytes,
          creationTimeSeconds: submission.creationTimeSeconds,
        }));
      }
    }

    return NextResponse.json({
      user,
      stats,
    });

  } catch (error: any) {
    console.error('Codeforces API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch data from Codeforces' },
      { status: 500 }
    );
  }
}
