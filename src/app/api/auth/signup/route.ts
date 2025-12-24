// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

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

    const result = await db.collection('users').insertOne({
      name: name,
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Created user!', userId: result.insertedId },
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