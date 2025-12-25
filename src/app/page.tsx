"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Rank Time Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Rank Time</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="container px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rank Time
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Track your competitive programming journey, analyze your performance, and climb the ranks with data-driven insights.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t py-16 md:py-24 lg:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Features</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to track and improve your competitive programming skills
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Session Tracking',
                description: 'Track your practice sessions with detailed timing and problem information.',
                icon: '⏱️'
              },
              {
                title: 'Codeforces Integration',
                description: 'Sync with your Codeforces account to track your progress and statistics.',
                icon: '📊'
              },
              {
                title: 'Performance Analytics',
                description: 'Get insights into your performance with detailed analytics and visualizations.',
                icon: '📈'
              },
              {
                title: 'Progress Tracking',
                description: 'Monitor your improvement over time with comprehensive progress tracking.',
                icon: '📅'
              },
              {
                title: 'Problem Recommendations',
                description: 'Get personalized problem recommendations based on your skill level.',
                icon: '🎯'
              },
              {
                title: 'Community',
                description: 'Connect with other competitive programmers and share your progress.',
                icon: '👥'
              }
            ].map((feature, index) => (
              <div key={index} className="rounded-lg border p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} RankTime. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
