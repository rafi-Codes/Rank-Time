// src/app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) setSuccess(message);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl: '/dashboard',
    });

    // If we reach here, sign in failed
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // If successful, NextAuth will handle the redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">RankTime</span>
          </Link>
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
              <div className="text-sm text-green-700 dark:text-green-300">{success}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Forgot password inline panel */}
        <div className="mt-4 text-center">
          {!showForgot ? (
            <button
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => { setShowForgot(true); setFpStatus(''); }}
            >
              Forgot password?
            </button>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
              <h4 className="text-sm font-medium mb-2">Reset password via email OTP</h4>
              {!otpSent ? (
                <>
                  <p className="text-sm text-gray-600 mb-2">Enter your account email and we'll send a one-time code.</p>
                  <div className="flex gap-2">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
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
                      className="px-3 py-2 bg-blue-600 text-white rounded"
                    >Send OTP</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">Enter the code we emailed and choose a new password.</p>
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    type="text"
                    placeholder="One-time code"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="New password"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm password"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <div className="flex gap-2">
                    <button
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
                      className="px-3 py-2 bg-green-600 text-white rounded"
                    >Reset</button>
                    <button
                      onClick={() => { setShowForgot(false); setOtpSent(false); setFpStatus(''); }}
                      className="px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded"
                    >Cancel</button>
                  </div>
                </>
              )}
              {fpStatus && <p className="mt-2 text-sm">{fpStatus}</p>}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}