// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to avoid leaking which emails are registered
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset email was sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const baseUrl = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL.replace(/\/+$/, '') : '';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const subject = 'RankTime password reset request';
    const text = `To reset your password, visit: ${resetLink} . This link expires in 1 hour.`;
    const html = `<p>To reset your password, click the link below. This link expires in 1 hour.</p><p><a href="${resetLink}">Reset password</a></p>`;

    try {
      await sendEmail(user.email, subject, text, html);
    } catch (err) {
      console.error('Failed to send reset email:', err);
      // continue silently — don't expose email failures to requester
    }

    return NextResponse.json({ message: 'If an account exists, a reset email was sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
