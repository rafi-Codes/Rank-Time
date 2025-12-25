// src/app/api/sessions/replay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import { OpenRouter } from '@openrouter/sdk';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get the specific session
    const sessionData = await Session.findOne({
      _id: sessionId,
      userId: user._id
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get recent sessions for context (last 5 sessions)
    const recentSessions = await Session.find({
      userId: user._id,
      createdAt: { $lte: sessionData.createdAt }
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // Generate AI analysis for this session
    const analysis = await generateSessionAnalysis(sessionData, recentSessions);

    return NextResponse.json({
      session: {
        _id: sessionData._id,
        problemName: sessionData.problemName,
        problemRating: sessionData.problemRating,
        laps: sessionData.laps,
        totalTime: sessionData.totalTime,
        score: sessionData.score,
        streakBonus: sessionData.streakBonus,
        comments: sessionData.comments,
        createdAt: sessionData.createdAt
      },
      analysis
    });

  } catch (error) {
    console.error('Error fetching session replay:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateSessionAnalysis(sessionData: any, recentSessions: any[]) {
  try {
    const openRouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Calculate performance metrics
    const avgTimePerLap = sessionData.totalTime / sessionData.laps;
    const baseScore = sessionData.score - sessionData.streakBonus;

    // Compare with recent sessions
    const recentAvgRating = recentSessions.length > 1
      ? recentSessions.slice(1).reduce((sum, s) => sum + s.problemRating, 0) / (recentSessions.length - 1)
      : sessionData.problemRating;

    const ratingProgress = sessionData.problemRating - recentAvgRating;

    const systemPrompt = `You are an AI coding coach analyzing a user's coding session. Provide detailed, constructive feedback about their performance. Focus on:

1. Problem difficulty assessment
2. Time management analysis
3. Performance trends compared to recent sessions
4. Specific recommendations for improvement
5. Positive reinforcement and motivation

Be encouraging, specific, and actionable in your analysis.`;

    const analysisPrompt = `
Session Details:
- Problem: ${sessionData.problemName}
- Rating: ${sessionData.problemRating}
- Time taken: ${Math.floor(sessionData.totalTime / 60)}m ${sessionData.totalTime % 60}s
- Laps completed: ${sessionData.laps}
- Score earned: ${sessionData.score} (${sessionData.streakBonus > 0 ? `+${sessionData.streakBonus} streak bonus` : 'no bonus'})
- User comments: ${sessionData.comments || 'None provided'}

Recent Performance Context:
- Average recent problem rating: ${recentAvgRating.toFixed(0)}
- Rating progress: ${ratingProgress >= 0 ? '+' : ''}${ratingProgress.toFixed(1)}

Please provide a comprehensive analysis of this coding session.`;

    const completion = await openRouter.chat.send({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: analysisPrompt }
      ],
      maxTokens: 800,
      temperature: 0.7,
    });

    const aiAnalysis = completion.choices[0].message.content;

    // Generate additional insights
    const insights = {
      timeEfficiency: calculateTimeEfficiency(sessionData),
      difficultyMatch: assessDifficultyMatch(sessionData.problemRating, sessionData.totalTime, sessionData.laps),
      progressTrend: ratingProgress > 0 ? 'improving' : ratingProgress < 0 ? 'challenging' : 'consistent',
      recommendations: generateRecommendations(sessionData, recentSessions)
    };

    return {
      aiAnalysis: typeof aiAnalysis === 'string' ? aiAnalysis : 'Analysis generated successfully.',
      insights,
      metrics: {
        avgTimePerLap: Math.round(avgTimePerLap),
        baseScore,
        ratingProgress: Math.round(ratingProgress * 10) / 10,
        performanceLevel: getPerformanceLevel(sessionData.problemRating, sessionData.totalTime)
      }
    };

  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return {
      aiAnalysis: 'Unable to generate AI analysis at this time. Please try again later.',
      insights: {
        timeEfficiency: 'unknown',
        difficultyMatch: 'unknown',
        progressTrend: 'unknown',
        recommendations: ['Try again later for detailed analysis']
      },
      metrics: {
        avgTimePerLap: Math.round(sessionData.totalTime / sessionData.laps),
        baseScore: sessionData.score - sessionData.streakBonus,
        ratingProgress: 0,
        performanceLevel: 'unknown'
      }
    };
  }
}

function calculateTimeEfficiency(session: any): string {
  const expectedTime = Math.max(300, session.problemRating * 10); // Rough estimate: 5min base + 10sec per rating point
  const actualTime = session.totalTime;

  if (actualTime < expectedTime * 0.7) return 'excellent';
  if (actualTime < expectedTime * 0.9) return 'good';
  if (actualTime < expectedTime * 1.2) return 'average';
  return 'needs_improvement';
}

function assessDifficultyMatch(rating: number, time: number, laps: number): string {
  const timePerRating = time / rating;
  if (timePerRating < 30) return 'too_easy'; // Less than 30 seconds per rating point
  if (timePerRating < 60) return 'well_matched';
  if (timePerRating < 120) return 'challenging_but_good';
  return 'too_difficult';
}

function getPerformanceLevel(rating: number, time: number): string {
  const timePerRating = time / rating;
  if (timePerRating < 45) return 'excellent';
  if (timePerRating < 75) return 'good';
  if (timePerRating < 120) return 'average';
  return 'developing';
}

function generateRecommendations(session: any, recentSessions: any[]): string[] {
  const recommendations = [];

  // Time-based recommendations
  if (session.totalTime > 1800) { // More than 30 minutes
    recommendations.push('Consider breaking down the problem into smaller subproblems to improve efficiency');
  }

  // Rating-based recommendations
  const recentAvg = recentSessions.length > 1
    ? recentSessions.slice(1).reduce((sum, s) => sum + s.problemRating, 0) / (recentSessions.length - 1)
    : session.problemRating;

  if (session.problemRating > recentAvg + 100) {
    recommendations.push('Great job tackling a significantly harder problem! Keep challenging yourself.');
  } else if (session.problemRating < recentAvg - 100) {
    recommendations.push('Consider working on problems closer to your current skill level to build confidence.');
  }

  // Lap-based recommendations
  if (session.laps > 3) {
    recommendations.push('Multiple attempts show persistence! Focus on understanding why initial approaches didn\'t work.');
  }

  // General recommendations
  recommendations.push('Review the problem constraints and edge cases before implementing');
  recommendations.push('Practice explaining your solution approach out loud before coding');

  return recommendations.slice(0, 3); // Return top 3 recommendations
}