// src/app/api/auth/reset-password-otp/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { normalizeEmail } from '@/lib/utils';
import { resetPasswordOtpSchema } from '@/lib/validation';
import { checkOtpAttempts, recordFailedOtpAttempt, clearOtpAttemptRecord } from '@/lib/rateLimiters';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const parsed = resetPasswordOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('INVALID_INPUT', 'Invalid reset payload', 422, parsed.error.format()),
        { status: 422 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const otp = parsed.data.otp;
    const password = parsed.data.password;
    const ip = request.headers.get('x-forwarded-for') || 'unknown_ip';

    const rate = await checkOtpAttempts(request as any, {
      email,
      ip,
      purpose: 'reset',
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

    const otpRecord = await db.collection('emailOtps').findOne({
      email,
      otp,
      purpose: 'reset',
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      await recordFailedOtpAttempt(email, ip, 'reset');
      return NextResponse.json(
        errorResponse('INVALID_CODE', 'Invalid code', 400),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Keep failure message generic to avoid account enumeration.
      await recordFailedOtpAttempt(email, ip, 'reset');
      return NextResponse.json(
        errorResponse('INVALID_CODE', 'Invalid code', 400),
        { status: 400 }
      );
    }

    user.password = await hashPassword(password);
    await user.save();

    await db.collection('emailOtps').deleteMany({ email, purpose: 'reset' });
    await clearOtpAttemptRecord(email, ip, 'reset');

    return NextResponse.json(
      successResponse({}, 'Password reset successful', 200),
      { status: 200 }
    );
  }, {
    fallbackCode: 'RESET_PASSWORD_FAILED',
    fallbackMessage: 'Invalid code',
  });
}
