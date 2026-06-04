// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SaveButton } from '@/components/ui/save-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AuthPageShell } from '@/components/auth-page-shell';
import { AuthFormCard } from '@/components/auth-form-card';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
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

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fix the errors below');
      throw new Error('Validation failed');
    }

    setIsLoading(true);

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
        throw new Error(data.message || 'Failed to create account');
      }

      // Wait 1 second so they see the Saved! state and confetti before redirecting
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setError(message);
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const passwordStrength =
    password.length >= 7 ? 'strong' : password.length >= 4 ? 'medium' : password.length > 0 ? 'weak' : '';

  return (
    <AuthPageShell>
      <AuthFormCard
        title="Create an account"
        description="Join RankTime and start tracking your competitive programming progress"
        socialMode="signup"
        disableSocial={isLoading}
        className="sm:max-w-lg"
        footer={
          <>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors hover:text-primary/90"
              >
                Sign in
              </Link>
            </p>
            <p className="mt-4 text-center text-xs text-muted-foreground/70">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
            </p>
          </>
        }
      >
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Registration Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              placeholder="your@email.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              error={!!errors.email}
              helperText={errors.email || "We'll never share your email"}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              error={!!errors.password}
              helperText={
                errors.password ||
                `${password.length}/7 characters (${passwordStrength || 'start typing'})`
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm Password *
            </Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: '' });
                }
              }}
              error={!!errors.confirmPassword}
              success={
                confirmPassword === password && password !== '' && !errors.confirmPassword
              }
              helperText={errors.confirmPassword}
              disabled={isLoading}
            />
          </div>

          <SaveButton
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 text-foreground font-semibold"
            text={{
              idle: "Create Account",
              saving: "Creating Account...",
              saved: "Account Created!"
            }}
            onSave={handleSubmit}
          />
        </form>
      </AuthFormCard>
    </AuthPageShell>
  );
}
