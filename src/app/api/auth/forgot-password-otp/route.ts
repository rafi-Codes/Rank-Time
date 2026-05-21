import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import EmailOtp from '@/models/EmailOtp';
import { generateOtp, sendEmail } from '@/lib/email';
import { successResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';
import { checkPasswordResetAttempts } from '@/lib/rateLimiters';
import { emailSchema } from '@/lib/validation';
import { withErrorHandler } from '@/lib/withErrorHandler';

export const runtime = 'nodejs';

const GENERIC_MESSAGE = 'If an account exists, an OTP was sent.';

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const email = emailSchema.parse(body.email);
  const ip = getClientIp(request);

  await connectDB();

  const rateLimit = await checkPasswordResetAttempts(email, ip);
  if (!rateLimit.allowed) {
    logger.warn('Password reset OTP request rate limited', { email, ip });
    return successResponse(
      { message: GENERIC_MESSAGE, retryAfterSeconds: rateLimit.retryAfterSeconds },
      GENERIC_MESSAGE
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return successResponse({ message: GENERIC_MESSAGE }, GENERIC_MESSAGE);
  }

  await EmailOtp.deleteMany({ email, purpose: 'reset' });

  const otp = generateOtp(6);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  await EmailOtp.create({
    email,
    otp,
    purpose: 'reset',
    expiresAt,
  });

  const subject = 'Your RankTime password reset code';
  const text = `Your password reset code is: ${otp}. It expires in 10 minutes.`;
  const html = `<p>Your password reset code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;

  try {
    await sendEmail(email, subject, text, html);
    logger.info('Password reset OTP email sent', { email, ip });
  } catch (err) {
    logger.error('Failed to send reset OTP email', { email, ip, error: err });
  }

  return successResponse({ message: GENERIC_MESSAGE }, GENERIC_MESSAGE);
});
