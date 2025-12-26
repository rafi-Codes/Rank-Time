"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('Invalid reset link');
    }
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('Passwords do not match');
      return;
    }
    if (password.trim().length < 7) {
      setStatus('Password must be at least 7 characters');
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Password reset successful — redirecting to login...');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setStatus(data?.message || 'Failed to reset password');
      }
    } catch (err) {
      setStatus('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      {status && <p className="mb-4 text-sm">{status}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="New password"
          required
          className="w-full p-2 border rounded"
        />
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          type="password"
          placeholder="Confirm new password"
          required
          className="w-full p-2 border rounded"
        />
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Reset password</button>
      </form>
    </div>
  );
}
