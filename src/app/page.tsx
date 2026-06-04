"use client";

import Link from 'next/link';
import { useState } from 'react';
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
  Trophy,
  Home as HomeIcon,
  HelpCircle,
  Settings,
  Bell,
} from 'lucide-react';
import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { TextScramble } from '@/components/ui/text-scramble';
import { BrandLogo } from '@/components/brand-logo';
import Navbar from '@/components/Navbar';
import { marketingNavLinks } from '@/components/navbar-config';
import FooterSection from '@/components/ui/footer';

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
  const tabs = [
    { title: 'Home', icon: HomeIcon, href: '/' },
    { title: 'Features', icon: Bell, href: '#features' },
    { type: 'separator' as const },
    { title: 'Workflow', icon: Settings, href: '#workflow' },
    { title: 'Contact', icon: HelpCircle, href: '/contact' },
  ];

  const [headerScramble, setHeaderScramble] = useState(true);

  return (
    <main className="premium-shell page-enter min-h-screen overflow-x-hidden relative">
      {/* Background Refraction & Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="premium-grid pointer-events-none fixed inset-x-0 top-0 h-[70vh]" aria-hidden="true" />

      {/* Main Navbar */}
      <Navbar variant="marketing" links={marketingNavLinks} logoHref="/" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32">
        <div className="container flex flex-col items-center text-center">
          
          {/* Badge */}
          <div 
            onClick={() => setHeaderScramble(true)}
            className="glass-tier-2 mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary cursor-pointer hover:border-cyan-400/40 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-cyan-400" aria-hidden="true" />
            <TextScramble 
              trigger={headerScramble} 
              onScrambleComplete={() => setHeaderScramble(false)}
              speed={0.03}
              duration={1}
            >
              COMPETITIVE PROGRAMMING PROGRESS, CLARIFIED
            </TextScramble>
          </div>

          {/* Main Titles */}
          <h1 className="text-balance text-5xl font-black leading-none tracking-tight text-foreground sm:text-7xl lg:text-[7.5rem] filter drop-shadow-sm select-none">
            Rank <span className="brand-gradient drop-shadow-[0_0_35px_rgba(0,217,255,0.3)]">Time</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl font-light">
            Unleash Skills Beyond The Clock.
          </p>

          {/* Interactive Navigation Demo */}
          <div className="mt-8 mb-6 hidden md:block">
            <p className="text-xs uppercase text-muted-foreground tracking-widest mb-3 font-mono">Interactive Navigation</p>
            <ExpandableTabs tabs={tabs} className="shadow-lg border-zinc-200/50 dark:border-zinc-800/50" />
          </div>

          {/* Call To Actions */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-center">
            <Link href="/register">
              <ShinyButton className="w-52 h-12 flex items-center justify-center">
                Get Started Free
              </ShinyButton>
            </Link>
            <Link href="/dashboard">
              <LiquidButton className="w-52 h-12 font-bold text-base bg-white/5 dark:bg-black/5 text-foreground hover:bg-white/10 dark:hover:bg-black/10">
                <Play className="h-4 w-4 mr-2 text-cyan-400 fill-cyan-400" aria-hidden="true" />
                View Dashboard
              </LiquidButton>
            </Link>
          </div>

          {/* Stat Subtitles */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 border-t border-border/20 pt-8 max-w-2xl w-full">
            {[
              ['Lap-aware', 'practice'],
              ['AI-assisted', 'review'],
              ['Badge-based', 'progress'],
            ].map(([value, label]) => (
              <div key={value} className="flex flex-col items-center">
                <p className="brand-gradient text-xl font-bold lg:text-2xl">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Dashboard Showcase with Container Scroll */}
      <section className="relative -mt-16 md:-mt-24">
        <ContainerScroll
          titleComponent={
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-foreground sm:text-5xl tracking-tight">
                Engage in the <br />
                <span className="text-4xl md:text-[5.5rem] font-black brand-gradient mt-2 leading-none">
                  Live Practice Console
                </span>
              </h2>
            </div>
          }
        >
          {/* Glass Console Screen Mockup */}
          <div className="w-full h-full border border-white/10 dark:border-white/5 bg-background/55 backdrop-blur-2xl rounded-2xl flex flex-col overflow-hidden text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4 bg-white/5 dark:bg-black/5">
              <div className="flex items-center gap-3">
                <BrandLogo className="h-8 w-8" alt="" />
                <div>
                  <p className="text-sm font-bold text-foreground">Console.live</p>
                  <p className="text-xs text-muted-foreground">Session summary</p>
                </div>
              </div>
              <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Active
              </div>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] flex-1 overflow-y-auto">
              <div className="glass-tier-2 border-white/5 bg-white/5 dark:bg-black/10 rounded-xl p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current problem</p>
                    <h3 className="mt-2 text-2xl font-extrabold text-foreground">Graph BFS Review</h3>
                  </div>
                  <div className="rounded-full bg-cyan-500/10 border border-cyan-400/20 px-3 py-1 text-sm font-bold text-cyan-400">
                    +110
                  </div>
                </div>

                {/* Animated Graph bars */}
                <div className="mt-6 h-32 rounded-lg border border-white/5 bg-gradient-to-b from-cyan-400/10 to-transparent p-4 flex items-end gap-3">
                  {[34, 58, 46, 72, 64, 88, 78, 96, 60, 85].map((height, index) => (
                    <span
                      key={index}
                      className="w-full rounded-full bg-cyan-400 opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {stats.map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-border/10 bg-white/5 dark:bg-black/5 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-tier-2 border-white/5 bg-white/5 dark:bg-black/10 rounded-xl p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rank Buddy</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    "Your debugging time dropped 18%. Add edge cases before submitting the next graph problem."
                  </p>
                </div>

                <div className="glass-tier-2 border-white/5 bg-white/5 dark:bg-black/10 rounded-xl p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent laps</p>
                  <div className="mt-4 space-y-3">
                    {activity.map(([name, time, points]) => (
                      <div key={name} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-b-0">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{name}</p>
                          <p className="text-xs text-muted-foreground">{time}</p>
                        </div>
                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-400">{points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative border-t border-border/10 py-20 md:py-32">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-16">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-widest text-primary">Premium workflow</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Tools that stay out of the way
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground font-light">
                Rank Time keeps the interface calm while surfacing the signals that matter during competitive programming practice.
              </p>
            </div>
            <Link href="/register">
              <ShinyButton className="w-48 h-11 flex items-center justify-center">
                Create Account
              </ShinyButton>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`glass-tier-2 glass-interactive rounded-2xl p-6 border-white/10 dark:border-white/5 flex flex-col justify-between h-56`}
                >
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 shadow-md">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-light">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="border-t border-border/10 py-20 md:py-32 bg-white/[0.01] dark:bg-black/[0.01]">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-5xl tracking-tight">Measure, review, improve.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground font-light">
              The product flow is intentionally small: start a session, capture what happened, then use the dashboard to choose the next improvement.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              ['01', 'Track', 'Run focused sessions with lap-level timing.'],
              ['02', 'Analyze', 'Review consistency, score, and weak points.'],
              ['03', 'Advance', 'Earn badges and climb leagues with visible progress.'],
            ].map(([step, title, copy]) => (
              <div key={step} className="glass-tier-3 rounded-2xl p-6 border-white/10 dark:border-white/5 relative overflow-hidden group">
                <span className="absolute top-2 right-4 text-6xl font-black text-cyan-400/5 select-none transition-transform group-hover:scale-110 duration-300">{step}</span>
                <p className="brand-gradient text-sm font-extrabold tracking-wider">{step}</p>
                <h3 className="mt-4 text-xl font-extrabold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-light">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 md:py-32 relative">
        <div className="container">
          <div className="glass-tier-4 border-white/10 dark:border-white/5 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-[80px]" />
            
            <div className="z-10 max-w-2xl">
              <div className="mb-4 flex flex-wrap gap-2">
                {['Private by default', 'Light and dark ready', 'Mongo-backed'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-400">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl font-black text-foreground sm:text-5xl tracking-tight">
                Build better practice habits without visual clutter.
              </h2>
              <p className="mt-4 text-base md:text-lg text-muted-foreground font-light">
                A premium, cyan-led interface with the depth of glassmorphism and the restraint needed for daily use.
              </p>
            </div>
            
            <div className="z-10 shrink-0">
              <Link href="/register">
                <ShinyButton className="w-56 h-13 flex items-center justify-center">
                  Start Practicing
                </ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Refined Footer */}
      <FooterSection />
    </main>
  );
}
