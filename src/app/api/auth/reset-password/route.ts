// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string' || !password || typeof password !== 'string' || password.trim().length < 7) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Token invalid or expired' }, { status: 400 });
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
