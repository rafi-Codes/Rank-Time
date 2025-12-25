import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Badge from '@/models/Badge';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // achievement, streak, skill, challenge
    const earned = searchParams.get('earned'); // true, false, or null for all

    let query: any = { userId: session.user.id };

    if (category) {
      query.category = category;
    }

    if (earned !== null && earned !== undefined) {
      query.earned = earned === 'true';
    }

    const badges = await Badge.find(query)
      .sort({ earned: -1, earnedAt: -1, createdAt: -1 });

    // Calculate progress for unearned badges
    const badgesWithProgress = badges.map(badge => {
      const badgeObj = badge.toObject();
      if (!badgeObj.earned && badgeObj.target && badgeObj.progress !== undefined) {
        badgeObj.progressPercentage = Math.min((badgeObj.progress / badgeObj.target) * 100, 100);
      }
      return badgeObj;
    });

    return NextResponse.json({ badges: badgesWithProgress });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Initialize default badges for a user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const defaultBadges = [
      // Achievement badges
      {
        badgeId: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first challenge',
        icon: '🎯',
        category: 'achievement',
        target: 1
      },
      {
        badgeId: 'problem_solver',
        name: 'Problem Solver',
        description: 'Complete 10 challenges',
        icon: '🧠',
        category: 'achievement',
        target: 10
      },
      {
        badgeId: 'master_coder',
        name: 'Master Coder',
        description: 'Complete 50 challenges',
        icon: '👑',
        category: 'achievement',
        target: 50
      },

      // Streak badges
      {
        badgeId: 'week_streak',
        name: 'Week Warrior',
        description: 'Complete challenges for 7 consecutive days',
        icon: '🔥',
        category: 'streak',
        target: 7
      },
      {
        badgeId: 'month_streak',
        name: 'Monthly Champion',
        description: 'Complete challenges for 30 consecutive days',
        icon: '⭐',
        category: 'streak',
        target: 30
      },

      // Skill badges
      {
        badgeId: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete 5 challenges in under 30 minutes each',
        icon: '⚡',
        category: 'skill',
        target: 5
      },
      {
        badgeId: 'hard_challenge_master',
        name: 'Hard Challenge Master',
        description: 'Complete 10 hard difficulty challenges',
        icon: '💪',
        category: 'skill',
        target: 10
      },

      // Category specialist badges
      {
        badgeId: 'array_specialist',
        name: 'Array Specialist',
        description: 'Complete 10 array-related challenges',
        icon: '📊',
        category: 'skill',
        target: 10
      },
      {
        badgeId: 'graph_specialist',
        name: 'Graph Specialist',
        description: 'Complete 10 graph-related challenges',
        icon: '🕸️',
        category: 'skill',
        target: 10
      },
      {
        badgeId: 'dynamic_programming_specialist',
        name: 'DP Specialist',
        description: 'Complete 10 dynamic programming challenges',
        icon: '🧮',
        category: 'skill',
        target: 10
      }
    ];

    const badgesToInsert = defaultBadges.map(badge => ({
      ...badge,
      userId: session.user.id,
      earned: false,
      progress: 0
    }));

    // Insert badges, ignoring duplicates
    const insertedBadges = await Badge.insertMany(badgesToInsert, { ordered: false })
      .catch(err => {
        // Ignore duplicate key errors
        if (err.code === 11000) return [];
        throw err;
      });

    return NextResponse.json({
      success: true,
      badges: insertedBadges || []
    });
  } catch (error) {
    console.error('Error initializing badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}