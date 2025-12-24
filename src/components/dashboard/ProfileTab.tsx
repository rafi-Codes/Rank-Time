// src/components/dashboard/ProfileTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Calendar, Award, Zap } from 'lucide-react';

interface UserStats {
  user: {
    name: string;
    email: string;
    totalScore: number;
    currentStreak: number;
    maxStreak: number;
    rank: number;
    league: string;
    totalSessions: number;
  };
  additionalStats: {
    totalTime: number;
    averageScore: number;
    averageRating: number;
    leagueProgress: number;
    nextLeague: string | null;
    nextThreshold: number | null;
  };
  recentSessions: any[];
}

const LEAGUE_THRESHOLDS = {
  'Beginner': 0,
  'Intermediate': 500,
  'Advanced': 1000,
  'Expert': 2500,
  'Master': 5000,
  'Legend': 10000
};

const LEAGUE_COLORS = {
  'Beginner': 'bg-blue-500',
  'Intermediate': 'bg-green-500',
  'Advanced': 'bg-yellow-500',
  'Expert': 'bg-orange-500',
  'Master': 'bg-red-500',
  'Legend': 'bg-purple-500'
};

export default function ProfileTab() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextLeague = (currentLeague: string, score: number) => {
    const leagues = Object.keys(LEAGUE_THRESHOLDS) as Array<keyof typeof LEAGUE_THRESHOLDS>;
    const currentIndex = leagues.indexOf(currentLeague as keyof typeof LEAGUE_THRESHOLDS);

    if (currentIndex < leagues.length - 1) {
      const nextLeague = leagues[currentIndex + 1];
      const nextThreshold = LEAGUE_THRESHOLDS[nextLeague];
      const progress = ((score - LEAGUE_THRESHOLDS[currentLeague as keyof typeof LEAGUE_THRESHOLDS]) /
                       (nextThreshold - LEAGUE_THRESHOLDS[currentLeague as keyof typeof LEAGUE_THRESHOLDS])) * 100;

      return {
        league: nextLeague,
        threshold: nextThreshold,
        progress: Math.min(progress, 100)
      };
    }

    return null;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load profile data</p>
      </div>
    );
  }

  const nextLeague = getNextLeague(stats.user.league, stats.user.totalScore);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle className="text-2xl">{session?.user?.name || 'User'}</CardTitle>
              <CardDescription>{session?.user?.email}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={`${LEAGUE_COLORS[stats.user.league as keyof typeof LEAGUE_COLORS] || 'bg-gray-500'} text-white`}>
                  {stats.user.league.charAt(0).toUpperCase() + stats.user.league.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">Rank #{stats.user.rank}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* League Progress */}
      {nextLeague && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              League Progress
            </CardTitle>
            <CardDescription>
              Progress to {nextLeague.league.charAt(0).toUpperCase() + nextLeague.league.slice(1)} League
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{stats.user.league.charAt(0).toUpperCase() + stats.user.league.slice(1)}</span>
                <span>{nextLeague.league.charAt(0).toUpperCase() + nextLeague.league.slice(1)}</span>
              </div>
              <Progress value={nextLeague.progress} className="h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.user.totalScore.toLocaleString()} / {nextLeague.threshold.toLocaleString()} points
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Score</p>
                <p className="text-2xl font-bold">{stats.user.totalScore.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold">{stats.user.currentStreak}</p>
                <p className="text-xs text-gray-500">Max: {stats.user.maxStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold">{Math.round(stats.additionalStats.averageRating)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-2xl font-bold">{formatTime(stats.additionalStats.totalTime)}</p>
                <p className="text-xs text-gray-500">{stats.user.totalSessions} sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.user.totalSessions >= 1 && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">First Problem</p>
                  <p className="text-sm text-gray-500">Solved your first problem</p>
                </div>
              </div>
            )}

            {stats.user.currentStreak >= 7 && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Week Warrior</p>
                  <p className="text-sm text-gray-500">7-day solving streak</p>
                </div>
              </div>
            )}

            {stats.user.totalScore >= 1000 && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Score Master</p>
                  <p className="text-sm text-gray-500">Reached 1000+ points</p>
                </div>
              </div>
            )}

            {stats.additionalStats.averageRating >= 1500 && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Rating Expert</p>
                  <p className="text-sm text-gray-500">Average rating 1500+</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}