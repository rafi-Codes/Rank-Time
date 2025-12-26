// src/app/dashboard/page.tsx
'use client';

import { signOut, useSession, getSession } from 'next-auth/react';
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
import CodeforcesTab from '@/components/dashboard/CodeforcesTab';
import SocialTab from '@/components/dashboard/SocialTab';
import RankBuddyTab from '@/components/dashboard/RankBuddyTab';
import { ModeToggle } from '@/components/mode-toggle';

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
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stopwatch');
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
    console.log('Dashboard useEffect - status:', status, 'session:', !!session);
    if (status === 'loading') {
      console.log('Still loading, waiting...');
      return; // Still loading
    }

    if (!session) {
      console.log('No session found, attempting to refetch...');
      // Try to refetch session
      getSession().then((refetchedSession) => {
        console.log('Refetched session:', !!refetchedSession);
        if (!refetchedSession) {
          console.log('Still no session, redirecting to login');
          router.push('/login');
        } else {
          console.log('Session found after refetch, staying on dashboard');
        }
      }).catch((error) => {
        console.error('Error refetching session:', error);
        router.push('/login');
      });
    } else {
      console.log('Session found, staying on dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading' && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Status: {status}</p>
        </div>
      </div>
    );
  }

  if (status === 'loading' && loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">Loading Timeout</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Session loading took too long. This might be due to environment configuration issues.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Status: {status}, Timeout: {loadingTimeout ? 'Yes' : 'No'}</p>
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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">Session Lost</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Redirecting to login...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Status: {status}, Session: {session ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('stopwatch')}>
                <img src="/logo.svg" alt="RankTime Logo" className="h-10 w-10" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">RankTime</h1>
              </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile Avatar"
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {(session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U').toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Welcome,{' '}
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                      {session.user?.name || session.user?.email}
                    </button>
                  </span>
                </div>
              </div>
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Track your competitive programming progress and performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="relative">
            <TabsList className="inline-flex h-auto items-center p-2 gap-4 mx-auto justify-center">
              <TabsTrigger value="stopwatch" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">Stopwatch</TabsTrigger>
              <TabsTrigger value="timer" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">Timer</TabsTrigger>
              <TabsTrigger value="profile" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">Profile</TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">Leaderboard</TabsTrigger>
              <TabsTrigger value="rankbuddy" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">Rank Buddy</TabsTrigger>
            </TabsList>

            {/* More menu for less-used tabs */}
            <div className="absolute right-0 top-0 flex items-center space-x-2">
              <ModeToggle />
              <MoreMenu
                onSelect={(val: string) => {
                  setActiveTab(val);
                }}
              />
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
        <footer className="mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
            <p className="mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
          </div>
        </footer>
      </div>
    </div>
  );
}