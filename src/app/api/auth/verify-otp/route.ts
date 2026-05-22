import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { normalizeEmail } from '@/lib/utils';
import { verifyOtpSchema } from '@/lib/validation';
import { checkOtpAttempts, recordFailedOtpAttempt, clearOtpAttemptRecord } from '@/lib/rateLimiters';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('INVALID_INPUT', 'Invalid request body', 422, parsed.error.format()),
        { status: 422 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const otp = parsed.data.otp;
    const ip = request.headers.get('x-forwarded-for') || 'unknown_ip';

    const rate = await checkOtpAttempts(request as any, {
      email,
      ip,
      purpose: 'verify',
    });

    if (!rate.ok) {
      return NextResponse.json(
        errorResponse('OTP_RATE_LIMITED', 'Invalid code', 429),
        { status: 429 }
      );
    }

    const conn = await connectDB();
    const db = conn.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    const record = await db.collection('emailOtps').findOne({ email, otp, purpose: 'verify' });

    if (!record || !record.expiresAt || new Date(record.expiresAt) < new Date()) {
      await recordFailedOtpAttempt(email, ip, 'verify');
      return NextResponse.json(
        errorResponse('INVALID_CODE', 'Invalid code', 400),
        { status: 400 }
      );
    }

    if (record.registrationData) {
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        await db.collection('emailOtps').deleteMany({ email });
        await clearOtpAttemptRecord(email, ip, 'verify');
        return NextResponse.json(
          successResponse({}, 'If an account exists, an OTP was sent.', 200),
          { status: 200 }
        );
      }

      await db.collection('users').insertOne({
        ...record.registrationData,
        verified: true,
        emailVerified: new Date(),
        totalScore: 0,
        currentStreak: 0,
        maxStreak: 0,
        league: 'bronze',
        rank: 0,
        totalSessions: 0,
        following: [],
        lastSessionDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.collection('emailOtps').deleteMany({ email });
      await clearOtpAttemptRecord(email, ip, 'verify');

      return NextResponse.json(
        successResponse({}, 'Account created and email verified', 200),
        { status: 200 }
      );
    }

    await db.collection('users').updateOne(
      { _id: record.userId },
      {
        $set: {
          verified: true,
          emailVerified: new Date(),
        },
      }
    );

    await db.collection('emailOtps').deleteMany({ userId: record.userId });
    await clearOtpAttemptRecord(email, ip, 'verify');

    return NextResponse.json(
      successResponse({}, 'Email verified', 200),
      { status: 200 }
    );
  }, {
    fallbackCode: 'VERIFY_OTP_FAILURE',
    fallbackMessage: 'Invalid code',
  });
}
