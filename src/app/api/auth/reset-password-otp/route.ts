// src/app/api/auth/reset-password-otp/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, password } = body;

    if (!email || !otp || !password) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.trim().length < 7) {
      return NextResponse.json({ message: 'Password must be at least 7 characters' }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const otpRecord = await db.collection('emailOtps').findOne({
      email: email.toLowerCase(),
      otp,
      purpose: 'reset',
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return NextResponse.json({ message: 'Invalid or expired code' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.password = await hashPassword(password);
    await user.save();

    // cleanup used otps
    await db.collection('emailOtps').deleteMany({ email: email.toLowerCase(), purpose: 'reset' });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('reset-password-otp error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
