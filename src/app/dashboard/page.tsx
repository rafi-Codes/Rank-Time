// src/app/dashboard/page.tsx
'use client';

import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';
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
import CodeforcesTab from '@/components/dashboard/CodeforcesTab';
import SocialTab from '@/components/dashboard/SocialTab';
import RankBuddyTab from '@/components/dashboard/RankBuddyTab';
import Navbar from '@/components/Navbar';
import { dashboardSettingsItems } from '@/components/navbar-config';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stopwatch');
  const [localSession, setLocalSession] = useState<Session | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Load active tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem('ranktime-active-tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ranktime-active-tab', activeTab);
  }, [activeTab]);

  // Set a timeout for loading state
  useEffect(() => {
    if (status === 'loading') {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // Try to refetch session
      getSession().then((refetchedSession) => {
        if (refetchedSession) {
          // Set local session to force re-render
          setLocalSession(refetchedSession);
        } else {
          router.push('/login');
        }
      }).catch(() => {
        router.push('/login');
      });
    }
  }, [session, status, router]);

  if (status === 'loading' && !loadingTimeout) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-4 border-primary/20 border-b-primary"></div>
      </div>
    );
  }

  if (status === 'loading' && loadingTimeout) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel max-w-md rounded-xl p-8 text-center">
          <div className="mb-4 text-xl font-semibold text-destructive">Loading Timeout</div>
          <p className="mb-4 text-muted-foreground">Session loading took too long. Please check your environment variables.</p>
          <Button
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!session && !localSession) {
    return null; // Will redirect in useEffect
  }

  const currentSession = session || localSession;
  if (!currentSession) return null;

  // TypeScript knows currentSession is not null here
  const safeSession = currentSession;

  return (
    <div className="page-shell min-h-screen">
      <Navbar
        variant="dashboard"
        logoHref="/dashboard"
        onLogoClick={() => setActiveTab('stopwatch')}
        user={safeSession.user ?? undefined}
        onProfileClick={() => setActiveTab('profile')}
        showSettings
        settingsItems={dashboardSettingsItems}
        onSettingsSelect={setActiveTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">Dashboard</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm lg:text-base">
            Track your competitive programming progress and performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="inline-flex h-auto w-full flex-wrap items-center justify-center gap-1 overflow-x-auto p-1 sm:justify-start sm:gap-2 sm:p-2 lg:gap-4">
            <TabsTrigger value="stopwatch" className="flex-shrink-0 whitespace-nowrap px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base">Stopwatch</TabsTrigger>
            <TabsTrigger value="timer" className="flex-shrink-0 whitespace-nowrap px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base">Timer</TabsTrigger>
            <TabsTrigger value="profile" className="flex-shrink-0 whitespace-nowrap px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base">Profile</TabsTrigger>
            <TabsTrigger value="leaderboard" className="hidden flex-shrink-0 whitespace-nowrap px-2 py-1 text-xs sm:inline-flex sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base">Leaderboard</TabsTrigger>
            <TabsTrigger value="rankbuddy" className="hidden flex-shrink-0 whitespace-nowrap px-2 py-1 text-xs sm:inline-flex sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base">Rank Buddy</TabsTrigger>
          </TabsList>

          <TabsContent value="stopwatch">
            {activeTab === 'stopwatch' ? <StopwatchTab /> : null}
          </TabsContent>

          <TabsContent value="timer">
            {activeTab === 'timer' ? <TimerTab /> : null}
          </TabsContent>

          <TabsContent value="tracksheet">
            {activeTab === 'tracksheet' ? <TracksheetTab /> : null}
          </TabsContent>

          <TabsContent value="profile">
            {activeTab === 'profile' ? <ProfileTab /> : null}
          </TabsContent>

          <TabsContent value="graphs">
            {activeTab === 'graphs' ? <GraphsTab /> : null}
          </TabsContent>

          <TabsContent value="leaderboard">
            {activeTab === 'leaderboard' ? <LeaderboardTab /> : null}
          </TabsContent>

          <TabsContent value="rankbuddy">
            {activeTab === 'rankbuddy' ? <RankBuddyTab /> : null}
          </TabsContent>

          <TabsContent value="codeforces">
            {activeTab === 'codeforces' ? <CodeforcesTab /> : null}
          </TabsContent>

          <TabsContent value="social">
            {activeTab === 'social' ? <SocialTab /> : null}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 border-t border-border/70 py-6 sm:mt-12 sm:py-8">
          <div className="text-center text-xs text-muted-foreground sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
            <p className="mt-1 sm:mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
