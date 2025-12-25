import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import UserActivity from '@/models/UserActivity';
import { generateChallengesForUser } from '@/lib/challenges';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'daily';
    const status = searchParams.get('status') || 'active';

    const now = new Date();
    let query: any = { userId: user._id };

    if (type !== 'all') query.type = type;

    if (status === 'active') {
      query.deadline = { $gte: now };
      query.completed = false;
    } else if (status === 'completed') {
      query.completed = true;
    } else if (status === 'expired') {
      query.deadline = { $lt: now };
      query.completed = false;
    }

    let challenges = await Challenge.find(query).sort({ createdAt: -1 }).limit(20);

    if (challenges.length === 0 && status === 'active') {
      await generateChallengesForUser(user._id);
      challenges = await Challenge.find(query).sort({ createdAt: -1 }).limit(20);
    }

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { challengeId, action } = body;

    if (!challengeId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const challenge = await Challenge.findOne({ _id: challengeId, userId: user._id });
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

      challenge.completed = true;
      challenge.completedAt = new Date();
      await challenge.save();

      const pointsEarned = (challenge.points || 0) + (challenge.bonusPoints || 0);

      await UserActivity.create({
        userId: user._id,
        activityType: 'challenge_completed',
        description: `Completed ${challenge.type} challenge: ${challenge.title}`,
        points: pointsEarned,
        metadata: {
          challengeId: challenge._id,
          difficulty: challenge.difficulty,
          category: challenge.category
        }
      });

      await checkAndAwardBadges(user._id, challenge);

      return NextResponse.json({ success: true, pointsEarned, challenge });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkAndAwardBadges(userId: string, challenge: any) {
  try {
    const recentChallenges = await Challenge.find({
      userId,
      completed: true,
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ completedAt: -1 });

    const streakCount = recentChallenges.length;

    if (streakCount >= 7) {
      await Badge.findOneAndUpdate(
        { userId, badgeId: 'week_streak' },
        { earned: true, earnedAt: new Date(), progress: streakCount },
        { upsert: true }
      );
    }

    if (challenge.difficulty === 'hard' && challenge.completed) {
      await Badge.findOneAndUpdate(
        { userId, badgeId: 'hard_challenge_master' },
        { earned: true, earnedAt: new Date(), progress: 1 },
        { upsert: true }
      );
    }

    const categoryChallenges = await Challenge.find({ userId, category: challenge.category, completed: true });
    if (categoryChallenges.length >= 10) {
      await Badge.findOneAndUpdate(
        { userId, badgeId: `${challenge.category}_specialist` },
        { earned: true, earnedAt: new Date(), progress: categoryChallenges.length },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}
