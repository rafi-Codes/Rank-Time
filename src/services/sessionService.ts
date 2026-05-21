import mongoose from 'mongoose';
import Session from '@/models/Session';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';
import { getLeagueForScore } from '@/lib/league';
import { acquireLock } from '@/lib/locks';
import { logger } from '@/lib/logger';
import { sessionSchema } from '@/lib/validation';

type SessionInput = ReturnType<typeof sessionSchema.parse>;
type ScoreBreakdown = {
  baseScore: number;
  timeBonus: number;
  streakBonus: number;
  totalScore: number;
};

function toUtcDateKey(date: Date) {
  return date.toISOString().split('T')[0];
}

function addUtcDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toUtcDateKey(date);
}

function calculateScore(problemRating: number, totalTime: number) {
  const baseScore = problemRating * 3;
  let expectedTime = 1800;
  if (problemRating >= 2000) expectedTime = 5400;
  else if (problemRating >= 1600) expectedTime = 3600;
  else if (problemRating >= 1200) expectedTime = 2700;

  const timeBonus = totalTime < expectedTime
    ? Math.floor(((expectedTime - totalTime) / expectedTime) * 50)
    : 0;

  return {
    baseScore,
    timeBonus,
    score: Math.max(baseScore + timeBonus, 10),
  };
}

function calculateStreak(
  currentStreak: number,
  maxStreak: number,
  lastSessionDate: Date | undefined,
  now: Date
) {
  const todayKey = toUtcDateKey(now);
  const yesterdayKey = addUtcDays(todayKey, -1);
  const lastSessionKey = lastSessionDate ? toUtcDateKey(new Date(lastSessionDate)) : null;

  let nextStreak = currentStreak || 0;
  if (lastSessionKey === todayKey) {
    nextStreak = currentStreak || 1;
  } else if (lastSessionKey === yesterdayKey) {
    nextStreak = (currentStreak || 0) + 1;
  } else {
    nextStreak = 1;
  }

  return {
    currentStreak: nextStreak,
    maxStreak: Math.max(maxStreak || 0, nextStreak),
    streakBonus: Math.floor(nextStreak / 5) * 5,
  };
}

export async function createSessionForUser(email: string, input: SessionInput, correlationId: string) {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const releaseLock = await acquireLock(`session:${user._id.toString()}`);
  const transaction = await mongoose.startSession();

  try {
    let createdSession: InstanceType<typeof Session> | null = null;
    let scoreBreakdown: ScoreBreakdown | null = null;

    await transaction.withTransaction(
      async () => {
        const transactionUser = await User.findById(user._id).session(transaction);
        if (!transactionUser) {
          throw new Error('User disappeared during session transaction');
        }

        const now = new Date();
        const { baseScore, timeBonus, score } = calculateScore(input.problemRating, input.totalTime);
        const streak = calculateStreak(
          transactionUser.currentStreak || 0,
          transactionUser.maxStreak || 0,
          transactionUser.lastSessionDate,
          now
        );
        const totalSessionScore = score + streak.streakBonus;
        const nextTotalScore = (transactionUser.totalScore || 0) + totalSessionScore;

        const mappedLaps = input.laps.map((lap) => ({
          name: lap.name,
          duration: lap.time,
          comment: lap.comment,
        }));

        const [session] = await Session.create(
          [
            {
              user: transactionUser._id,
              problemId: '',
              problemName: input.problemTitle,
              problemUrl: input.problemUrl || '',
              problemRating: input.problemRating,
              problemTags: [],
              laps: mappedLaps,
              totalTime: input.totalTime,
              score: totalSessionScore,
              streakBonus: streak.streakBonus,
              comments: input.comments || '',
              codeforcesHandle: transactionUser.codeforcesHandle || '',
            },
          ],
          { session: transaction }
        );

        transactionUser.currentStreak = streak.currentStreak;
        transactionUser.maxStreak = streak.maxStreak;
        transactionUser.totalScore = nextTotalScore;
        transactionUser.totalSessions = (transactionUser.totalSessions || 0) + 1;
        transactionUser.lastSessionDate = now;
        transactionUser.league = getLeagueForScore(nextTotalScore);
        transactionUser.rank = (await User.countDocuments({ totalScore: { $gt: nextTotalScore } }).session(transaction)) + 1;
        await transactionUser.save({ session: transaction });

        await UserActivity.findOneAndUpdate(
          { userId: transactionUser._id, date: new Date(`${toUtcDateKey(now)}T00:00:00.000Z`) },
          {
            $inc: {
              sessions: 1,
              totalTime: Math.floor(input.totalTime / 60),
            },
            $set: {
              averageScore: totalSessionScore,
              topics: [input.problemTitle],
            },
          },
          { upsert: true, new: true, session: transaction }
        );

        createdSession = session;
        scoreBreakdown = {
          baseScore,
          timeBonus,
          streakBonus: streak.streakBonus,
          totalScore: totalSessionScore,
        };

        logger.info('Session created', {
          correlationId,
          userId: transactionUser._id.toString(),
          scoreBreakdown,
        });
      },
      { maxCommitTimeMS: 5000 }
    );

    if (!createdSession || !scoreBreakdown) {
      throw new Error('Session transaction did not produce a result');
    }

    return { session: createdSession, scoreBreakdown };
  } finally {
    await transaction.endSession();
    releaseLock();
  }
}
