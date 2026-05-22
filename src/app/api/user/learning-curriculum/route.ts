import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateLearningCurriculum } from '@/lib/aiTutor';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(errorResponse('UNAUTHORIZED', 'Unauthorized', 401), { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(errorResponse('USER_NOT_FOUND', 'User not found', 404), { status: 404 });
    }

    const curriculum = await generateLearningCurriculum(user._id);

    return NextResponse.json(successResponse({ curriculum }, 'Learning curriculum generated successfully', 200), { status: 200 });
  } catch (error) {
    console.error('Error generating learning curriculum:', error);
    return NextResponse.json(errorResponse('CURRICULUM_GENERATION_FAILED', 'Unable to generate learning curriculum', 500), { status: 500 });
  }
}
