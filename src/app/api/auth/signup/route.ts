// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import connectDB from '@/lib/db';
import { generateOtp, sendEmail } from '@/lib/email';
import { generateUserTag, normalizeEmail } from '@/lib/utils';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const { name, password, resend } = body;
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';

    if (resend && email) {
      const conn = await connectDB();
      const db = conn.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }

      const otpRecord = await db.collection('emailOtps').findOne({
        email,
        registrationData: { $exists: true },
      });

      if (!otpRecord) {
        return NextResponse.json(
          errorResponse('PENDING_SIGNUP_NOT_FOUND', 'No pending registration found for this email', 404),
          { status: 404 }
        );
      }

      await db.collection('emailOtps').deleteMany({ email });

      const otp = generateOtp(4);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

      await db.collection('emailOtps').insertOne({
        email,
        otp,
        expiresAt,
        createdAt: new Date(),
        registrationData: otpRecord.registrationData,
        purpose: 'verify',
      });

      try {
        await sendEmail(
          email,
          'Your RankTime verification code (resent)',
          `Your new verification code is: ${otp}. It expires in 10 minutes.`,
          `<p>Your new verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
        );
      } catch (err) {
        console.error('Failed to send OTP email:', err);
        await db.collection('emailOtps').deleteMany({ email });
        return NextResponse.json(
          errorResponse('EMAIL_SEND_FAILED', 'Unable to send verification code right now. Please try again later.', 503),
          { status: 503 }
        );
      }

      return NextResponse.json(
        successResponse({}, 'OTP resent successfully', 200),
        { status: 200 }
      );
    }

    if (!name || !email || !email.includes('@') || !password || password.trim().length < 7) {
      return NextResponse.json(
        errorResponse('INVALID_INPUT', 'Invalid input - name, valid email, and password (min 7 characters) are required.', 422),
        { status: 422 }
      );
    }

    const conn = await connectDB();
    const db = conn.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        errorResponse('USER_EXISTS', 'User already exists', 422),
        { status: 422 }
      );
    }

    const hashedPassword = await hashPassword(password);
    let usertag;
    let attempts = 0;
    do {
      usertag = generateUserTag();
      attempts++;
      if (attempts > 10) {
        return NextResponse.json(
          errorResponse('USERTAG_GENERATION_FAILED', 'Failed to generate unique usertag. Please try again.', 500),
          { status: 500 }
        );
      }
    } while (await db.collection('users').findOne({ usertag }));

    const otp = generateOtp(4);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await db.collection('emailOtps').deleteMany({ email });
    await db.collection('emailOtps').insertOne({
      email,
      otp,
      expiresAt,
      createdAt: new Date(),
      registrationData: {
        name,
        email,
        password: hashedPassword,
        usertag,
      },
      purpose: 'verify',
    });

    try {
      await sendEmail(
        email,
        'Your RankTime verification code',
        `Your verification code is: ${otp}. It expires in 10 minutes.`,
        `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
      );
    } catch (err) {
      console.error('Failed to send OTP email:', err);
      await db.collection('emailOtps').deleteMany({ email });
      return NextResponse.json(
        errorResponse('EMAIL_SEND_FAILED', 'Unable to send verification code right now. Please try again later.', 503),
        { status: 503 }
      );
    }

    return NextResponse.json(
      successResponse({}, 'OTP sent to email for verification', 200),
      { status: 200 }
    );
  }, {
    fallbackCode: 'SIGNUP_FAILED',
    fallbackMessage: 'Unable to create account',
  });
}
