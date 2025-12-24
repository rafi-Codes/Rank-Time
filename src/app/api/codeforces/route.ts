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
};

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

    // Fetch user submissions (limit to recent 100 for performance)
    const submissionsResponse = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=100`,
      {
        headers: {
          'User-Agent': 'RankTime-App/1.0',
        },
      }
    );

    let stats = {
      solvedProblems: 0,
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      wrongAnswer: 0,
      timeLimitExceeded: 0,
      memoryLimitExceeded: 0,
      runtimeError: 0,
      compilationError: 0,
      recentSubmissions: [] as any[],
    };

    if (submissionsResponse.ok) {
      const submissionsData = await submissionsResponse.json();

      if (submissionsData.status === 'OK' && submissionsData.result) {
        const submissions: CodeforcesSubmission[] = submissionsData.result;
        stats.totalSubmissions = submissions.length;

        // Track solved problems
        const solvedProblems = new Set<string>();

        submissions.forEach((submission) => {
          const problemKey = `${submission.problem.contestId || 'gym'}-${submission.problem.index}`;

          // Count verdict types
          switch (submission.verdict) {
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
        });

        stats.solvedProblems = solvedProblems.size;

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