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
import CodeforcesTab from '@/components/dashboard/CodeforcesTab';
import SocialTab from '@/components/dashboard/SocialTab';
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

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RankTime</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
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

          <TabsContent value="codeforces">
            <CodeforcesTab />
          </TabsContent>

          <TabsContent value="social">
            <SocialTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}