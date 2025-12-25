// src/components/dashboard/RankBuddyTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bot,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Flame,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface HeatmapData {
  date: string;
  count: number;
  points: number;
  activities: Array<{
    type: string;
    description: string;
    points: number;
    time: string;
  }>;
}

interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  bonusPoints: number;
  completed: boolean;
  deadline: Date;
  createdAt: Date;
}

interface BadgeData {
  _id: string;
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'skill' | 'challenge';
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  target?: number;
  progressPercentage?: number;
}

interface ImprovementData {
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }>;
  nextSteps: Array<{
    title: string;
    description: string;
    items: Array<{
      id?: string;
      title: string;
      difficulty?: string;
      deadline?: Date;
      type?: string;
    }>;
  }>;
  insights: {
    totalActivities: number;
    categoriesWorked: number;
    badgesEarned: number;
    consistency: number;
  };
}

export default function RankBuddyTab() {
  const { data: session } = useSession();
  const [activeView, setActiveView] = useState<'chat' | 'challenges' | 'analytics' | 'replay'>('chat');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date, provider?: string, fallback?: boolean}>>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [improvementData, setImprovementData] = useState<ImprovementData | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [heatmapStats, setHeatmapStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadChallenges();
    loadBadges();
    initializeChat();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Load activity heatmap
      const heatmapResponse = await fetch('/api/user/activity-heatmap');
      if (heatmapResponse.ok) {
        const heatmapResult = await heatmapResponse.json();
        setHeatmapData(heatmapResult.heatmapData);
        setHeatmapStats(heatmapResult.statistics);
      }

      // Load improvement path
      const improvementResponse = await fetch('/api/user/improvement-path');
      if (improvementResponse.ok) {
        const improvementResult = await improvementResponse.json();
        setImprovementData(improvementResult);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChallenges = async () => {
    try {
      const response = await fetch('/api/user/challenges');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const loadBadges = async () => {
    try {
      const response = await fetch('/api/user/badges');
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges);
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const initializeChat = () => {
    const welcomeMessage = {
      role: 'assistant' as const,
      content: "👋 Hi there! I'm Rank Buddy, your AI coding companion. I won't give you direct answers, but I'll guide you with hints and questions to help you learn and improve. What would you like to work on today?",
      timestamp: new Date(),
      provider: 'system'
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: currentQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/rankbuddy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentQuestion,
          context: messages.slice(-5) // Last 5 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          role: 'assistant' as const,
          content: data.response,
          timestamp: new Date(),
          provider: data.provider,
          fallback: data.fallback
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: "Sorry, I'm having trouble connecting right now. Let's try again later!",
        timestamp: new Date(),
        provider: 'error',
        fallback: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      const response = await fetch('/api/user/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId, action: 'complete' }),
      });

      if (response.ok) {
        // Refresh challenges and badges
        loadChallenges();
        loadBadges();
        loadUserData();
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const renderChatView = () => (
    <div className="space-y-6">
      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <span>Chat with Rank Buddy</span>
          </CardTitle>
          <CardDescription>
            Get hints and guidance for your coding problems. I never give direct answers!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    {message.role === 'assistant' && message.provider && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        message.provider === 'replicate' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {message.provider === 'replicate' ? 'Replicate' :
                         message.fallback ? 'Basic' : 'AI'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Ask me about a coding problem..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!currentQuestion.trim() || isTyping}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChallengesView = () => (
    <div className="space-y-6">
      {/* Daily/Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span>Challenges</span>
          </CardTitle>
          <CardDescription>
            Complete challenges to earn bonus points and unlock achievements!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map((challenge) => (
              <Card key={challenge._id} className={`border-2 ${challenge.completed ? 'border-green-500' : 'border-gray-200'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={challenge.type === 'daily' ? 'default' : 'secondary'}>
                      {challenge.type}
                    </Badge>
                    <Badge variant={
                      challenge.difficulty === 'easy' ? 'default' :
                      challenge.difficulty === 'medium' ? 'secondary' : 'destructive'
                    }>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">+{challenge.points + (challenge.bonusPoints || 0)} points</span>
                    </div>
                    {!challenge.completed && new Date(challenge.deadline) > new Date() && (
                      <Button
                        size="sm"
                        onClick={() => completeChallenge(challenge._id)}
                        className="text-xs"
                      >
                        Complete
                      </Button>
                    )}
                    {challenge.completed && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {!challenge.completed && new Date(challenge.deadline) <= new Date() && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Category: {challenge.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-purple-600" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>
            Your earned badges and accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {badges.map((badge) => (
              <div key={badge._id} className={`p-4 rounded-lg border-2 text-center ${
                badge.earned ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
              }`}>
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h3 className={`font-medium ${badge.earned ? 'text-purple-700 dark:text-purple-300' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {badge.description}
                </p>
                {!badge.earned && badge.progress !== undefined && badge.target && (
                  <div className="mt-2">
                    <Progress value={badge.progressPercentage || 0} className="h-1" />
                    <p className="text-xs text-gray-500 mt-1">
                      {badge.progress}/{badge.target}
                    </p>
                  </div>
                )}
                {badge.earned && badge.earnedAt && (
                  <p className="text-xs text-green-600 mt-2">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            <span>Activity Heatmap</span>
          </CardTitle>
          <CardDescription>
            Your coding activity over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading activity data...</p>
              </div>
            </div>
          ) : heatmapData.length > 0 ? (
            <div className="space-y-4">
              {/* Heatmap Grid */}
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.slice(-35).map((day, index) => {
                  const intensity = Math.min(day.count / 5, 1); // Max intensity at 5 activities
                  return (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${
                        intensity === 0 ? 'bg-gray-200 dark:bg-gray-700' :
                        intensity < 0.25 ? 'bg-green-200 dark:bg-green-800' :
                        intensity < 0.5 ? 'bg-green-300 dark:bg-green-700' :
                        intensity < 0.75 ? 'bg-green-400 dark:bg-green-600' :
                        'bg-green-500 dark:bg-green-500'
                      }`}
                      title={`${day.date}: ${day.count} activities, ${day.points} points`}
                    />
                  );
                })}
              </div>

              {/* Statistics */}
              {heatmapStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{heatmapStats.totalActivities}</p>
                    <p className="text-sm text-gray-500">Total Activities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{heatmapStats.totalPoints}</p>
                    <p className="text-sm text-gray-500">Total Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{heatmapStats.averageDaily}</p>
                    <p className="text-sm text-gray-500">Avg Daily</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{heatmapStats.mostActiveDay ? new Date(heatmapStats.mostActiveDay).toLocaleDateString() : 'N/A'}</p>
                    <p className="text-sm text-gray-500">Most Active Day</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No activity data available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start coding to see your activity heatmap!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Improvement Path */}
      {improvementData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>Your Improvement Path</span>
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recommendations */}
              <div className="space-y-3">
                {improvementData.recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                    rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                    <p className="text-sm font-medium mt-2">{rec.action}</p>
                  </div>
                ))}
              </div>

              {/* Next Steps */}
              {improvementData.nextSteps.map((step, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{step.title}</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">{step.description}</p>
                  <ul className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Insights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xl font-bold">{improvementData.insights.totalActivities}</p>
                  <p className="text-xs text-gray-500">Activities</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xl font-bold">{improvementData.insights.categoriesWorked}</p>
                  <p className="text-xs text-gray-500">Categories</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xl font-bold">{improvementData.insights.badgesEarned}</p>
                  <p className="text-xs text-gray-500">Badges</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xl font-bold">{improvementData.insights.consistency}%</p>
                  <p className="text-xs text-gray-500">Consistency</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderReplayView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span>Session Replay</span>
          </CardTitle>
          <CardDescription>
            Review your past coding sessions with detailed explanations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Session replay feature coming soon...</p>
              <p className="text-sm text-gray-400 mt-1">
                Review past attempts with AI-powered explanations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeView === 'chat' ? 'default' : 'outline'}
          onClick={() => setActiveView('chat')}
          className="flex items-center space-x-2"
        >
          <Bot className="h-4 w-4" />
          <span>Chat</span>
        </Button>
        <Button
          variant={activeView === 'challenges' ? 'default' : 'outline'}
          onClick={() => setActiveView('challenges')}
          className="flex items-center space-x-2"
        >
          <Trophy className="h-4 w-4" />
          <span>Challenges</span>
        </Button>
        <Button
          variant={activeView === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveView('analytics')}
          className="flex items-center space-x-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </Button>
        <Button
          variant={activeView === 'replay' ? 'default' : 'outline'}
          onClick={() => setActiveView('replay')}
          className="flex items-center space-x-2"
        >
          <Calendar className="h-4 w-4" />
          <span>Replay</span>
        </Button>
      </div>

      {/* Content */}
      {activeView === 'chat' && renderChatView()}
      {activeView === 'challenges' && renderChallengesView()}
      {activeView === 'analytics' && renderAnalyticsView()}
      {activeView === 'replay' && renderReplayView()}
    </div>
  );
}