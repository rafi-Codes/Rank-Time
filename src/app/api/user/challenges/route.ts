import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import UserActivity from '@/models/UserActivity';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'daily'; // daily, weekly, monthly
    const status = searchParams.get('status') || 'active'; // active, completed, expired

    const now = new Date();
    let query: any = { userId: session.user.id };

    // Filter by type and status
    if (type !== 'all') {
      query.type = type;
    }

    if (status === 'active') {
      query.deadline = { $gte: now };
      query.completed = false;
    } else if (status === 'completed') {
      query.completed = true;
    } else if (status === 'expired') {
      query.deadline = { $lt: now };
      query.completed = false;
    }

    const challenges = await Challenge.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { challengeId, action } = body;

    if (!challengeId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const challenge = await Challenge.findOne({
      _id: challengeId,
      userId: session.user.id
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    if (action === 'complete') {
      if (challenge.completed) {
        return NextResponse.json({ error: 'Challenge already completed' }, { status: 400 });
      }

      if (new Date() > challenge.deadline) {
        return NextResponse.json({ error: 'Challenge has expired' }, { status: 400 });
      }

      // Mark challenge as completed
      challenge.completed = true;
      challenge.completedAt = new Date();
      await challenge.save();

      // Award points and check for badges
      const pointsEarned = challenge.points + (challenge.bonusPoints || 0);

      // Log activity
      await UserActivity.create({
        userId: session.user.id,
        activityType: 'challenge_completed',
        description: `Completed ${challenge.type} challenge: ${challenge.title}`,
        points: pointsEarned,
        metadata: {
          challengeId: challenge._id,
          difficulty: challenge.difficulty,
          category: challenge.category
        }
      });

      // Check for streak badges or other achievements
      await checkAndAwardBadges(session.user.id, challenge);

      return NextResponse.json({
        success: true,
        pointsEarned,
        challenge: challenge
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkAndAwardBadges(userId: string, challenge: any) {
  try {
    // Check for challenge completion streak
    const recentChallenges = await Challenge.find({
      userId,
      completed: true,
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }).sort({ completedAt: -1 });

    const streakCount = recentChallenges.length;

    // Award streak badges
    if (streakCount >= 7) {
      await Badge.findOneAndUpdate(
        { userId, badgeId: 'week_streak' },
        {
          earned: true,
          earnedAt: new Date(),
          progress: streakCount
        },
        { upsert: true }
      );
    }

    // Award difficulty-specific badges
    if (challenge.difficulty === 'hard' && challenge.completed) {
      await Badge.findOneAndUpdate(
        { userId, badgeId: 'hard_challenge_master' },
        {
          earned: true,
          earnedAt: new Date(),
          progress: 1
        },
        { upsert: true }
      );
    }

    // Category-specific achievements
    const categoryChallenges = await Challenge.find({
      userId,
      category: challenge.category,
      completed: true
    });

    if (categoryChallenges.length >= 10) {
      await Badge.findOneAndUpdate(
        { userId, badgeId: `${challenge.category}_specialist` },
        {
          earned: true,
          earnedAt: new Date(),
          progress: categoryChallenges.length
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}