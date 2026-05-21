// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();

  // Validation helper
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
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

      // Redirect to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const passwordStrength = password.length >= 7 ? 'strong' : password.length >= 4 ? 'medium' : password.length > 0 ? 'weak' : '';

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
            <span className="brand-gradient text-xl font-bold">RankTime</span>
          </Link>
        </div>
      </div>

      {/* Register Card */}
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join RankTime and start tracking your competitive programming progress
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Registration Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Full Name Field */}
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

            {/* Email Field */}
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
                helperText={errors.email || 'We\'ll never share your email'}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
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

            {/* Confirm Password Field */}
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
                success={confirmPassword === password && password !== '' && !errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Creating Account..."
              size="lg"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors hover:text-primary/90"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-4 text-center text-xs text-muted-foreground/70">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>

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
