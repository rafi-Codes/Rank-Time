import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialAuthButtons } from '@/components/social-auth-buttons';
import { cn } from '@/lib/utils';

type AuthFormCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  socialDividerLabel?: string;
  socialMode?: 'signin' | 'signup';
  disableSocial?: boolean;
  showSocial?: boolean;
  className?: string;
};

export function AuthFormCard({
  title,
  description,
  children,
  footer,
  socialDividerLabel,
  socialMode = 'signin',
  disableSocial = false,
  showSocial = true,
  className,
}: AuthFormCardProps) {
  return (
    <Card variant="elevated" className={cn('w-full overflow-hidden', className)}>
      <CardHeader className="space-y-2 border-b border-border/40 bg-muted/20 px-6 py-6 sm:px-8">
        <CardTitle className="text-center text-2xl sm:text-left">{title}</CardTitle>
        <CardDescription className="text-center sm:text-left">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
        {showSocial ? (
          <SocialAuthButtons
            disabled={disableSocial}
            dividerLabel={socialDividerLabel}
            mode={socialMode}
          />
        ) : null}

        {children}

        {footer ? (
          <div className="border-t border-border/50 pt-5">{footer}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
