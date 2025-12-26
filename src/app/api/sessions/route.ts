// src/app/api/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import { generateUserTag } from '@/lib/utils';
import UserActivity from '@/models/UserActivity';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { problemTitle, problemRating, laps, totalTime, comments, problemUrl } = body;
    const problemName = problemTitle || '';
    // ensure numeric values
    const numericProblemRating = Number(problemRating) || 0;
    const numericTotalTime = Number(totalTime) || 0;

    // Calculate score based on problem rating and time
    // Scoring System:
    // - Base Score: problemRating * 3
    // - Time Bonus: Up to 50 points for solving faster than expected time
    //   * <1200 rating: expected 30 min
    //   * 1200-1599: expected 45 min  
    //   * 1600-1999: expected 60 min
    //   * >=2000: expected 90 min
    // - Streak Bonus: 5 points every 5 consecutive days
    // - Minimum score: 10 points
    let baseScore = numericProblemRating * 3; // Base points from rating

    // Time bonus calculation
    let expectedTime = 1800; // 30 minutes default
    if (numericProblemRating >= 2000) expectedTime = 5400; // 90 minutes
    else if (numericProblemRating >= 1600) expectedTime = 3600; // 60 minutes
    else if (numericProblemRating >= 1200) expectedTime = 2700; // 45 minutes

    let timeBonus = 0;
    if (numericTotalTime < expectedTime) {
      timeBonus = Math.floor((expectedTime - numericTotalTime) / expectedTime * 50); // Up to 50 bonus points
    }

    const score = Math.max(baseScore + timeBonus, 10); // Minimum 10 points

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate streak bonus
    let streakBonus = 0;
    const today = new Date();
    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(today.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const lastSessionYesterday = await Session.findOne({
      user: user._id,
      createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd }
    }).sort({ createdAt: -1 });

    if (lastSessionYesterday) {
      user.currentStreak += 1;
      if (user.currentStreak > user.maxStreak) {
        user.maxStreak = user.currentStreak;
      }
      streakBonus = Math.floor(user.currentStreak / 5) * 5; // 5 bonus points every 5 consecutive days
    } else {
      user.currentStreak = 1;
    }

    // Update user stats
    user.totalScore += score + streakBonus;
    user.totalSessions += 1;

    // Ensure usertag exists (for legacy users)
    if (!user.usertag) {
      user.usertag = generateUserTag();
    }

    // Update rank based on total score
    const allUsers = await User.find({}).sort({ totalScore: -1 });
    const userRank = allUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;
    user.rank = userRank;

    // Update league based on score
    if (user.totalScore >= 25000) user.league = 'Legend';
    else if (user.totalScore >= 12000) user.league = 'Master';
    else if (user.totalScore >= 6000) user.league = 'Expert';
    else if (user.totalScore >= 2500) user.league = 'Advanced';
    else if (user.totalScore >= 1200) user.league = 'Intermediate';
    else user.league = 'Beginner';

    await user.save();

    // Map laps from client shape to schema shape
    const mappedLaps = (laps || []).map((lap: any) => ({
      name: lap.name || 'Lap',
      duration: typeof lap.time === 'number' ? lap.time : Number(lap.time) || 0,
      comment: lap.comment || undefined,
    }));

    // Create session (fill required fields with safe defaults when missing)
    const newSession = new Session({
      user: user._id,
      problemId: '',
      problemName,
      problemUrl: problemUrl || '',
      problemRating: numericProblemRating,
      problemTags: [],
      laps: mappedLaps,
      totalTime: numericTotalTime,
      score: score + streakBonus,
      streakBonus,
      comments: comments || '',
      codeforcesHandle: user.codeforcesHandle || ''
    });

    await newSession.save();

    // Update user activity for heatmap
    const activityDate = new Date();
    activityDate.setHours(0, 0, 0, 0);
    
    await UserActivity.findOneAndUpdate(
      { userId: user._id, date: activityDate },
      {
        $inc: { 
          sessions: 1, 
          totalTime: Math.floor(numericTotalTime / 60) // Convert to minutes
        },
        $set: { 
          averageScore: score + streakBonus, // This will be updated with proper average later
          topics: [problemName] // This could be expanded to track topics
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Session saved successfully',
      session: newSession,
      scoreBreakdown: {
        baseScore,
        timeBonus,
        streakBonus,
        totalScore: score + streakBonus
      }
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

    const sessions = await Session.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(sessions);

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}