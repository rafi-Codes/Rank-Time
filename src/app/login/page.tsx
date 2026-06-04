// src/app/login/page.tsx
'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, CheckCircle2, ChevronLeft, ShieldCheck, Mail, Lock } from 'lucide-react';
import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { SaveButton } from '@/components/ui/save-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { TextScramble } from '@/components/ui/text-scramble';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrandLogo } from '@/components/brand-logo';
import { SocialAuthButtons } from '@/components/social-auth-buttons';
import FooterSection from '@/components/ui/footer';

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

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!validateLogin()) {
      setError('Please fix the errors below');
      throw new Error('Validation failed');
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        setError(result.error);
        setIsLoading(false);
        throw new Error(result.error);
      } else if (result?.ok) {
        await getSession();
        // Wait 1 second so they see the Saved! state and confetti before redirecting
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/dashboard');
      } else {
        console.error('Sign in result:', result);
        const errMsg = 'Failed to sign in. Please try again.';
        setError(errMsg);
        setIsLoading(false);
        throw new Error(errMsg);
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
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

  return (
    <div className="premium-shell page-enter min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="premium-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Floating Header */}
      <header className="relative z-20 shrink-0 px-6 py-4 flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Rank Time home"
        >
          <BrandLogo className="h-8 w-8" alt="" />
          <span className="brand-gradient text-lg font-black tracking-wider uppercase">Rank Time</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Card Section */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass-tier-4 border-white/10 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Glossy top border light */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {showForgot ? (
              // Reset Password Flow
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-black text-foreground">
                    <TextScramble duration={0.6}>Reset your password</TextScramble>
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground font-light">
                    {!otpSent
                      ? 'Enter your email to receive a password reset code'
                      : 'Enter the code and choose a new password'}
                  </p>
                </div>

                {fpStatus && (
                  <Alert variant={fpStatus.includes('successful') ? 'success' : 'default'} className="border-cyan-400/20 bg-cyan-400/5">
                    <AlertDescription>{fpStatus}</AlertDescription>
                  </Alert>
                )}

                {!otpSent ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Input
                          id="reset-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          disabled={fpLoading}
                          className="pl-10 border-white/10 bg-white/5 dark:bg-black/20 focus:border-cyan-400/50"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>

                    <ShinyButton
                      type="button"
                      onClick={handleSendOTP}
                      disabled={fpLoading}
                      className="w-full h-11"
                    >
                      {fpLoading ? 'Sending...' : 'Send Reset Code'}
                    </ShinyButton>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="otp-code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Verification Code *
                      </Label>
                      <Input
                        id="otp-code"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="000000"
                        disabled={resetLoading}
                        className="border-white/10 bg-white/5 dark:bg-black/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        New Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={resetLoading}
                          className="pl-10 border-white/10 bg-white/5 dark:bg-black/20"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      </div>
                      <p className="text-xs text-muted-foreground/80 font-light">At least 7 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-new-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-new-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={resetLoading}
                          className="pl-10 border-white/10 bg-white/5 dark:bg-black/20"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <ShinyButton
                        type="button"
                        onClick={handleResetPassword}
                        disabled={resetLoading}
                        className="flex-1 h-11"
                      >
                        {resetLoading ? 'Resetting...' : 'Reset Password'}
                      </ShinyButton>
                      <LiquidButton
                        type="button"
                        onClick={() => {
                          setShowForgot(false);
                          setOtpSent(false);
                          setFpStatus('');
                        }}
                        className="flex-1 h-11 border border-border/20"
                      >
                        Cancel
                      </LiquidButton>
                    </div>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setOtpSent(false);
                      setFpStatus('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:text-cyan-400 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to sign in
                  </button>
                </div>
              </div>
            ) : (
              // Login Flow
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-black text-foreground">
                    <TextScramble duration={0.6}>Sign in to your account</TextScramble>
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground font-light">
                    Access your RankTime dashboard and track your progress
                  </p>
                </div>

                {success && (
                  <Alert variant="success" className="border-emerald-500/20 bg-emerald-500/5">
                    <AlertTitle className="text-emerald-400 font-bold">Success</AlertTitle>
                    <AlertDescription className="text-muted-foreground">{success}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="border-rose-500/20 bg-rose-500/5">
                    <AlertTitle className="text-rose-400 font-bold">Sign In Error</AlertTitle>
                    <AlertDescription className="text-muted-foreground">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Social Login Buttons */}
                <SocialAuthButtons
                  disabled={isLoading}
                  dividerLabel="or continue with email"
                  mode="signin"
                />

                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email-address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address *
                    </Label>
                    <div className="relative">
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
                        placeholder="you@example.com"
                        disabled={isLoading}
                        className="pl-10 border-white/10 bg-white/5 dark:bg-black/20 focus:border-cyan-400/50"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Password *
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgot(true);
                          setFpStatus('');
                        }}
                        className="text-xs font-bold text-primary hover:text-cyan-400 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
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
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="pl-10 border-white/10 bg-white/5 dark:bg-black/20 focus:border-cyan-400/50"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    </div>
                    {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
                  </div>

                  <SaveButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 mt-2 text-foreground font-semibold"
                    text={{
                      idle: "Sign In",
                      saving: "Signing in...",
                      saved: "Signed In!"
                    }}
                    onSave={handleSubmit}
                  />
                </form>

                <div className="border-t border-border/10 pt-5 text-center">
                  <p className="text-sm text-muted-foreground font-light">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/register"
                      className="font-bold text-primary hover:text-cyan-400 transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
