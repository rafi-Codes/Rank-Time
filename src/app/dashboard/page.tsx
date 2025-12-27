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
import { LogOut } from 'lucide-react';

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
    <div className="inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center justify-center rounded px-4 py-2 sm:px-6 sm:py-3 bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition"
      >
        <svg className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="sr-only">More tabs</span>
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-w-[calc(100vw-2rem)]">
          <div className="py-1">
            {items.map((it) => (
              <button
                key={it.value}
                onClick={() => {
                  onSelect(it.value);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
  const { data: session, status, update } = useSession();
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
        console.log('Loading timeout reached, forcing redirect');
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
      }).catch((error) => {
        router.push('/login');
      });
    }
  }, [session, status, router]);

  if (status === 'loading' && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'loading' && loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">Loading Timeout</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Session loading took too long. Please check your environment variables.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-1 sm:space-x-2 cursor-pointer min-w-0 flex-1" onClick={() => setActiveTab('stopwatch')}>
              <img src="/logo.svg" alt="RankTime Logo" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">RankTime</h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Mobile: Show only sign out button */}
              <div className="hidden md:flex items-center space-x-2">
                {safeSession.user?.image ? (
                  <img
                    src={safeSession.user.image}
                    alt="Profile Avatar"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {(safeSession.user?.name?.charAt(0) || safeSession.user?.email?.charAt(0) || 'U').toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden lg:block text-sm text-gray-700 dark:text-gray-300">
                  Welcome,{' '}
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">
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
              <div className="scale-75 sm:scale-100">
                <ModeToggle />
              </div>
              <div className="scale-75 sm:scale-100">
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
        <footer className="mt-8 sm:mt-12 py-6 sm:py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
            <p className="mt-1 sm:mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
          </div>
        </footer>
      </div>
    </div>
  );
}