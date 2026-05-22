// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import { getAppBaseUrl, normalizeEmail } from '@/lib/utils';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { errorResponse, successResponse } from '@/lib/apiResponse';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        errorResponse('INVALID_EMAIL', 'Invalid email address', 400),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        successResponse({}, 'If an account exists, a reset email was sent.', 200),
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const baseUrl = getAppBaseUrl();
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const subject = 'RankTime password reset request';
    const text = `To reset your password, visit: ${resetLink}. This link expires in 1 hour.`;
    const html = `<p>To reset your password, click the link below. This link expires in 1 hour.</p><p><a href="${resetLink}">Reset password</a></p>`;

    try {
      await sendEmail(user.email, subject, text, html);
    } catch (err) {
      // Log but do not leak error details to client
      // using console here is acceptable for serverless logs
      console.error('Failed to send reset email:', err);
    }

    return NextResponse.json(
      successResponse({}, 'If an account exists, a reset email was sent.', 200),
      { status: 200 }
    );
  }, {
    fallbackCode: 'FORGOT_PASSWORD_FAILED',
    fallbackMessage: 'Unable to process password reset request',
  });
}
