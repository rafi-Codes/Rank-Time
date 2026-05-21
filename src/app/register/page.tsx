// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 7) {
      setError('Password should be at least 7 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

        // Redirect to OTP verification page
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
            <span className="brand-gradient text-xl font-bold">RankTime</span>
          </Link>
        </div>
      </div>

      <div className="glass-panel w-full max-w-md space-y-8 rounded-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
          <p className="text-muted-foreground mt-2">Enter your details to get started</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 hidden border-t border-border/70 py-6 text-center text-sm text-muted-foreground md:block">
        <div>
          <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
          <p className="mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
        </div>
      </footer>
    </div>
  );
}
