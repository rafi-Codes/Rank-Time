// src/app/login/page.tsx
'use client';

import { signIn, getSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Chrome } from 'lucide-react';

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
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [socialProviders, setSocialProviders] = useState({ google: false, github: false });
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await signIn('credentials', {
      redirect: false, // Change back to false to handle errors
      email,
      password,
    });

    if (result?.error) {
      console.error('Sign in error:', result.error);
      setError(result.error);
      setIsLoading(false);
    } else if (result?.ok) {
      // Refetch session to ensure it's updated
      await getSession();
      router.push('/dashboard');
    } else {
      console.error('Sign in result:', result);
      setError('Unknown sign in error');
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

  return (
    <div className="page-shell min-h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
            <span className="brand-gradient text-xl font-bold">RankTime</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="glass-panel w-full max-w-md space-y-8 rounded-xl p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
        </div>
        {(socialProviders.google || socialProviders.github) && (
          <div className="space-y-3">
            {socialProviders.google && (
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                disabled={!!socialLoading || isLoading}
                className="glass-panel flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:text-primary disabled:opacity-50"
              >
                <Chrome className="h-4 w-4" />
                {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </button>
            )}
            {socialProviders.github && (
              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                disabled={!!socialLoading || isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0F1419] bg-[#0F1419] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 dark:border-border"
              >
                <Github className="h-4 w-4" />
                {socialLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="text-sm text-emerald-600 dark:text-emerald-300">{success}</div>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg border border-input bg-background/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-background/40 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-lg border border-input bg-background/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-background/40 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-[linear-gradient(135deg,var(--color-cyan-primary),var(--color-cyan-light))] px-4 py-2 text-sm font-semibold text-[#0F1419] shadow-[0_8px_22px_rgba(0,217,255,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,217,255,0.42)] focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Forgot password inline panel */}
        <div className="mt-4 text-center">
          {!showForgot ? (
            <button
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => { setShowForgot(true); setFpStatus(''); }}
            >
              Forgot password?
            </button>
          ) : (
            <div className="glass-panel rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Reset password via email OTP</h4>
              {!otpSent ? (
                <>
                  <p className="text-sm text-muted-foreground mb-2">Enter your account email and we will send a one-time code.</p>
                  <div className="flex gap-2">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 rounded-lg border border-input bg-background/80 p-2"
                    />
                    <button
                      type="button"
                      onClick={async () => {
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
                          setFpStatus('Failed to send OTP');
                        }
                      }}
                      className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                    >Send OTP</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-2">Enter the code we emailed and choose a new password.</p>
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    type="text"
                    placeholder="One-time code"
                    className="mb-2 w-full rounded-lg border border-input bg-background/80 p-2"
                  />
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="New password"
                    className="mb-2 w-full rounded-lg border border-input bg-background/80 p-2"
                  />
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm password"
                    className="mb-2 w-full rounded-lg border border-input bg-background/80 p-2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        setFpStatus('');
                        if (newPassword !== confirmPassword) { setFpStatus('Passwords do not match'); return; }
                        try {
                          const res = await fetch('/api/auth/reset-password-otp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, otp: otpCode, password: newPassword }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setFpStatus('Password reset successful. Please sign in with your new password.');
                            setShowForgot(false);
                            setOtpSent(false);
                            setOtpCode('');
                            setNewPassword('');
                            setConfirmPassword('');
                          } else {
                            setFpStatus(data?.message || 'Failed to reset password');
                          }
                        } catch (err) {
                          console.error(err);
                          setFpStatus('Failed to reset password');
                        }
                      }}
                      className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white"
                    >Reset</button>
                    <button
                      type="button"
                      onClick={() => { setShowForgot(false); setOtpSent(false); setFpStatus(''); }}
                      className="rounded-lg border border-border px-3 py-2 text-sm font-semibold"
                    >Cancel</button>
                  </div>
                </>
              )}
              {fpStatus && <p className="mt-2 text-sm">{fpStatus}</p>}
            </div>
          )}
        </div>

        <div className="text-center">
            <p className="text-sm text-muted-foreground">
            Do not have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
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
