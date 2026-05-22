// src/app/login/page.tsx
'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AuthPageShell } from '@/components/auth-page-shell';
import { AuthFormCard } from '@/components/auth-form-card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fpStatus, setFpStatus] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) setSuccess(message);
  }, []);

  const validateLogin = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateLogin()) {
      setError('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error('Sign in error:', result.error);
      setError(result.error);
      setIsLoading(false);
    } else if (result?.ok) {
      await getSession();
      router.push('/dashboard');
    } else {
      console.error('Sign in result:', result);
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  }

  const handleSendOTP = async () => {
    setFpLoading(true);
    setFpStatus('');
    try {
      const res = await fetch('/api/auth/forgot-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setFpStatus(data?.message || data?.data?.message || 'If an account exists, an OTP was sent.');
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setFpStatus('Failed to send OTP. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    setFpStatus('');

    if (newPassword !== confirmPassword) {
      setFpStatus('Passwords do not match');
      setResetLoading(false);
      return;
    }

    if (newPassword.length < 7) {
      setFpStatus('Password must be at least 7 characters');
      setResetLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode, password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setFpStatus('Password reset successful. Please sign in with your new password.');
        setTimeout(() => {
          setShowForgot(false);
          setOtpSent(false);
          setOtpCode('');
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        setFpStatus(data?.error?.message || data?.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      setFpStatus('Failed to reset password. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (showForgot) {
    return (
      <AuthPageShell>
        <AuthFormCard
          title="Reset your password"
          description={
            !otpSent
              ? 'Enter your email to receive a password reset code'
              : 'Enter the code and choose a new password'
          }
          showSocial={false}
          socialMode="signin"
        >
          {fpStatus && (
            <Alert variant={fpStatus.includes('successful') ? 'success' : 'default'}>
              <AlertDescription>{fpStatus}</AlertDescription>
            </Alert>
          )}

          {!otpSent ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={fpLoading}
                />
              </div>

              <Button
                type="button"
                onClick={handleSendOTP}
                isLoading={fpLoading}
                loadingText="Sending..."
                size="lg"
                className="w-full"
              >
                Send Reset Code
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp-code" className="text-sm font-medium">
                  Verification Code *
                </Label>
                <Input
                  id="otp-code"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  disabled={resetLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">
                  New Password *
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  helperText="At least 7 characters"
                  disabled={resetLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-sm font-medium">
                  Confirm Password *
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  success={confirmPassword === newPassword && newPassword !== ''}
                  disabled={resetLoading}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleResetPassword}
                  isLoading={resetLoading}
                  loadingText="Resetting..."
                  size="lg"
                  className="flex-1"
                  variant="success"
                >
                  Reset Password
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setOtpSent(false);
                    setFpStatus('');
                  }}
                  size="lg"
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setOtpSent(false);
                setFpStatus('');
              }}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/90"
            >
              Back to sign in
            </button>
          </div>
        </AuthFormCard>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <AuthFormCard
        title="Sign in to your account"
        description="Access your RankTime dashboard and track your progress"
        socialMode="signin"
        disableSocial={isLoading}
        footer={
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary transition-colors hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        }
      >
        {success && (
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Sign In Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email-address" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email-address"
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
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setFpStatus('');
                }}
                className="text-xs font-medium text-primary transition-colors hover:text-primary/90"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Signing in..."
            size="lg"
            className="w-full"
          >
            Sign In
          </Button>
        </form>
      </AuthFormCard>
    </AuthPageShell>
  );
}
