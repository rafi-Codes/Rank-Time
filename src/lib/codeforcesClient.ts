import { getCachedValue, setCachedValue } from '@/lib/cache';
import { logger } from '@/lib/logger';
import { retryWithBackoff } from '@/lib/resilience';

const HANDLE_PATTERN = /^[a-zA-Z0-9_]{1,24}$/;
const SUCCESS_TTL_SECONDS = 24 * 60 * 60;
const FAILURE_TTL_SECONDS = 5 * 60;

export type CodeforcesProblem = {
  contestId?: number;
  index: string;
  name: string;
  rating?: number;
  tags?: string[];
};

export type CodeforcesSubmission = {
  id: number;
  contestId?: number;
  problem: CodeforcesProblem;
  verdict: string;
  programmingLanguage: string;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  creationTimeSeconds: number;
};

export type CodeforcesUser = {
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
};

export type CodeforcesStats = {
  solvedProblems: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  wrongAnswer: number;
  timeLimitExceeded: number;
  memoryLimitExceeded: number;
  runtimeError: number;
  compilationError: number;
  recentSubmissions: CodeforcesSubmission[];
};

export type CodeforcesProfile = {
  user: CodeforcesUser;
  stats: CodeforcesStats;
};

export class CodeforcesClientError extends Error {
  constructor(
    message: string,
    public statusCode = 502,
    public code = 'CODEFORCES_ERROR'
  ) {
    super(message);
  }
}

export function validateCodeforcesHandle(handle: string) {
  const normalized = handle.trim();
  if (!HANDLE_PATTERN.test(normalized)) {
    throw new CodeforcesClientError('Invalid Codeforces handle format', 400, 'INVALID_CODEFORCES_HANDLE');
  }
  return normalized;
}

async function fetchCodeforcesJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'RankTime-App/1.0' },
  });

  if (!response.ok) {
    const statusCode = response.status === 404 ? 404 : response.status === 429 ? 429 : 502;
    throw new CodeforcesClientError('Codeforces request failed', statusCode, 'CODEFORCES_REQUEST_FAILED');
  }

  const data = await response.json();
  if (!data || typeof data !== 'object' || !('status' in data)) {
    throw new CodeforcesClientError('Unexpected Codeforces response', 502, 'CODEFORCES_BAD_RESPONSE');
  }

  const status = (data as { status?: unknown }).status;
  if (status !== 'OK') {
    const comment = (data as { comment?: unknown }).comment;
    const message = typeof comment === 'string' ? comment : 'Codeforces returned an error';
    const isMissingHandle = message.toLowerCase().includes('not found');
    throw new CodeforcesClientError(
      isMissingHandle ? 'Codeforces handle not found' : message,
      isMissingHandle ? 404 : 502,
      isMissingHandle ? 'CODEFORCES_HANDLE_NOT_FOUND' : 'CODEFORCES_API_ERROR'
    );
  }

  return data as T;
}

function buildStats(submissions: CodeforcesSubmission[]): CodeforcesStats {
  const solvedProblems = new Set<string>();
  const stats: CodeforcesStats = {
    solvedProblems: 0,
    totalSubmissions: submissions.length,
    acceptedSubmissions: 0,
    wrongAnswer: 0,
    timeLimitExceeded: 0,
    memoryLimitExceeded: 0,
    runtimeError: 0,
    compilationError: 0,
    recentSubmissions: submissions.slice(0, 20),
  };

  for (const submission of submissions) {
    const problemKey = `${submission.problem.contestId || 'gym'}-${submission.problem.index}`;
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
  }

  stats.solvedProblems = solvedProblems.size;
  return stats;
}

export async function getCodeforcesProfile(handle: string, recentSubmissionLimit = 100) {
  const normalizedHandle = validateCodeforcesHandle(handle);
  const boundedLimit = Math.min(Math.max(recentSubmissionLimit, 1), 200);
  const cacheKey = `codeforces:${normalizedHandle.toLowerCase()}:${boundedLimit}`;
  const cached = await getCachedValue<CodeforcesProfile>(cacheKey);
  if (cached) return cached;

  const failedCacheKey = `codeforces-failed:${normalizedHandle.toLowerCase()}`;
  const cachedFailure = await getCachedValue<{ message: string; statusCode: number; code: string }>(failedCacheKey);
  if (cachedFailure) {
    throw new CodeforcesClientError(cachedFailure.message, cachedFailure.statusCode, cachedFailure.code);
  }

  const startedAt = Date.now();
  try {
    const userData = await retryWithBackoff<{ result: CodeforcesUser[] }>(
      () => fetchCodeforcesJson(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(normalizedHandle)}`),
      { retries: 3, baseDelayMs: 500, timeoutMs: 10000 }
    );

    if (!userData.result?.length) {
      throw new CodeforcesClientError('Codeforces handle not found', 404, 'CODEFORCES_HANDLE_NOT_FOUND');
    }

    const submissionsData = await retryWithBackoff<{ result: CodeforcesSubmission[] }>(
      () =>
        fetchCodeforcesJson(
          `https://codeforces.com/api/user.status?handle=${encodeURIComponent(normalizedHandle)}&from=1&count=${boundedLimit}`
        ),
      { retries: 3, baseDelayMs: 500, timeoutMs: 10000 }
    );

    const profile = {
      user: userData.result[0],
      stats: buildStats(submissionsData.result ?? []),
    };

    await setCachedValue(cacheKey, profile, SUCCESS_TTL_SECONDS);
    logger.info('Codeforces profile fetched', {
      handle: normalizedHandle,
      durationMs: Date.now() - startedAt,
      success: true,
    });
    return profile;
  } catch (error) {
    const clientError =
      error instanceof CodeforcesClientError
        ? error
        : new CodeforcesClientError('Failed to fetch data from Codeforces');
    await setCachedValue(
      failedCacheKey,
      { message: clientError.message, statusCode: clientError.statusCode, code: clientError.code },
      FAILURE_TTL_SECONDS
    );
    logger.warn('Codeforces profile fetch failed', {
      handle: normalizedHandle,
      durationMs: Date.now() - startedAt,
      code: clientError.code,
      statusCode: clientError.statusCode,
    });
    throw clientError;
  }
}
