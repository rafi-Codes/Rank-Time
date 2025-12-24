// src/app/dashboard/page.tsx
'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StopwatchTab from '@/components/dashboard/StopwatchTab';
import TimerTab from '@/components/dashboard/TimerTab';
import TracksheetTab from '@/components/dashboard/TracksheetTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import GraphsTab from '@/components/dashboard/GraphsTab';
import LeaderboardTab from '@/components/dashboard/LeaderboardTab';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stopwatch');

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RankTime</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your competitive programming progress and performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="tracksheet">Tracksheet</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="graphs">Graphs</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="stopwatch">
            <StopwatchTab />
          </TabsContent>

          <TabsContent value="timer">
            <TimerTab />
          </TabsContent>

          <TabsContent value="tracksheet">
            <TracksheetTab />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="graphs">
            <GraphsTab />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}