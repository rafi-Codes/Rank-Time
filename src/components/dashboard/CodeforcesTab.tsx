// src/components/dashboard/CodeforcesTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, TrendingUp, Code, Award, ExternalLink, UserCheck, UserX, Zap, BarChart3, AlertCircle, Flame } from 'lucide-react';
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

interface CategoryStats {
  categoryName: string;
  totalSolved: number;
  totalAttempted: number;
  successRate: number;
  averageTime: number;
}

interface RatingStats {
  rating: string;
  count: number;
  solved: number;
  successRate: number;
  avgTimeMillis: number;
  avgMemoryBytes: number;
}

interface LanguageStats {
  language: string;
  count: number;
  accepted: number;
  successRate: number;
}

interface PracticeIntensity {
  submissionsPerDay: number;
  daysActive: number;
  consistency: number;
}

interface RatingTendency {
  preferredRatingRange: { min: number; max: number };
  averageSolvedRating: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  veryHardProblems: number;
}

interface EnhancedCodeforcesStats {
  solvedProblems: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  wrongAnswer: number;
  timeLimitExceeded: number;
  memoryLimitExceeded: number;
  runtimeError: number;
  compilationError: number;
  recentSubmissions: CodeforcesSubmission[];
  categoryBreakdown: CategoryStats[];
  ratingDistribution: RatingStats[];
  languagePreference: LanguageStats[];
  ratingTendency: RatingTendency;
  practiceIntensity: PracticeIntensity;
  successRateByRating: Record<string, number>;
  verdictDistribution: Record<string, number>;
  topProblems: Array<{
    name: string;
    rating?: number;
    tags?: string[];
    index: string;
    verdicts: Record<string, number>;
  }>;
  timeSpentByRating: Record<string, { totalTime: number; count: number }>;
}

export default function CodeforcesTab() {
  const { data: session } = useSession();
  const [handle, setHandle] = useState('');
  const [userData, setUserData] = useState<CodeforcesUser | null>(null);
  const [stats, setStats] = useState<EnhancedCodeforcesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedHandle, setConnectedHandle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'ratings' | 'problems'>('overview');

  useEffect(() => {
    const storedHandle = localStorage.getItem('ranktime-codeforces-handle');
    if (storedHandle) {
      setConnectedHandle(storedHandle);
      setHandle(storedHandle);
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    if (connectedHandle) {
      localStorage.setItem('ranktime-codeforces-handle', connectedHandle);
    } else {
      localStorage.removeItem('ranktime-codeforces-handle');
    }
  }, [connectedHandle]);

  const fetchCodeforcesData = useCallback(async (userHandle?: string) => {
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
      setActiveTab('overview');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Codeforces data');
    } finally {
      setLoading(false);
    }
  }, [handle, connectedHandle]);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!session?.user?.email) return;

      const storedHandle = localStorage.getItem('ranktime-codeforces-handle');
      if (storedHandle) return;

      try {
        const response = await fetch('/api/user/codeforces-status');
        if (response.ok) {
          const data = await response.json();
          setIsConnected(data.isConnected);
          if (data.isConnected && data.handle) {
            setConnectedHandle(data.handle);
            setHandle(data.handle);
            fetchCodeforcesData(data.handle);
          }
        }
      } catch (error) {
        console.error('Error checking connection status:', error);
      }
    };

    checkConnectionStatus();
  }, [session, fetchCodeforcesData]);

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

  const getConsistencyLevel = (score: number) => {
    if (score >= 90) return { label: 'Extreme', color: 'bg-red-500' };
    if (score >= 70) return { label: 'Very High', color: 'bg-orange-500' };
    if (score >= 50) return { label: 'High', color: 'bg-yellow-500' };
    if (score >= 30) return { label: 'Moderate', color: 'bg-blue-500' };
    return { label: 'Low', color: 'bg-gray-500' };
  };

  const getDifficultyColor = (rating?: string) => {
    if (!rating) return 'text-gray-500';
    if (rating.includes('Easy')) return 'text-green-500';
    if (rating.includes('Medium')) return 'text-yellow-500';
    if (rating.includes('Hard')) return 'text-red-500';
    if (rating.includes('Very Hard')) return 'text-purple-500';
    return 'text-gray-500';
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
              : 'Connect your Codeforces account to sync enhanced analytics'
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <Badge className={`${getRankColor(userData.rank)} text-white mt-2`}>
                      {userData.rank}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Rating</p>
                <p className="text-2xl font-bold">{userData.rating || 'Unrated'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Max Rating</p>
                <p className="text-2xl font-bold">{userData.maxRating || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Contribution</p>
                <p className="text-2xl font-bold text-blue-600">{userData.contribution || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Tabs */}
      {stats && (
        <>
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Categories
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'ratings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Ratings
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'problems'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Problems
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Problems Solved</p>
                      <p className="text-3xl font-bold text-green-600">{stats.solvedProblems}</p>
                      <p className="text-xs text-gray-500 mt-2">{stats.totalSubmissions} submissions</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)}%
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{stats.acceptedSubmissions} accepted</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Rating</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.ratingTendency.averageSolvedRating}</p>
                      <p className="text-xs text-gray-500 mt-2">Target range: {stats.ratingTendency.preferredRatingRange.min}-{stats.ratingTendency.preferredRatingRange.max}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Consistency</p>
                      <p className={`text-3xl font-bold ${getConsistencyLevel(stats.practiceIntensity.consistency).color}`}>
                        {stats.practiceIntensity.consistency}/100
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{getConsistencyLevel(stats.practiceIntensity.consistency).label}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Practice Intensity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Practice Intensity
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Submissions/Day</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.practiceIntensity.submissionsPerDay.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Days Active</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.practiceIntensity.daysActive}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consistency</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${getConsistencyLevel(stats.practiceIntensity.consistency).color}`}
                        style={{ width: `${stats.practiceIntensity.consistency}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Difficulty Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300 mb-1">Easy</p>
                      <p className="text-2xl font-bold text-green-600">{stats.ratingTendency.easyProblems}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">Medium</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.ratingTendency.mediumProblems}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">Hard</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.ratingTendency.hardProblems}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300 mb-1">Very Hard</p>
                      <p className="text-2xl font-bold text-red-600">{stats.ratingTendency.veryHardProblems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verdict Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Submission Verdicts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(stats.verdictDistribution).map(([verdict, count]) => (
                      <div key={verdict} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{verdict}</p>
                        <p className="text-lg font-bold">{count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Language Proficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.languagePreference.slice(0, 5).map((lang) => (
                      <div key={lang.language} className="flex items-center justify-between">
                        <span className="font-medium">{lang.language}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-40 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${lang.successRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {lang.successRate}% ({lang.accepted}/{lang.count})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.categoryBreakdown.map((category) => (
                <Card key={category.categoryName}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.categoryName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</span>
                      <span className="font-bold text-green-600">{category.totalSolved}/{category.totalAttempted}</span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                        <span className="text-sm font-medium">{category.successRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          style={{ width: `${category.successRate}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <Card>
              <CardHeader>
                <CardTitle>Performance by Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.ratingDistribution.map((rating) => (
                  <div key={rating.rating}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className={`font-medium ${getDifficultyColor(rating.rating)}`}>{rating.rating}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {rating.solved}/{rating.count} • {rating.successRate}% success • Avg: {(rating.avgTimeMillis / 1000).toFixed(1)}s
                        </p>
                      </div>
                      <Badge variant="secondary">{rating.successRate}%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${rating.successRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Problems Tab */}
          {activeTab === 'problems' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Top Challenging Problems
                </CardTitle>
                <CardDescription>Problems you've attempted most frequently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topProblems.slice(0, 10).map((problem, idx) => {
                    const totalAttempts = Object.values(problem.verdicts).reduce((a, b) => a + b, 0);
                    return (
                      <div key={problem.index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-500">{idx + 1}.</span>
                              <h4 className="font-medium">{problem.name}</h4>
                            </div>
                            {problem.tags && problem.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {problem.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {problem.rating && (
                            <Badge className="ml-2 bg-purple-500 text-white">{problem.rating}</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {Object.entries(problem.verdicts).map(([verdict, count]) => (
                            <span
                              key={verdict}
                              className={`px-2 py-1 rounded ${
                                verdict === 'OK'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                              }`}
                            >
                              {verdict}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Submissions */}
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
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
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
                            View
                          </a>
                        )}
                      </div>
                    </div>
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
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Loading State */}
      {loading && !userData && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading Codeforces data...</p>
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
              <p>✨ <strong>Enhanced Codeforces Analytics</strong></p>
              <p>1. Enter your Codeforces handle in the input field above</p>
              <p>2. Click "Connect Account" to retrieve your complete profile and analytics</p>
              <p>3. View:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Submission statistics and success rates</li>
                <li>Category expertise breakdown (7 categories)</li>
                <li>Performance by rating difficulty</li>
                <li>Programming language proficiency</li>
                <li>Practice intensity and consistency score</li>
                <li>Most challenging problems</li>
                <li>Recent submission history</li>
              </ul>
              <p>4. Data is fetched from the Codeforces API and updated on refresh</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
