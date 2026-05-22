// src/app/api/auth/forgot-password-otp/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { generateOtp, sendEmail } from '@/lib/email';
import { checkPasswordResetAttempts } from '@/lib/rateLimiters';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { forgotPasswordOtpSchema } from '@/lib/validation';
import { normalizeEmail } from '@/lib/utils';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const parsed = forgotPasswordOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        errorResponse('INVALID_INPUT', 'Invalid email provided', 422, parsed.error.format()),
        { status: 422 }
      );
    }

    const email = normalizeEmail(parsed.data.email);

    const ip = request.headers.get('x-forwarded-for') || 'unknown_ip';
    const rate = await checkPasswordResetAttempts(request as any, {
      email,
      ip,
      purpose: 'reset',
    });

    if (!rate.ok) {
      return NextResponse.json(
        errorResponse('OTP_RATE_LIMITED', 'If an account exists, an OTP was sent.', 429),
        { status: 429 }
      );
    }

    const conn = await connectDB();
    const db = conn.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        successResponse({}, 'If an account exists, an OTP was sent.', 200),
        { status: 200 }
      );
    }

    await db.collection('emailOtps').deleteMany({ email, purpose: 'reset' });

    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection('emailOtps').insertOne({
      email,
      otp,
      purpose: 'reset',
      createdAt: new Date(),
      expiresAt,
    });

    const subject = 'Your RankTime password reset code';
    const text = `Your password reset code is: ${otp}. It expires in 10 minutes.`;
    const html = `<p>Your password reset code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;

    try {
      await sendEmail(email, subject, text, html);
    } catch (err) {
      console.error('Failed to send reset OTP email:', err);
    }

    return NextResponse.json(
      successResponse({}, 'If an account exists, an OTP was sent.', 200),
      { status: 200 }
    );
  }, {
    fallbackCode: 'OTP_REQUEST_FAILED',
    fallbackMessage: 'If an account exists, an OTP was sent.',
  });
}
