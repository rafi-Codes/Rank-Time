// src/app/login/page.tsx
'use client';

import { signIn, getSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Chrome } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [socialProviders, setSocialProviders] = useState({ google: false, github: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) setSuccess(message);
  }, []);

  useEffect(() => {
    getProviders().then((providers) => {
      setSocialProviders({
        google: Boolean(providers?.google),
        github: Boolean(providers?.github),
      });
    });
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

  async function handleOAuthSignIn(provider: 'google' | 'github') {
    setError('');
    setSuccess('');
    setSocialLoading(provider);

    const result = await signIn(provider, {
      callbackUrl: '/dashboard',
      redirect: true,
    });

    if (result?.error) {
      setError(result.error);
      setSocialLoading(null);
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
      setFpStatus(data?.message || 'If an account exists, an OTP was sent.');
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
        setFpStatus(data?.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      setFpStatus('Failed to reset password. Please try again.');
    } finally {
      setResetLoading(false);
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
        {!showForgot ? (
          /* Login Card */
          <Card variant="elevated" className="w-full max-w-md">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Sign in to your account</CardTitle>
              <CardDescription>
                Access your RankTime dashboard and track your progress
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Success Message */}
              {success && (
                <Alert variant="success">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Sign In Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* OAuth Buttons */}
              {(socialProviders.google || socialProviders.github) && (
                <>
                  <div className="space-y-3">
                    {socialProviders.google && (
                      <Button
                        type="button"
                        onClick={() => handleOAuthSignIn('google')}
                        disabled={!!socialLoading || isLoading}
                        variant="outline"
                        className="w-full"
                        icon={<Chrome className="h-4 w-4" />}
                        isLoading={socialLoading === 'google'}
                        loadingText="Connecting..."
                      >
                        Continue with Google
                      </Button>
                    )}
                    {socialProviders.github && (
                      <Button
                        type="button"
                        onClick={() => handleOAuthSignIn('github')}
                        disabled={!!socialLoading || isLoading}
                        variant="secondary"
                        className="w-full"
                        icon={<Github className="h-4 w-4" />}
                        isLoading={socialLoading === 'github'}
                        loadingText="Connecting..."
                      >
                        Continue with GitHub
                      </Button>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs uppercase text-muted-foreground">or</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </>
              )}

              {/* Email Input */}
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

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password *
                </Label>
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

              {/* Sign In Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Signing in..."
                size="lg"
                className="w-full"
              >
                Sign In
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setFpStatus('');
                  }}
                  className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
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
        ) : (
          /* Password Reset Card */
          <Card variant="elevated" className="w-full max-w-md">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Reset your password</CardTitle>
              <CardDescription>
                {!otpSent
                  ? 'Enter your email to receive a password reset code'
                  : 'Enter the code and choose a new password'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {fpStatus && (
                <Alert variant={fpStatus.includes('successful') ? 'success' : 'default'}>
                  <AlertDescription>{fpStatus}</AlertDescription>
                </Alert>
              )}

              {!otpSent ? (
                /* Send OTP Step */
                <>
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
                    onClick={handleSendOTP}
                    isLoading={fpLoading}
                    loadingText="Sending..."
                    size="lg"
                    className="w-full"
                  >
                    Send Reset Code
                  </Button>
                </>
              ) : (
                /* Reset Password Step */
                <>
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

                  <div className="flex gap-3">
                    <Button
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
                </>
              )}

              {/* Back to Login */}
              <div className="text-center pt-2 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setOtpSent(false);
                    setFpStatus('');
                  }}
                  className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Back to sign in
                </button>
              </div>
            </CardContent>
          </Card>
        )}
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
