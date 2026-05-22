// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { errorResponse, successResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const token = typeof body?.token === 'string' ? body.token : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!token || !password || password.trim().length < 7) {
      return NextResponse.json(
        errorResponse('INVALID_INPUT', 'Invalid request', 400),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse('INVALID_TOKEN', 'Token invalid or expired', 400),
        { status: 400 }
      );
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json(
      successResponse({}, 'Password reset successful', 200),
      { status: 200 }
    );
  }, {
    fallbackCode: 'RESET_PASSWORD_FAILED',
    fallbackMessage: 'Unable to reset password',
  });
}
