// src/app/dashboard/page.tsx
'use client';

import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, Timer, BookOpen, User, TrendingUp, Trophy, Bot, Code, Users } from 'lucide-react';
import { MenuBar } from '@/components/ui/glow-menu';
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
const menuItems = [
  {
    icon: Clock,
    label: "Stopwatch",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Timer,
    label: "Timer",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Bot,
    label: "Rank Buddy",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(79,70,229,0.06) 50%, rgba(67,56,202,0) 100%)",
    iconColor: "text-indigo-500",
  },
  {
    icon: Code,
    label: "Codeforces",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(124,58,237,0.06) 50%, rgba(91,33,182,0) 100%)",
    iconColor: "text-violet-500",
  },
  {
    icon: Users,
    label: "Social",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.06) 50%, rgba(4,120,87,0) 100%)",
    iconColor: "text-emerald-500",
  },
];

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
            variant="liquid"
            className="w-full font-bold rounded-full py-2.5"
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
            <MenuBar
              items={menuItems}
              activeItem={activeTab}
              onItemClick={(label) => setActiveTab(label.replace(/\s+/g, "").toLowerCase())}
              className="max-w-fit mx-auto"
            />

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
