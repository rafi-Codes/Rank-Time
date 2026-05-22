import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Challenge from '@/models/Challenge';
import Badge from '@/models/Badge';
import UserActivity from '@/models/UserActivity';
import { generateChallengesForUser } from '@/lib/challenges';
import User from '@/models/User';
import { DEFAULT_BADGE_BY_ID } from '@/lib/badges';

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

    // Also generate weekly challenges if none exist and we're looking for weekly or all challenges
    if (status === 'active' && (type === 'weekly' || type === 'all')) {
      const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
      if (weeklyChallenges.length === 0) {
        console.log('No weekly challenges found, generating...');
        await generateChallengesForUser(user._id, { daily: false, weekly: true });
        challenges = await Challenge.find(query).sort({ createdAt: -1 }).limit(20);
        console.log('After generation, total challenges:', challenges.length);
        const newWeeklyCount = challenges.filter(c => c.type === 'weekly').length;
        console.log('Weekly challenges generated:', newWeeklyCount);
      }
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

function utcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function countConsecutiveDays(dates: Date[]) {
  const completedDays = new Set(dates.map(utcDateKey));
  let count = 0;
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  while (completedDays.has(utcDateKey(cursor))) {
    count += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return count;
}

async function updateBadgeProgress(userId: string, badgeId: string, progress: number) {
  const badge = DEFAULT_BADGE_BY_ID[badgeId];
  if (!badge) return;

  const earned = progress >= badge.target;
  const insertBadge = {
    ...badge,
    userId,
    ...(earned ? {} : { earned: false }),
  };
  const update = {
    $set: {
      progress,
      ...(earned ? { earned: true, earnedAt: new Date() } : {}),
    },
    $setOnInsert: insertBadge,
  };

  await Badge.findOneAndUpdate(
    { userId, badgeId },
    update,
    { upsert: true }
  );
}

async function checkAndAwardBadges(userId: string, challenge: any) {
  try {
    const completedChallenges = await Challenge.find({
      userId,
      completed: true,
      completedAt: { $exists: true },
    }).select('completedAt difficulty topics').sort({ completedAt: -1 });

    const completedCount = completedChallenges.length;
    await updateBadgeProgress(userId, 'first_steps', completedCount);
    await updateBadgeProgress(userId, 'problem_solver', completedCount);
    await updateBadgeProgress(userId, 'master_coder', completedCount);

    const completedDates = completedChallenges
      .map((completedChallenge) => completedChallenge.completedAt)
      .filter((completedAt): completedAt is Date => completedAt instanceof Date);
    const streakCount = countConsecutiveDays(completedDates);
    await updateBadgeProgress(userId, 'week_streak', streakCount);
    await updateBadgeProgress(userId, 'month_streak', streakCount);

    const hardChallengeCount = completedChallenges.filter((completedChallenge) => completedChallenge.difficulty === 'hard').length;
    await updateBadgeProgress(userId, 'hard_challenge_master', hardChallengeCount);

    const hasTopic = (topics: string[] | undefined, aliases: string[]) =>
      Array.isArray(topics) && topics.some((topic) => aliases.includes(topic.toLowerCase()));

    await updateBadgeProgress(
      userId,
      'array_specialist',
      completedChallenges.filter((completedChallenge) => hasTopic(completedChallenge.topics, ['array', 'arrays', 'string', 'strings'])).length
    );
    await updateBadgeProgress(
      userId,
      'graph_specialist',
      completedChallenges.filter((completedChallenge) => hasTopic(completedChallenge.topics, ['graph', 'graphs', 'tree', 'trees'])).length
    );
    await updateBadgeProgress(
      userId,
      'dynamic_programming_specialist',
      completedChallenges.filter((completedChallenge) => hasTopic(completedChallenge.topics, ['dynamic programming', 'dp'])).length
    );
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}
