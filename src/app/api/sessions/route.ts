// src/app/api/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { problemName, problemRating, laps, totalTime, score, comments } = body;

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate streak bonus
    let streakBonus = 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const lastSession = await Session.findOne({
      userId: user._id,
      createdAt: { $gte: yesterday }
    }).sort({ createdAt: -1 });

    if (lastSession) {
      user.currentStreak += 1;
      if (user.currentStreak > user.maxStreak) {
        user.maxStreak = user.currentStreak;
      }
      streakBonus = Math.floor(user.currentStreak / 5) * 10; // Bonus every 5 streak days
    } else {
      user.currentStreak = 1;
    }

    // Update user stats
    user.totalScore += score + streakBonus;
    user.totalSessions += 1;

    // Update rank based on total score
    const allUsers = await User.find({}).sort({ totalScore: -1 });
    const userRank = allUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;
    user.rank = userRank;

    // Update league based on score
    if (user.totalScore >= 10000) user.league = 'Legend';
    else if (user.totalScore >= 5000) user.league = 'Master';
    else if (user.totalScore >= 2500) user.league = 'Expert';
    else if (user.totalScore >= 1000) user.league = 'Advanced';
    else if (user.totalScore >= 500) user.league = 'Intermediate';
    else user.league = 'Beginner';

    await user.save();

    // Create session
    const newSession = new Session({
      userId: user._id,
      problemName,
      problemRating,
      laps,
      totalTime,
      score: score + streakBonus,
      streakBonus,
      comments
    });

    await newSession.save();

    return NextResponse.json({
      message: 'Session saved successfully',
      session: newSession,
      streakBonus
    });

  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const sessions = await Session.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(sessions);

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}