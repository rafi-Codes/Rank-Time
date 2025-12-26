// src/app/api/auth/forgot-password-otp/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { generateOtp, sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const user = await db.collection('users').findOne({ email: email.toLowerCase() });

    // Always return success (avoid account enumeration)
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, an OTP was sent.' });
    }

    // Remove previous reset OTPs for this email
    await db.collection('emailOtps').deleteMany({ email: email.toLowerCase(), purpose: 'reset' });

    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    await db.collection('emailOtps').insertOne({
      email: email.toLowerCase(),
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

    return NextResponse.json({ message: 'If an account exists, an OTP was sent.' });
  } catch (err) {
    console.error('forgot-password-otp error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
