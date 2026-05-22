import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="page-shell relative flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(0,217,255,0.12),transparent_65%)]"
        aria-hidden="true"
      />

      <header className="relative z-10 shrink-0 px-4 pt-6 sm:pt-8">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2.5 rounded-full outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Rank Time home"
        >
          <BrandLogo className="h-9 w-9 sm:h-10 sm:w-10" alt="" />
          <span className="brand-gradient text-xl font-bold sm:text-2xl">Rank Time</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[26rem] sm:max-w-md">{children}</div>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-border/60 bg-background/40 px-4 py-5 text-center text-sm text-muted-foreground backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
        <p className="mt-1 text-xs text-muted-foreground/80">
          Developed by Rafiul Hasan, CSE, BRACU
        </p>
      </footer>
    </div>
  );
}
