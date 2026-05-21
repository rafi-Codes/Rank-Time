'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatusType('error');
      setStatus('Invalid reset link. Please request a new password reset.');
    }
    setIsInitialized(true);
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 7) {
      newErrors.password = 'Password must be at least 7 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatus(null);
    setStatusType(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatusType('success');
        setStatus('Password reset successful! Redirecting to login...');
        setTimeout(() => router.push('/login?message=Password reset successfully. Please sign in.'), 2000);
      } else {
        setStatusType('error');
        setStatus(data?.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatusType('error');
      setStatus('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

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
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Set new password</CardTitle>
            <CardDescription className="text-center">
              Create a strong password for your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Messages */}
            {status && (
              <Alert variant={statusType === 'success' ? 'success' : 'destructive'}>
                <AlertTitle>
                  {statusType === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            {token && statusType !== 'error' ? (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    error={!!errors.password}
                    helperText={errors.password || 'At least 7 characters'}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    error={!!errors.confirmPassword}
                    success={confirmPassword === password && password !== '' && !errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={loading}
                  loadingText="Resetting..."
                >
                  Reset Password
                </Button>
              </form>
            ) : null}

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center text-muted-foreground">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
