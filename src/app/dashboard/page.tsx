// src/app/dashboard/page.tsx
'use client';

import { signOut, useSession, getSession } from 'next-auth/react';
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
import { ModeToggle } from '@/components/mode-toggle';
import { LogOut, Menu } from 'lucide-react';

function MoreMenu({ onSelect }: { onSelect: (val: string) => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = [
    { label: 'Leaderboard', value: 'leaderboard' },
    { label: 'Rank Buddy', value: 'rankbuddy' },
    { label: 'Tracksheet', value: 'tracksheet' },
    { label: 'Graphs', value: 'graphs' },
    { label: 'Codeforces', value: 'codeforces' },
    { label: 'Social', value: 'social' },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="glass-panel inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition hover:border-primary/60 hover:text-primary"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">More tabs</span>
      </button>

      {open && (
        <div className="glass-panel absolute right-0 z-50 mt-2 w-44 max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-lg focus:outline-none">
          <div className="py-1">
            {items.map((it) => (
              <button
                key={it.value}
                onClick={() => {
                  onSelect(it.value);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-primary/10 hover:text-primary"
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-40 border-x-0 border-t-0 rounded-none">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-1 sm:space-x-2 cursor-pointer min-w-0 flex-1" onClick={() => setActiveTab('stopwatch')}>
              <img src="/logo.svg" alt="RankTime Logo" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <h1 className="brand-gradient truncate text-sm font-bold sm:text-lg lg:text-xl">RankTime</h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Mobile: Show only sign out button */}
              <div className="hidden md:flex items-center space-x-2">
                {safeSession.user?.image ? (
                  <img
                    src={safeSession.user.image}
                    alt="Profile Avatar"
                    className="h-6 w-6 rounded-full border border-primary/30 sm:h-8 sm:w-8"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan-primary),var(--color-cyan-light))] sm:h-8 sm:w-8">
                    <span className="text-xs font-bold text-white">
                      {(safeSession.user?.name?.charAt(0) || safeSession.user?.email?.charAt(0) || 'U').toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden text-sm text-muted-foreground lg:block">
                  Welcome,{' '}
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                  >
                    {safeSession.user?.name || safeSession.user?.email}
                  </button>
                </span>
              </div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
              >
                <LogOut className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">Dashboard</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm lg:text-base">
            Track your competitive programming progress and performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Mobile: Stack controls vertically */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <TabsList className="inline-flex h-auto items-center p-1 sm:p-2 gap-1 sm:gap-2 lg:gap-4 justify-center sm:justify-start flex-wrap w-full sm:w-auto order-2 sm:order-1 overflow-x-auto">
              <TabsTrigger value="stopwatch" className="text-xs sm:text-sm lg:text-base px-2 sm:px-4 py-1 sm:py-2 lg:px-6 lg:py-3 whitespace-nowrap flex-shrink-0">Stopwatch</TabsTrigger>
              <TabsTrigger value="timer" className="text-xs sm:text-sm lg:text-base px-2 sm:px-4 py-1 sm:py-2 lg:px-6 lg:py-3 whitespace-nowrap flex-shrink-0">Timer</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm lg:text-base px-2 sm:px-4 py-1 sm:py-2 lg:px-6 lg:py-3 whitespace-nowrap flex-shrink-0">Profile</TabsTrigger>
              <TabsTrigger value="leaderboard" className="hidden sm:inline-flex text-xs sm:text-sm lg:text-base px-2 sm:px-4 py-1 sm:py-2 lg:px-6 lg:py-3 whitespace-nowrap flex-shrink-0">Leaderboard</TabsTrigger>
              <TabsTrigger value="rankbuddy" className="hidden sm:inline-flex text-xs sm:text-sm lg:text-base px-2 sm:px-4 py-1 sm:py-2 lg:px-6 lg:py-3 whitespace-nowrap flex-shrink-0">Rank Buddy</TabsTrigger>
            </TabsList>

            {/* Controls section - right aligned on mobile */}
            <div className="flex items-center justify-end space-x-1 sm:space-x-2 order-1 sm:order-2">
              <div>
                <ModeToggle />
              </div>
              <div>
                <MoreMenu
                  onSelect={(val: string) => {
                    setActiveTab(val);
                  }}
                />
              </div>
            </div>
          </div>

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

          <TabsContent value="rankbuddy">
            <RankBuddyTab />
          </TabsContent>

          <TabsContent value="codeforces">
            <CodeforcesTab />
          </TabsContent>

          <TabsContent value="social">
            <SocialTab />
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
