import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <header className="shrink-0 px-4 pt-6 sm:pt-8">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2 rounded-full outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Rank Time home"
        >
          <BrandLogo className="h-8 w-8 sm:h-9 sm:w-9" alt="" />
          <span className="brand-gradient text-lg font-bold sm:text-xl">Rank Time</span>
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="shrink-0 border-t border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
        <p className="mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
      </footer>
    </div>
  );
}
