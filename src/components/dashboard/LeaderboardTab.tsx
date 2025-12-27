// src/components/dashboard/LeaderboardTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Crown, User } from 'lucide-react';

interface LeaderboardUser {
  _id: string;
  name: string;
  email: string;
  usertag?: string;
  totalScore: number;
  currentStreak: number;
  maxStreak: number;
  rank: number;
  league: string;
  totalSessions: number;
  averageScore: number;
}

export default function LeaderboardTab() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('totalScore');
  const [timeRange, setTimeRange] = useState('all');
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, timeRange]);

  useEffect(() => {
    if (session?.user?.email && !currentUser) {
      fetchCurrentUserStats();
    }
  }, [session]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leaderboard?sort=${sortBy}&timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);

        // Find current user in leaderboard
        if (session?.user?.email) {
          const userInLeaderboard = data.find((user: LeaderboardUser) => user.email === session.user.email);
          if (userInLeaderboard) {
            setCurrentUser(userInLeaderboard);
          } else {
            // If not in top leaderboard, fetch user stats separately
            await fetchCurrentUserStats();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser({
          _id: data.user.email, // Use email as ID since we don't have the actual user ID
          name: data.user.name,
          email: data.user.email,
          usertag: data.user.usertag,
          totalScore: data.user.totalScore,
          currentStreak: data.user.currentStreak,
          maxStreak: data.user.maxStreak,
          rank: data.user.rank,
          league: data.user.league,
          totalSessions: data.user.totalSessions,
          averageScore: data.additionalStats.averageScore
        });
      }
    } catch (error) {
      console.error('Error fetching current user stats:', error);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-blue-500" />;
    }
  };

  const getLeagueColor = (league: string) => {
    switch (league.toLowerCase()) {
      case 'legend':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'master':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expert':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'advanced':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'intermediate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'beginner':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="totalScore">Total Score</SelectItem>
                  <SelectItem value="currentStreak">Current Streak</SelectItem>
                  <SelectItem value="maxStreak">Max Streak</SelectItem>
                  <SelectItem value="averageScore">Average Score</SelectItem>
                  <SelectItem value="totalSessions">Total Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Time Range:</span>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchLeaderboard} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
          <CardDescription>
            Top competitive programmers ranked by {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950' : 'bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@{user.usertag || (user.email ? user.email.split('@')[0] : 'user')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge className={getLeagueColor(user.league)}>
                    {user.league}
                  </Badge>

                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {sortBy === 'totalScore' && `Score: ${user.totalScore.toLocaleString()}`}
                      {sortBy === 'currentStreak' && `Current Streak: ${user.currentStreak}`}
                      {sortBy === 'maxStreak' && `Max Streak: ${user.maxStreak}`}
                      {sortBy === 'averageScore' && `Avg Score: ${Math.round(user.averageScore).toLocaleString()}`}
                      {sortBy === 'totalSessions' && `Sessions: ${user.totalSessions}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rank: {user.rank} • {user.totalSessions} sessions
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No leaderboard data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Your Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Your Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600">#{currentUser.rank}</span>
                  {getRankIcon(currentUser.rank)}
                </div>
                <div>
                  <h3 className="font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{currentUser.usertag || (currentUser.email ? currentUser.email.split('@')[0] : 'user')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge className={getLeagueColor(currentUser.league)}>
                  {currentUser.league}
                </Badge>

                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Score: {currentUser.totalScore.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentUser.totalSessions} sessions • {currentUser.currentStreak} day streak
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Loading your ranking information...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}