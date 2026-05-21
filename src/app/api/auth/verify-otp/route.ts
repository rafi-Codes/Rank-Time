import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { normalizeEmail } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
    const otp = typeof body.otp === 'string' ? body.otp.trim() : '';

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 422 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const record = await db.collection('emailOtps').findOne({ email, otp });
    if (!record) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 400 });
    }

    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      return NextResponse.json({ message: 'Code expired' }, { status: 400 });
    }

    // Check if this is a registration verification (has registrationData)
    if (record.registrationData) {
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        await db.collection('emailOtps').deleteMany({ email });
        return NextResponse.json({ message: 'Email already verified. Please sign in.' }, { status: 200 });
      }

      // Create the user account now that OTP is verified
      await db.collection('users').insertOne({
        ...record.registrationData,
        verified: true,
        emailVerified: new Date(),
        totalScore: 0,
        currentStreak: 0,
        maxStreak: 0,
        league: 'bronze',
        rank: 0,
        totalSessions: 0,
        following: [],
        lastSessionDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Remove used OTPs for this email
      await db.collection('emailOtps').deleteMany({ email });

      return NextResponse.json({ message: 'Account created and email verified' }, { status: 200 });
    } else {
      // This is an existing user verification
      // Mark user as verified
      await db.collection('users').updateOne(
        { _id: record.userId },
        {
          $set: {
            verified: true,
            emailVerified: new Date(),
          },
        }
      );

      // Remove used OTPs for this user/email
      await db.collection('emailOtps').deleteMany({ userId: record.userId });

      return NextResponse.json({ message: 'Email verified' }, { status: 200 });
    }
  } catch (error) {
    console.error('verify-otp error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
