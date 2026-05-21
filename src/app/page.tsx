"use client";

import Link from 'next/link';
import { BarChart3, Bot, Clock3, LineChart, Network, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const features = [
  {
    title: 'Session Tracking',
    description: 'Measure focused practice with laps, timing, notes, and problem metadata.',
    icon: Clock3,
  },
  {
    title: 'Codeforces Integration',
    description: 'Connect your handle and keep competitive programming activity in one place.',
    icon: BarChart3,
  },
  {
    title: 'Performance Analytics',
    description: 'Review score trends, rating ranges, time efficiency, and daily consistency.',
    icon: LineChart,
  },
  {
    title: 'Progress Tracking',
    description: 'Follow streaks, leagues, badges, and cumulative improvement over time.',
    icon: Target,
  },
  {
    title: 'Rank Buddy',
    description: 'Use AI-assisted hints and improvement prompts without direct answer dumping.',
    icon: Bot,
  },
  {
    title: 'Community',
    description: 'Find other programmers, follow their progress, and compare leaderboard rank.',
    icon: Network,
  },
];

export default function Home() {
  return (
    <main className="page-shell min-h-screen">
      <header className="glass-panel sticky top-0 z-40 rounded-none border-x-0 border-t-0">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2" aria-label="Rank Time home">
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            <span className="brand-gradient text-xl font-bold">Rank Time</span>
          </Link>
          <nav className="flex items-center space-x-3" aria-label="Primary navigation">
            <Link href="/login" className="text-sm font-semibold text-foreground transition hover:text-primary">
              Login
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Competitive programming progress, measured clearly
          </div>
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            Rank Time
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Unleash Skills Beyond the Clock
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-foreground">3 sessions</p>
              </div>
              <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                +420 pts
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Current streak', '8 days'],
                ['Avg rating', '1450'],
                ['League', 'Gold'],
                ['Focus time', '4h 20m'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[var(--glass-border)] bg-background/45 p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
              <p className="text-sm font-semibold text-primary">Rank Buddy insight</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your implementation phase is improving, but debugging still takes most of the session. Review edge cases earlier.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border/70 py-16 md:py-24">
        <div className="container px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">Everything stays measurable</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The core tools are designed around competitive programming practice: timing, analysis, accountability, and iteration.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="glass-panel glass-panel-hover rounded-xl p-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="text-center text-sm text-muted-foreground md:text-left">
            <p>&copy; {new Date().getFullYear()} RankTime. All rights reserved.</p>
            <p className="mt-1">Developed by Rafiul Hasan, CSE, BRACU</p>
          </div>
          <nav className="flex items-center space-x-4" aria-label="Footer navigation">
            <Link href="/privacy" className="text-sm text-muted-foreground transition hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground transition hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
