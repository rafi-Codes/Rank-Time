import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import EmailOtp from '@/models/EmailOtp';
import User from '@/models/User';
import { successResponse } from '@/lib/apiResponse';
import { checkOtpAttempts, clearOtpAttempts, recordOtpFailure } from '@/lib/rateLimiters';
import { emailSchema, otpSchema } from '@/lib/validation';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const email = emailSchema.parse(body.email);
  const otp = otpSchema.parse(body.otp);
  const ip = getClientIp(request);

  await connectDB();

  const attemptCheck = await checkOtpAttempts(email, ip);
  if (!attemptCheck.allowed) {
    throw new ApiError('INVALID_CODE', 'Invalid code', 400, {
      retryAfterSeconds: attemptCheck.retryAfterSeconds,
    });
  }

  const record = await EmailOtp.findOne({ email, otp, expiresAt: { $gt: new Date() } });
  if (!record) {
    await recordOtpFailure(email, ip);
    throw new ApiError('INVALID_CODE', 'Invalid code', 400);
  }

  if (record.registrationData) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await EmailOtp.deleteMany({ email });
      await clearOtpAttempts(email, ip);
      return successResponse(
        { message: 'Email already verified. Please sign in.' },
        'Email already verified. Please sign in.'
      );
    }

    await User.create({
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
    });

    await EmailOtp.deleteMany({ email });
    await clearOtpAttempts(email, ip);

    return successResponse(
      { message: 'Account created and email verified' },
      'Account created and email verified'
    );
  }

  await User.updateOne(
    { _id: record.userId },
    {
      $set: {
        verified: true,
        emailVerified: new Date(),
      },
    }
  );

  await EmailOtp.deleteMany({ userId: record.userId });
  await clearOtpAttempts(email, ip);

  return successResponse({ message: 'Email verified' }, 'Email verified');
});
