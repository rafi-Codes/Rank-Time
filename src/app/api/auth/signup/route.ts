// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { generateOtp, sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

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

    // Create user as unverified
    const result = await db.collection('users').insertOne({
      name: name,
      email: email,
      password: hashedPassword,
      verified: false,
      createdAt: new Date(),
    });

    // Generate OTP and store in separate collection
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    await db.collection('emailOtps').insertOne({
      userId: result.insertedId,
      email,
      otp,
      expiresAt,
      createdAt: new Date(),
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
      { message: 'Created user! OTP sent to email', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}