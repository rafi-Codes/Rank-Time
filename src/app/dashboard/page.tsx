// src/app/dashboard/page.tsx
'use client';

import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, Timer, User, Trophy, Bot } from 'lucide-react';
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
import { TextScramble } from '@/components/ui/text-scramble';
import FooterSection from '@/components/ui/footer';

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
      <div className="premium-shell flex min-h-screen items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="premium-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500/20 border-b-cyan-400 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground font-light tracking-wide animate-pulse">Loading secure dashboard session...</p>
        </div>
      </div>
    );
  }

  if (status === 'loading' && loadingTimeout) {
    return (
      <div className="premium-shell flex min-h-screen items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="premium-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 glass-tier-4 max-w-md rounded-3xl p-8 border border-white/10 text-center shadow-2xl">
          <div className="mb-4 text-xl font-bold text-rose-500">Loading Timeout</div>
          <p className="mb-6 text-sm text-muted-foreground font-light leading-relaxed">
            Session loading took too long. Please verify your environment configuration and try again.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full py-2.5"
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
    <div className="premium-shell page-enter min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="premium-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 w-full flex flex-col flex-1">
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
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 flex-1 w-full">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight sm:text-3xl lg:text-4xl">
              <TextScramble duration={0.6}>Dashboard</TextScramble>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground font-light sm:mt-2 sm:text-sm lg:text-base">
              Track your competitive programming progress and performance
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex items-center justify-start gap-1 bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar shadow-lg">
              <TabsTrigger
                value="stopwatch"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-cyan-500 data-[state=active]:text-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-400 hover:bg-white/5 shrink-0 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                Stopwatch
              </TabsTrigger>
              <TabsTrigger
                value="timer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-cyan-500 data-[state=active]:text-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-400 hover:bg-white/5 shrink-0 cursor-pointer"
              >
                <Timer className="w-4 h-4" />
                Timer
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-cyan-500 data-[state=active]:text-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-400 hover:bg-white/5 shrink-0 cursor-pointer"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-cyan-500 data-[state=active]:text-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-400 hover:bg-white/5 shrink-0 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger
                value="rankbuddy"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-cyan-500 data-[state=active]:text-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-400 hover:bg-white/5 shrink-0 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                Rank Buddy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stopwatch" className="outline-none">
              {activeTab === 'stopwatch' ? <StopwatchTab /> : null}
            </TabsContent>

            <TabsContent value="timer" className="outline-none">
              {activeTab === 'timer' ? <TimerTab /> : null}
            </TabsContent>

            <TabsContent value="tracksheet" className="outline-none">
              {activeTab === 'tracksheet' ? <TracksheetTab /> : null}
            </TabsContent>

            <TabsContent value="profile" className="outline-none">
              {activeTab === 'profile' ? <ProfileTab /> : null}
            </TabsContent>

            <TabsContent value="graphs" className="outline-none">
              {activeTab === 'graphs' ? <GraphsTab /> : null}
            </TabsContent>

            <TabsContent value="leaderboard" className="outline-none">
              {activeTab === 'leaderboard' ? <LeaderboardTab /> : null}
            </TabsContent>

            <TabsContent value="rankbuddy" className="outline-none">
              {activeTab === 'rankbuddy' ? <RankBuddyTab /> : null}
            </TabsContent>

            <TabsContent value="codeforces" className="outline-none">
              {activeTab === 'codeforces' ? <CodeforcesTab /> : null}
            </TabsContent>

            <TabsContent value="social" className="outline-none">
              {activeTab === 'social' ? <SocialTab /> : null}
            </TabsContent>
          </Tabs>
        </main>

        {/* Unified Premium Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
