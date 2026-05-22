import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Badge from '@/models/Badge';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { DEFAULT_BADGES } from '@/lib/badges';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(errorResponse('UNAUTHORIZED', 'Unauthorized', 401), { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const earned = searchParams.get('earned');

    const query: Record<string, unknown> = { userId: session.user.id };
    if (category) {
      query.category = category;
    }

    if (earned !== null) {
      query.earned = earned === 'true';
    }

    const badges = await Badge.find(query).sort({ earned: -1, earnedAt: -1, createdAt: -1 });

    const badgesWithProgress = badges.map((badge) => {
      const badgeObj = badge.toObject();
      if (!badgeObj.earned && badgeObj.target && badgeObj.progress !== undefined) {
        badgeObj.progressPercentage = Math.min((badgeObj.progress / badgeObj.target) * 100, 100);
      }
      return badgeObj;
    });

    return NextResponse.json(successResponse({ badges: badgesWithProgress }, 'Badges loaded', 200), { status: 200 });
  }, {
    fallbackCode: 'BADGES_FETCH_FAILED',
    fallbackMessage: 'Unable to load badges',
  });
}

export async function POST() {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(errorResponse('UNAUTHORIZED', 'Unauthorized', 401), { status: 401 });
    }

    await dbConnect();

    const badgesToInsert = DEFAULT_BADGES.map((badge) => ({
      ...badge,
      userId: session.user.id,
      earned: false,
      progress: 0,
    }));

    const insertedBadges = await Badge.insertMany(badgesToInsert, { ordered: false }).catch((err) => {
      if (err.code === 11000) return [];
      throw err;
    });

    return NextResponse.json(successResponse({ badges: insertedBadges || [] }, 'Badges initialized', 200), { status: 200 });
  }, {
    fallbackCode: 'BADGES_INIT_FAILED',
    fallbackMessage: 'Unable to initialize badges',
  });
}
