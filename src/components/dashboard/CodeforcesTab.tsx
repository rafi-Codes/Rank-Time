// src/components/dashboard/CodeforcesTab.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, TrendingUp, Code, Award } from 'lucide-react';

interface CodeforcesUser {
  handle: string;
  rating?: number;
  rank?: string;
  maxRating?: number;
  maxRank?: string;
  contribution?: number;
  friendOfCount?: number;
  titlePhoto?: string;
  avatar?: string;
  registrationTimeSeconds?: number;
  lastOnlineTimeSeconds?: number;
}

interface CodeforcesStats {
  solvedProblems: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  wrongAnswer: number;
  timeLimitExceeded: number;
  memoryLimitExceeded: number;
  runtimeError: number;
  compilationError: number;
}

export default function CodeforcesTab() {
  const [handle, setHandle] = useState('');
  const [userData, setUserData] = useState<CodeforcesUser | null>(null);
  const [stats, setStats] = useState<CodeforcesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCodeforcesData = async () => {
    if (!handle.trim()) {
      setError('Please enter a Codeforces handle');
      return;
    }

    setLoading(true);
    setError('');
    setUserData(null);
    setStats(null);

    try {
      const response = await fetch(`/api/codeforces?handle=${encodeURIComponent(handle.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      setUserData(data.user);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Codeforces data');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank?: string) => {
    if (!rank) return 'bg-gray-500';
    const rankLower = rank.toLowerCase();
    if (rankLower.includes('legendary')) return 'bg-red-500';
    if (rankLower.includes('grandmaster')) return 'bg-red-600';
    if (rankLower.includes('international')) return 'bg-orange-500';
    if (rankLower.includes('master')) return 'bg-yellow-500';
    if (rankLower.includes('candidate')) return 'bg-purple-500';
    if (rankLower.includes('specialist')) return 'bg-cyan-500';
    if (rankLower.includes('pupil')) return 'bg-green-500';
    if (rankLower.includes('newbie')) return 'bg-gray-500';
    return 'bg-gray-500';
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Codeforces Integration
          </CardTitle>
          <CardDescription>
            Fetch user information and statistics from Codeforces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter Codeforces handle (e.g., tourist)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchCodeforcesData()}
            />
            <Button
              onClick={fetchCodeforcesData}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch Data'}
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* User Info */}
      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {userData.avatar && (
                  <img
                    src={userData.avatar}
                    alt={userData.handle}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold">{userData.handle}</h3>
                  {userData.rank && (
                    <Badge className={`${getRankColor(userData.rank)} text-white`}>
                      {userData.rank}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Rating</p>
                  <p className="text-2xl font-bold">{userData.rating || 'Unrated'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Max Rating</p>
                  <p className="text-2xl font-bold">{userData.maxRating || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Max Rank</p>
                  <p className="font-medium">{userData.maxRank || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contribution</p>
                  <p className="font-medium">{userData.contribution || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registered</p>
                  <p className="font-medium">{formatDate(userData.registrationTimeSeconds)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Online</p>
                  <p className="font-medium">{formatDate(userData.lastOnlineTimeSeconds)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Submission Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.solvedProblems}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                    <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                    <p className="text-lg font-medium text-green-600">{stats.acceptedSubmissions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Wrong Answer</p>
                    <p className="text-lg font-medium text-red-600">{stats.wrongAnswer}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">TLE</p>
                    <p className="text-lg font-medium text-orange-600">{stats.timeLimitExceeded}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">MLE</p>
                    <p className="text-lg font-medium text-purple-600">{stats.memoryLimitExceeded}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Runtime Error</p>
                    <p className="text-lg font-medium text-yellow-600">{stats.runtimeError}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compilation Error</p>
                    <p className="text-lg font-medium text-gray-600">{stats.compilationError}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Instructions */}
      {!userData && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>1. Enter your Codeforces handle in the input field above</p>
              <p>2. Click "Fetch Data" to retrieve your profile and submission statistics</p>
              <p>3. View your rating, rank, solved problems, and submission breakdown</p>
              <p>4. Data is fetched directly from the Codeforces API</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}