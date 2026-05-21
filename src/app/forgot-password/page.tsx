'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setStatus(null);
    setStatusType(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatusType('success');
        setStatus(data?.message || 'If an account exists with this email, a reset link has been sent.');
        setEmail('');
      } else {
        setStatusType('error');
        setStatus(data?.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatusType('error');
      setStatus('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell min-h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
            <span className="brand-gradient text-xl font-bold">RankTime</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Card variant="elevated" className="w-full max-w-md">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your account email and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Messages */}
            {status && (
              <Alert variant={statusType === 'success' ? 'success' : 'destructive'}>
                <AlertTitle>{statusType === 'success' ? 'Check your email' : 'Error'}</AlertTitle>
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={loading}
                loadingText="Sending..."
              >
                Send Reset Link
              </Button>
            </form>

            {/* Info Text */}
            <p className="text-sm text-muted-foreground text-center">
              For security, we only send reset links to accounts that exist in our system.
            </p>

            {/* Links */}
            <div className="space-y-2 text-center pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary/90 transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:text-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-border/70 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
          <p className="mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
        </div>
      </footer>
    </div>
  );
}
