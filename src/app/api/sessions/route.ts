// src/app/api/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';
import { getLeagueForScore } from '@/lib/league';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { sessionSchema } from '@/lib/validation';
import { sanitizeString } from '@/lib/utils';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getUtcDateString(date: Date) {
  return date.toISOString().split('T')[0];
}

function shouldRetryTransaction(error: unknown) {
  return (
    error instanceof Error &&
    Array.isArray((error as any).errorLabels) &&
    (error as any).errorLabels.includes('TransientTransactionError')
  );
}

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        errorResponse('UNAUTHORIZED', 'Unauthorized', 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = sessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('INVALID_INPUT', 'Session payload is invalid', 422, parsed.error.format()),
        { status: 422 }
      );
    }

    const now = new Date();
    const todayKey = getUtcDateString(now);
    const yesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
    const yesterdayKey = getUtcDateString(yesterday);

    const sanitizedTitle = sanitizeString(parsed.data.problemTitle);
    const sanitizedComments = parsed.data.comments ? sanitizeString(parsed.data.comments) : '';
    const sanitizedProblemUrl = parsed.data.problemUrl || '';

    await connectDB();

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      const transactionSession = await mongoose.startSession();
      try {
        transactionSession.startTransaction({ readConcern: { level: 'local' }, writeConcern: { w: 'majority' } });

        const user = await User.findOne({ email: session.user.email }).session(transactionSession);
        if (!user) {
          await transactionSession.abortTransaction();
          return NextResponse.json(
            errorResponse('USER_NOT_FOUND', 'User not found', 404),
            { status: 404 }
          );
        }

        const lastSessionKey = user.lastSessionDate ? getUtcDateString(new Date(user.lastSessionDate)) : null;
        let currentStreak = 1;
        if (lastSessionKey === todayKey) {
          currentStreak = user.currentStreak || 1;
        } else if (lastSessionKey === yesterdayKey) {
          currentStreak = (user.currentStreak || 0) + 1;
        }

        const baseScore = parsed.data.problemRating * 3;
        let expectedTime = 1800;
        if (parsed.data.problemRating >= 2000) expectedTime = 5400;
        else if (parsed.data.problemRating >= 1600) expectedTime = 3600;
        else if (parsed.data.problemRating >= 1200) expectedTime = 2700;
        const timeBonus = parsed.data.totalTime < expectedTime
          ? Math.floor(((expectedTime - parsed.data.totalTime) / expectedTime) * 50)
          : 0;
        const streakBonus = Math.floor(currentStreak / 5) * 5;
        const totalSessionScore = Math.max(baseScore + timeBonus, 10) + streakBonus;

        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              currentStreak,
              maxStreak: Math.max(user.maxStreak || 0, currentStreak),
              lastSessionDate: now,
              usertag: user.usertag || '',
              league: getLeagueForScore(user.totalScore + totalSessionScore),
              updatedAt: now,
            },
            $inc: {
              totalScore: totalSessionScore,
              totalSessions: 1,
            },
          },
          { new: true, session: transactionSession }
        );

        if (!updatedUser) {
          await transactionSession.abortTransaction();
          throw new Error('Failed to update user stats');
        }

        const rank = (await User.countDocuments({ totalScore: { $gt: updatedUser.totalScore } }).session(transactionSession)) + 1;
        await User.updateOne({ _id: user._id }, { $set: { rank } }, { session: transactionSession });

        const sessionDoc = {
          user: user._id,
          problemId: '',
          problemName: sanitizedTitle,
          problemUrl: sanitizedProblemUrl,
          problemRating: parsed.data.problemRating,
          problemTags: [],
          laps: parsed.data.laps.map((lap) => ({
            name: sanitizeString(lap.name),
            duration: lap.time,
            comment: lap.comment ? sanitizeString(lap.comment) : undefined,
          })),
          totalTime: parsed.data.totalTime,
          score: totalSessionScore,
          streakBonus,
          comments: sanitizedComments,
          codeforcesHandle: updatedUser.codeforcesHandle || '',
        };

        const created = await Session.create([sessionDoc], { session: transactionSession });
        const createdSession = created[0];

        const activityDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        await UserActivity.findOneAndUpdate(
          { userId: user._id, date: activityDate },
          {
            $inc: {
              sessions: 1,
              totalTime: Math.floor(parsed.data.totalTime / 60),
            },
            $set: {
              averageScore: totalSessionScore,
              topics: [sanitizedTitle],
            },
          },
          { upsert: true, new: true, session: transactionSession }
        );

        await transactionSession.commitTransaction();

        return NextResponse.json(
          successResponse(
            { session: createdSession, scoreBreakdown: {
              baseScore,
              timeBonus,
              streakBonus,
              totalScore: totalSessionScore,
            } },
            'Session saved successfully',
            200
          ),
          { status: 200 }
        );
      } catch (error) {
        if (transactionSession.inTransaction()) {
          await transactionSession.abortTransaction();
        }

        if (shouldRetryTransaction(error) && attempt + 1 < maxRetries) {
          attempt += 1;
          continue;
        }

        console.error('Session save transaction failure:', error);
        return NextResponse.json(
          errorResponse('SESSION_SAVE_FAILED', 'Unable to save session', 500),
          { status: 500 }
        );
      } finally {
        transactionSession.endSession();
      }
    }

    return NextResponse.json(
      errorResponse('SESSION_SAVE_FAILED', 'Unable to save session', 500),
      { status: 500 }
    );
  }, {
    fallbackCode: 'SESSION_CREATION_FAILED',
    fallbackMessage: 'Unable to save session',
  });
}

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        errorResponse('UNAUTHORIZED', 'Unauthorized', 401),
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        errorResponse('USER_NOT_FOUND', 'User not found', 404),
        { status: 404 }
      );
    }

    const sessions = await Session.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(
      successResponse({ sessions }, 'Sessions loaded', 200),
      { status: 200 }
    );
  }, {
    fallbackCode: 'SESSION_FETCH_FAILED',
    fallbackMessage: 'Unable to fetch sessions',
  });
}
