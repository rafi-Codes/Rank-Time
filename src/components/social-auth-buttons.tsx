'use client';

import { useEffect, useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { Chrome, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SocialAuthButtonsProps = {
  disabled?: boolean;
  showDivider?: boolean;
  dividerLabel?: string;
};

export function SocialAuthButtons({
  disabled = false,
  showDivider = true,
  dividerLabel = 'or',
}: SocialAuthButtonsProps) {
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [socialProviders, setSocialProviders] = useState({ google: false, github: false });
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    getProviders().then((providers) => {
      setSocialProviders({
        google: Boolean(providers?.google),
        github: Boolean(providers?.github),
      });
    });
  }, []);

  async function handleOAuthSignIn(provider: 'google' | 'github') {
    setOauthError('');
    setSocialLoading(provider);

    const result = await signIn(provider, {
      callbackUrl: '/dashboard',
      redirect: true,
    });

    if (result?.error) {
      setOauthError(result.error);
      setSocialLoading(null);
    }
  }

  if (!socialProviders.google && !socialProviders.github) {
    return null;
  }

  return (
    <div className="space-y-3">
      {oauthError && (
        <p className="text-center text-sm text-destructive" role="alert">
          {oauthError}
        </p>
      )}

      {socialProviders.google && (
        <Button
          type="button"
          onClick={() => handleOAuthSignIn('google')}
          disabled={disabled || !!socialLoading}
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
          disabled={disabled || !!socialLoading}
          variant="secondary"
          className="w-full"
          icon={<Github className="h-4 w-4" />}
          isLoading={socialLoading === 'github'}
          loadingText="Connecting..."
        >
          Continue with GitHub
        </Button>
      )}

      {showDivider && (
        <div className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase text-muted-foreground">{dividerLabel}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}
    </div>
  );
}
