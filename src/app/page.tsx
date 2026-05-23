"use client";

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock3,
  LineChart,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import Navbar from '@/components/Navbar';
import { marketingNavLinks } from '@/components/navbar-config';

const features = [
  {
    title: 'Session Timing',
    description: 'Track laps, notes, and problem metadata without losing flow.',
    icon: Clock3,
  },
  {
    title: 'Codeforces Sync',
    description: 'Connect a handle and review solved problems, verdicts, and rating range.',
    icon: BarChart3,
  },
  {
    title: 'Progress Graphs',
    description: 'Read score, consistency, and time patterns through clean analytics.',
    icon: LineChart,
  },
  {
    title: 'Leagues & Badges',
    description: 'Make improvement tangible with streaks, achievements, and rank movement.',
    icon: Trophy,
  },
  {
    title: 'Rank Buddy',
    description: 'Get coaching prompts and next-step guidance without answer dumping.',
    icon: Bot,
  },
  {
    title: 'Social Tracking',
    description: 'Follow other programmers and compare progress with less noise.',
    icon: Network,
  },
];

const stats = [
  ['Focus time', '4h 20m'],
  ['Current streak', '8 days'],
  ['Avg rating', '1450'],
  ['League', 'Gold'],
];

const activity = [
  ['Two Pointers', '18m', '+72'],
  ['Binary Search', '24m', '+88'],
  ['Graph BFS', '36m', '+110'],
];

export default function Home() {
  return (
    <main className="premium-shell page-enter min-h-screen overflow-x-hidden">
      <div className="premium-grid pointer-events-none fixed inset-x-0 top-0 h-[70vh]" aria-hidden="true" />

      <Navbar variant="marketing" links={marketingNavLinks} logoHref="/" />

      <section className="relative">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-6 py-12 sm:gap-8 sm:py-16 lg:grid-cols-[0.94fr_1.06fr] lg:py-20">
          <div className="relative z-10 max-w-3xl">
            <div className="glass-tier-1 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Competitive programming progress, clarified
            </div>

            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-7xl">
              Rank Time
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl">
              Unleash Skills Beyond The Clock
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/dashboard">
                  <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>View Dashboard</span>
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 border-t border-border/70 pt-6 sm:mt-8 sm:gap-4 sm:grid-cols-3 sm:pt-8">
              {[
                ['Lap-aware', 'practice'],
                ['AI-assisted', 'review'],
                ['Badge-based', 'progress'],
              ].map(([value, label]) => (
                <div key={value}>
                  <p className="brand-gradient text-base font-bold sm:text-lg lg:text-2xl">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="glass-tier-4 mx-auto max-w-2xl rounded-[var(--radius-3xl)] p-2 sm:p-3 shadow-[var(--shadow-cyan-md)]">
              <div className="overflow-hidden rounded-[calc(var(--radius-3xl)-0.35rem)] border border-[var(--glass-premium-border)] bg-background/35">
                <div className="flex items-center justify-between border-b border-[var(--glass-premium-border)] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <BrandLogo className="h-8 w-8" alt="" />
                    <div>
                      <p className="text-sm font-bold text-foreground">Practice Console</p>
                      <p className="text-xs text-muted-foreground">Live session summary</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--color-success-light)] px-3 py-1 text-xs font-bold text-[var(--color-success)]">
                    Active
                  </div>
                </div>

                <div className="grid gap-3 p-4 sm:gap-4 sm:p-5 lg:grid-cols-[1fr_0.75fr]">
                  <div className="glass-tier-2 rounded-[var(--radius-xl)] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground">Current problem</p>
                        <h2 className="mt-2 text-2xl font-bold text-foreground">Graph BFS Review</h2>
                      </div>
                      <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                        +110
                      </div>
                    </div>

                    <div className="mt-6 h-28 rounded-[var(--radius-lg)] border border-primary/20 bg-[linear-gradient(180deg,rgba(0,217,255,0.16),rgba(0,217,255,0.03))] p-4">
                      <div className="flex h-full items-end gap-2">
                        {[34, 58, 46, 72, 64, 88, 78, 96].map((height, index) => (
                          <span
                            key={height + index}
                            className="w-full rounded-full bg-cyan-500 [background:var(--gradient-cyan-primary)]"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                      {stats.map(([label, value]) => (
                        <div key={label} className="rounded-[var(--radius-lg)] border border-[var(--glass-standard-border)] bg-background/35 p-3 sm:p-4">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                          <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-bold text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="glass-tier-2 rounded-[var(--radius-xl)] p-4 sm:p-5">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Rank Buddy</p>
                      <p className="mt-2 sm:mt-3 text-sm leading-relaxed text-foreground">
                        Debugging time dropped 18%. Add edge cases before submitting the next graph problem.
                      </p>
                    </div>

                    <div className="glass-tier-2 rounded-[var(--radius-xl)] p-4 sm:p-5">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Recent laps</p>
                      <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
                        {activity.map(([name, time, points]) => (
                          <div key={name} className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{name}</p>
                              <p className="text-xs text-muted-foreground">{time}</p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative border-t border-border/60 py-12 sm:py-16 md:py-24">
        <div className="container">
          <div className="scroll-reveal flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-bold uppercase text-primary">Premium workflow</p>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold tracking-normal text-foreground lg:text-4xl">Tools that stay out of the way</h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
                Rank Time keeps the interface calm while surfacing the signals that matter during competitive programming practice.
              </p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>

          <div className="mt-8 sm:mt-10 flex snap-x gap-4 sm:gap-5 overflow-x-auto pb-4 sm:pb-5 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`glass-tier-2 glass-interactive scroll-reveal stagger-${Math.min(index % 3, 2) + 1} min-w-[260px] sm:min-w-[280px] snap-start rounded-[var(--radius-xl)] p-5 sm:p-6`}
                >
                  <div className="mb-4 sm:mb-5 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-[var(--radius-lg)] bg-cyan-500 [background:var(--gradient-cyan-primary)] text-white shadow-[var(--shadow-cyan-sm)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-t border-border/60 py-12 sm:py-16 md:py-24">
        <div className="container grid gap-6 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase text-primary">How it works</p>
            <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-foreground lg:text-4xl">Measure, review, improve.</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              The product flow is intentionally small: start a session, capture what happened, then use the dashboard to choose the next improvement.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['01', 'Track', 'Run focused sessions with lap-level timing.'],
              ['02', 'Analyze', 'Review consistency, score, and weak points.'],
              ['03', 'Advance', 'Earn badges and climb leagues with visible progress.'],
            ].map(([step, title, copy]) => (
              <div key={step} className="glass-tier-2 rounded-[var(--radius-xl)] p-4 sm:p-6">
                <p className="brand-gradient text-xs sm:text-sm font-extrabold">{step}</p>
                <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 py-12 sm:py-16 md:py-24">
        <div className="container">
          <div className="glass-tier-4 grid gap-6 sm:gap-8 rounded-[var(--radius-3xl)] p-6 sm:p-8 md:p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-3">
                {['Private by default', 'Light and dark ready', 'Mongo-backed'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-2.5 sm:px-3 py-1 text-xs sm:text-xs font-bold text-primary">
                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground lg:text-4xl">Build better practice habits without visual clutter.</h2>
              <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground">
                A premium, cyan-led interface with the depth of glassmorphism and the restraint needed for daily use.
              </p>
            </div>
            <Button size="lg" asChild className="w-full md:w-auto">
              <Link href="/register">
                <span>Start Practicing</span>
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-6 sm:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-center sm:text-left md:flex-row">
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} RankTime. All rights reserved.</p>
            <p className="mt-1">Developed by Rafiul Hasan, CSE, BRACU</p>
          </div>
          <nav className="flex items-center gap-3 sm:gap-4" aria-label="Footer navigation">
            <Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground transition hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs sm:text-sm text-muted-foreground transition hover:text-primary">
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
