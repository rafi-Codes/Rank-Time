'use client';

import { useEffect, useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleIcon, GitHubIcon } from '@/components/oauth-provider-icons';
import { cn } from '@/lib/utils';

type SocialAuthButtonsProps = {
  disabled?: boolean;
  showDivider?: boolean;
  dividerLabel?: string;
  mode?: 'signin' | 'signup';
};

type ProviderId = 'google' | 'github';

const PROVIDER_LABELS: Record<ProviderId, { signin: string; signup: string }> = {
  google: {
    signin: 'Continue with Google',
    signup: 'Sign up with Google',
  },
  github: {
    signin: 'Continue with GitHub',
    signup: 'Sign up with GitHub',
  },
};

export function SocialAuthButtons({
  disabled = false,
  showDivider = true,
  dividerLabel,
  mode = 'signin',
}: SocialAuthButtonsProps) {
  const [socialLoading, setSocialLoading] = useState<ProviderId | null>(null);
  const [availableProviders, setAvailableProviders] = useState<Record<ProviderId, boolean>>({
    google: false,
    github: false,
  });
  const [providersReady, setProvidersReady] = useState(false);
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getProviders()
      .then((providers) => {
        if (cancelled) return;
        setAvailableProviders({
          google: Boolean(providers?.google),
          github: Boolean(providers?.github),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableProviders({ google: false, github: false });
        }
      })
      .finally(() => {
        if (!cancelled) setProvidersReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleOAuthSignIn(provider: ProviderId) {
    if (!availableProviders[provider]) {
      setOauthError(
        provider === 'github'
          ? 'GitHub sign-in is not configured yet. Add GITHUB_ID and GITHUB_SECRET to your environment.'
          : 'Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your environment.'
      );
      return;
    }

    setOauthError('');
    setSocialLoading(provider);

    await signIn(provider, {
      callbackUrl: '/dashboard',
      redirect: true,
    });
  }

  const resolvedDivider =
    dividerLabel ?? (mode === 'signup' ? 'or sign up with email' : 'or continue with email');

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-muted-foreground sm:text-left">
        {mode === 'signup' ? 'Quick sign up' : 'Quick sign in'}
      </p>

      {oauthError ? (
        <Alert variant="destructive">
          <AlertDescription>{oauthError}</AlertDescription>
        </Alert>
      ) : null}

      <div
        className={cn(
          'grid gap-3',
          providersReady ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
        )}
      >
        {(['google', 'github'] as const).map((provider) => {
          const isAvailable = availableProviders[provider];
          const isLoading = socialLoading === provider;
          const label = PROVIDER_LABELS[provider][mode];

          return (
            <Button
              key={provider}
              type="button"
              onClick={() => handleOAuthSignIn(provider)}
              disabled={disabled || isLoading || !providersReady}
              variant="outline"
              size="lg"
              className={cn(
                'h-11 w-full justify-center gap-2.5 border-border/80 bg-background/80',
                !isAvailable && providersReady && 'opacity-70'
              )}
              icon={provider === 'google' ? <GoogleIcon /> : <GitHubIcon />}
              isLoading={isLoading}
              loadingText="Connecting..."
              aria-label={label}
            >
              <span className="truncate">{label}</span>
            </Button>
          );
        })}
      </div>

      {!providersReady ? (
        <p className="text-center text-xs text-muted-foreground">Loading sign-in options…</p>
      ) : null}

      {showDivider ? (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {resolvedDivider}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      ) : null}
    </div>
  );
}
