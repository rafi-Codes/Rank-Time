import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import EmailOtp from '@/models/EmailOtp';
import { hashPassword } from '@/lib/auth';
import { successResponse } from '@/lib/apiResponse';
import { checkOtpAttempts, clearOtpAttempts, recordOtpFailure } from '@/lib/rateLimiters';
import { emailSchema, otpSchema, passwordSchema } from '@/lib/validation';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';

export const runtime = 'nodejs';

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const email = emailSchema.parse(body.email);
  const otp = otpSchema.parse(body.otp);
  const password = passwordSchema.parse(body.password);
  const ip = getClientIp(request);

  await connectDB();

  const attemptCheck = await checkOtpAttempts(email, ip);
  if (!attemptCheck.allowed) {
    throw new ApiError('INVALID_CODE', 'Invalid code', 400, {
      retryAfterSeconds: attemptCheck.retryAfterSeconds,
    });
  }

  const otpRecord = await EmailOtp.findOne({
    email,
    otp,
    purpose: 'reset',
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    await recordOtpFailure(email, ip);
    throw new ApiError('INVALID_CODE', 'Invalid code', 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    await recordOtpFailure(email, ip);
    throw new ApiError('INVALID_CODE', 'Invalid code', 400);
  }

  user.password = await hashPassword(password);
  await user.save();

  await EmailOtp.deleteMany({ email, purpose: 'reset' });
  await clearOtpAttempts(email, ip);

  return successResponse(
    { message: 'Password reset successful' },
    'Password reset successful'
  );
});
