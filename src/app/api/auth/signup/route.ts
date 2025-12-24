// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { generateOtp, sendEmail } from '@/lib/email';
import { generateUserTag } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, resend } = body;

    // Handle resend OTP case
    if (resend && email) {
      const client = await connectToDatabase();
      const db = client.db();

      const otpRecord = await db.collection('emailOtps').findOne({
        email,
        registrationData: { $exists: true }
      });

      if (!otpRecord) {
        return NextResponse.json(
          { message: 'No pending registration found for this email' },
          { status: 404 }
        );
      }

      // Remove existing OTPs for this email
      await db.collection('emailOtps').deleteMany({ email });

      // Generate new OTP with the same registration data
      const otp = generateOtp(4);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

      await db.collection('emailOtps').insertOne({
        email,
        otp,
        expiresAt,
        createdAt: new Date(),
        registrationData: otpRecord.registrationData,
      });

      // Send OTP email
      try {
        const subject = 'Your RankTime verification code (resent)';
        const text = `Your new verification code is: ${otp}. It expires in 10 minutes.`;
        const html = `<p>Your new verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;
        await sendEmail(email, subject, text, html);
      } catch (err) {
        console.error('Failed to send OTP email:', err);
      }

      return NextResponse.json(
        { message: 'OTP resent successfully' },
        { status: 200 }
      );
    }

    // Handle new user registration
    if (!name || !email || !email.includes('@') || !password || password.trim().length < 7) {
      return NextResponse.json(
        { message: 'Invalid input - name, valid email, and password (min 7 characters) are required.' },
        { status: 422 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email: email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User exists already!' },
        { status: 422 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Generate unique usertag
    let usertag;
    let attempts = 0;
    do {
      usertag = generateUserTag();
      attempts++;
      if (attempts > 10) {
        return NextResponse.json(
          { message: 'Failed to generate unique usertag. Please try again.' },
          { status: 500 }
        );
      }
    } while (await db.collection('users').findOne({ usertag }));

    // Generate OTP and store registration data in OTP record (don't create user yet)
    const otp = generateOtp(4);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

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
    });

    // send OTP email (may throw if SMTP not configured)
    try {
      const subject = 'Your RankTime verification code';
      const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;
      const html = `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;
      await sendEmail(email, subject, text, html);
    } catch (err) {
      console.error('Failed to send OTP email:', err);
    }

    return NextResponse.json(
      { message: 'OTP sent to email for verification' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}