import { NextRequest } from 'next/server';
import { hashPassword } from '@/lib/auth';
import connectDB from '@/lib/db';
import EmailOtp from '@/models/EmailOtp';
import User from '@/models/User';
import { generateOtp, sendEmail } from '@/lib/email';
import { generateUserTag, normalizeEmail } from '@/lib/utils';
import { successResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';
import { checkPasswordResetAttempts } from '@/lib/rateLimiters';
import { sanitizeText } from '@/lib/validation';
import { ApiError, withErrorHandler } from '@/lib/withErrorHandler';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { password, resend } = body;
  const name = typeof body.name === 'string' ? sanitizeText(body.name) : '';
  const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
  const ip = getClientIp(request);

  await connectDB();

  // Handle resend OTP case
  if (resend && email) {
    const rateLimit = await checkPasswordResetAttempts(email, ip);
    if (!rateLimit.allowed) {
      throw new ApiError('RATE_LIMITED', 'Too many OTP requests. Please try again later.', 429, {
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      });
    }

    const otpRecord = await EmailOtp.findOne({
      email,
      registrationData: { $exists: true }
    });

    if (!otpRecord) {
      throw new ApiError('PENDING_REGISTRATION_NOT_FOUND', 'No pending registration found for this email', 404);
    }

    await EmailOtp.deleteMany({ email });

    const otp = generateOtp(4);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await EmailOtp.create({
      email,
      otp,
      expiresAt,
      purpose: 'registration',
      registrationData: otpRecord.registrationData,
    });

    const subject = 'Your RankTime verification code (resent)';
    const text = `Your new verification code is: ${otp}. It expires in 10 minutes.`;
    const html = `<p>Your new verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;

    try {
      await sendEmail(email, subject, text, html);
      logger.info('Registration OTP resent', { email, ip });
    } catch (err) {
      logger.error('Failed to send OTP email', { email, ip, error: err });
      await EmailOtp.deleteMany({ email });
      throw new ApiError('EMAIL_DELIVERY_FAILED', 'Unable to send verification code right now. Please try again later.', 503);
    }

    return successResponse({ message: 'OTP resent successfully' }, 'OTP resent successfully');
  }

  if (!name || !email || !email.includes('@') || typeof password !== 'string' || password.trim().length < 7) {
    throw new ApiError(
      'INVALID_INPUT',
      'Invalid input - name, valid email, and password (min 7 characters) are required.',
      422
    );
  }

  const rateLimit = await checkPasswordResetAttempts(email, ip);
  if (!rateLimit.allowed) {
    throw new ApiError('RATE_LIMITED', 'Too many OTP requests. Please try again later.', 429, {
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError('USER_EXISTS', 'User exists already!', 422);
  }

  const hashedPassword = await hashPassword(password);

  let usertag;
  let attempts = 0;
  do {
    usertag = generateUserTag();
    attempts++;
    if (attempts > 10) {
      throw new ApiError('USERTAG_GENERATION_FAILED', 'Failed to generate unique usertag. Please try again.', 500);
    }
  } while (await User.exists({ usertag }));

  const otp = generateOtp(4);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  await EmailOtp.deleteMany({ email });

  await EmailOtp.create({
    email,
    otp,
    expiresAt,
    purpose: 'registration',
    registrationData: {
      name,
      email,
      password: hashedPassword,
      usertag,
    },
  });

  const subject = 'Your RankTime verification code';
  const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;
  const html = `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;

  try {
    await sendEmail(email, subject, text, html);
    logger.info('Registration OTP sent', { email, ip });
  } catch (err) {
    logger.error('Failed to send OTP email', { email, ip, error: err });
    await EmailOtp.deleteMany({ email });
    throw new ApiError('EMAIL_DELIVERY_FAILED', 'Unable to send verification code right now. Please try again later.', 503);
  }

  return successResponse(
    { message: 'OTP sent to email for verification' },
    'OTP sent to email for verification'
  );
});
