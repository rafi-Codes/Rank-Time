// src/components/dashboard/CodeforcesTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, TrendingUp, Code, Award, Link, ExternalLink, UserCheck, UserX } from 'lucide-react';
import { useSession } from 'next-auth/react';

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

interface CodeforcesProblem {
  contestId?: number;
  index: string;
  name: string;
  rating?: number;
  tags?: string[];
}

interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  problem: CodeforcesProblem;
  verdict: string;
  programmingLanguage: string;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  creationTimeSeconds: number;
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
  recentSubmissions: CodeforcesSubmission[];
}

export default function CodeforcesTab() {
  const { data: session } = useSession();
  const [handle, setHandle] = useState('');
  const [userData, setUserData] = useState<CodeforcesUser | null>(null);
  const [stats, setStats] = useState<CodeforcesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedHandle, setConnectedHandle] = useState<string | null>(null);

  useEffect(() => {
    checkConnectionStatus();
  }, [session]);

  const checkConnectionStatus = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch('/api/user/codeforces-status');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.isConnected);
        setConnectedHandle(data.handle);
        if (data.isConnected && data.handle) {
          // Auto-fetch data for connected users
          fetchCodeforcesData(data.handle);
        }
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const connectCodeforces = async () => {
    if (!handle.trim()) {
      setError('Please enter a Codeforces handle');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/connect-codeforces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle: handle.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect');
      }

      setIsConnected(true);
      setConnectedHandle(handle.trim());
      await fetchCodeforcesData(handle.trim());
    } catch (err: any) {
      setError(err.message || 'Failed to connect Codeforces account');
    } finally {
      setLoading(false);
    }
  };

  const disconnectCodeforces = async () => {
    try {
      const response = await fetch('/api/user/disconnect-codeforces', {
        method: 'POST',
      });

      if (response.ok) {
        setIsConnected(false);
        setConnectedHandle(null);
        setUserData(null);
        setStats(null);
        setHandle('');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const fetchCodeforcesData = async (userHandle?: string) => {
    const targetHandle = userHandle || handle.trim() || connectedHandle;
    if (!targetHandle) {
      setError('No handle available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/codeforces?handle=${encodeURIComponent(targetHandle)}`);
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
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Codeforces Integration
            {isConnected && <Badge className="bg-green-500 text-white"><UserCheck className="h-3 w-3 mr-1" />Connected</Badge>}
          </CardTitle>
          <CardDescription>
            {isConnected 
              ? `Connected to Codeforces handle: ${connectedHandle}`
              : 'Connect your Codeforces account to automatically sync data'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="flex gap-4">
              <Input
                placeholder="Enter Codeforces handle (e.g., tourist)"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && connectCodeforces()}
              />
              <Button
                onClick={connectCodeforces}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect Account'}
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={() => fetchCodeforcesData()}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={disconnectCodeforces}
                variant="destructive"
              >
                <UserX className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          )}
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

      {/* Recent Submissions */}
      {stats?.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentSubmissions.slice(0, 10).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{submission.problem.name}</h4>
                      {submission.problem.contestId && (
                        <Badge variant="outline">
                          {submission.problem.contestId}{submission.problem.index}
                        </Badge>
                      )}
                      {submission.problem.rating && (
                        <Badge variant="secondary">
                          {submission.problem.rating}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>{submission.programmingLanguage}</span>
                      <span>{new Date(submission.creationTimeSeconds * 1000).toLocaleDateString()}</span>
                      {submission.contestId && (
                        <a
                          href={`https://codeforces.com/contest/${submission.contestId}/problem/${submission.problem.index}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Problem
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        submission.verdict === 'OK'
                          ? 'bg-green-500 text-white'
                          : submission.verdict === 'WRONG_ANSWER'
                          ? 'bg-red-500 text-white'
                          : submission.verdict === 'TIME_LIMIT_EXCEEDED'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-500 text-white'
                      }
                    >
                      {submission.verdict}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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