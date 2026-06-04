'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  LogOut,
  Moon,
  Settings,
  Sun,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { BrandLogo } from '@/components/brand-logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export type NavLinkItem = {
  label: string;
  href: string;
  isHash?: boolean;
};

export type SettingsMenuItem = {
  label: string;
  value: string;
};

export type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type NavbarProps = {
  variant?: 'marketing' | 'dashboard' | 'minimal';
  links?: NavLinkItem[];
  settingsItems?: SettingsMenuItem[];
  onSettingsSelect?: (value: string) => void;
  onLogoClick?: () => void;
  logoHref?: string;
  user?: NavbarUser;
  onProfileClick?: () => void;
  showSettings?: boolean;
  minimalAction?: React.ReactNode;
};

function NavLink({
  item,
  active,
  onNavigate,
  className,
  style,
}: {
  item: NavLinkItem;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'nav-link group relative px-3 py-2 text-[14px] font-medium text-foreground/90 transition-transform duration-200 hover:scale-[1.04] hover:text-foreground',
        active && 'nav-link-active text-foreground',
        className
      )}
      style={style}
    >
      {item.label}
    </Link>
  );
}

export default function Navbar({
  variant = 'marketing',
  links = [],
  settingsItems = [],
  onSettingsSelect,
  onLogoClick,
  logoHref = '/',
  user,
  onProfileClick,
  showSettings = false,
  minimalAction,
}: NavbarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const settingsRef = useRef<HTMLDivElement>(null);

  const isDashboard = variant === 'dashboard';
  const hasSettings = showSettings && settingsItems.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSettingsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [settingsOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isLinkActive = useCallback(
    (item: NavLinkItem) => {
      if (item.isHash) {
        const hash = item.href.includes('#') ? item.href.slice(item.href.indexOf('#')) : '';
        return pathname === '/' && activeHash === hash;
      }
      return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    },
    [pathname, activeHash]
  );

  const closeMobile = () => setMobileOpen(false);

  const logoContent = (
    <>
      <BrandLogo className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" alt="" />
      <span className="brand-gradient truncate text-xs font-bold sm:text-base lg:text-lg">
        Rank Time
      </span>
    </>
  );

  if (!mounted) {
    return <div className="nav-spacer" aria-hidden="true" />;
  }

  return (
    <>
      <header
        className={cn(
          'nav-floating fixed left-1/2 top-4 z-[9999] w-[calc(100%-2rem)] max-w-[920px] -translate-x-1/2 rounded-full px-4 py-3 sm:px-6',
          'nav-enter flex items-center justify-between gap-3',
          scrolled && 'nav-floating-scrolled'
        )}
      >
        {/* Brand */}
        {onLogoClick ? (
          <button
            type="button"
            onClick={onLogoClick}
            className="flex min-w-0 shrink-0 items-center gap-2 rounded-full outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Rank Time home"
          >
            {logoContent}
          </button>
        ) : (
          <Link
            href={logoHref}
            className="flex min-w-0 shrink-0 items-center gap-2 rounded-full outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Rank Time home"
          >
            {logoContent}
          </Link>
        )}

        {/* Desktop links */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {links.map((item) => (
            <NavLink key={item.href} item={item} active={isLinkActive(item)} />
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {variant === 'minimal' && minimalAction}

          {isDashboard && user && (
            <div className="mr-1 hidden items-center gap-2 lg:flex">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile avatar"
                  className="h-8 w-8 rounded-full border border-[var(--nav-glass-border)] object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan-primary),var(--color-cyan-light))] text-xs font-bold text-white">
                  {(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </div>
              )}
              <span className="max-w-[10rem] truncate text-sm text-muted-foreground">
                Welcome,{' '}
                <button
                  type="button"
                  onClick={onProfileClick}
                  className="font-semibold text-primary underline-offset-4 transition hover:underline"
                >
                  {user.name || user.email}
                </button>
              </span>
            </div>
          )}

          {hasSettings && (
            <div ref={settingsRef} className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen((open) => !open)}
                className="nav-icon-btn flex h-9 w-9 items-center justify-center rounded-full"
                aria-label="Settings menu"
                aria-haspopup="true"
                aria-expanded={settingsOpen}
              >
                <Settings className="h-[18px] w-[18px] text-foreground" />
              </button>
              {settingsOpen && (
                <div className="nav-dropdown absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[11rem] overflow-hidden rounded-2xl py-1">
                  {settingsItems.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        onSettingsSelect?.(item.value);
                        setSettingsOpen(false);
                      }}
                      className="nav-dropdown-item w-full px-4 py-2.5 text-left text-sm font-medium text-foreground"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <ThemeToggle />

          {variant === 'marketing' && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'hidden shrink-0 whitespace-nowrap rounded-full sm:inline-flex'
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full'
                )}
              >
                Start
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          )}

          {isDashboard && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          {variant === 'minimal' && minimalAction}
          <ThemeToggle className="md:hidden" />
          <button
            type="button"
            className="nav-icon-btn flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                'nav-hamburger-bar',
                mobileOpen && 'translate-y-[7px] rotate-45'
              )}
            />
            <span className={cn('nav-hamburger-bar', mobileOpen && 'scale-0 opacity-0')} />
            <span
              className={cn(
                'nav-hamburger-bar',
                mobileOpen && '-translate-y-[7px] -rotate-45'
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        className={cn(
          'nav-backdrop fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          'nav-drawer fixed right-0 top-0 z-[9999] flex h-full w-[75vw] max-w-[320px] flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between border-b border-[var(--nav-glass-border)] px-5 py-4">
          <span className="text-sm font-semibold text-foreground">Menu</span>
          <button
            type="button"
            onClick={closeMobile}
            className="nav-icon-btn flex h-9 w-9 items-center justify-center rounded-full"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
          {isDashboard && user && (
            <div
              className="nav-drawer-item mb-4 flex items-center gap-3 rounded-2xl px-3 py-3"
              style={{ animationDelay: '0ms' }}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="h-10 w-10 rounded-full border border-[var(--nav-glass-border)] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan-primary),var(--color-cyan-light))] text-sm font-bold text-white">
                  {(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name || user.email}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onProfileClick?.();
                    closeMobile();
                  }}
                  className="text-xs font-medium text-primary"
                >
                  View profile
                </button>
              </div>
            </div>
          )}

          {links.map((item, index) => (
            <NavLink
              key={item.href}
              item={item}
              active={isLinkActive(item)}
              onNavigate={closeMobile}
              className="nav-drawer-item rounded-xl"
              style={{ animationDelay: `${(index + 1) * 50}ms` }}
            />
          ))}

          {hasSettings && (
            <>
              <div className="my-3 border-t border-[var(--nav-glass-border)]" />
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                More
              </p>
              {settingsItems.map((item, index) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onSettingsSelect?.(item.value);
                    closeMobile();
                  }}
                  className="nav-drawer-item nav-dropdown-item w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground"
                  style={{ animationDelay: `${(links.length + index + 2) * 50}ms` }}
                >
                  {item.label}
                </button>
              ))}
            </>
          )}

          {variant === 'marketing' && (
            <div
              className="nav-drawer-item mt-4 flex flex-col gap-2 border-t border-[var(--nav-glass-border)] pt-4"
              style={{ animationDelay: `${(links.length + 1) * 50}ms` }}
            >
              <Link
                href="/login"
                onClick={closeMobile}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'default' }),
                  'inline-flex w-full items-center justify-center whitespace-nowrap rounded-full'
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMobile}
                className={cn(
                  buttonVariants({ size: 'default' }),
                  'inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full'
                )}
              >
                Start
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          )}

          {isDashboard && (
            <div
              className="nav-drawer-item mt-4 border-t border-[var(--nav-glass-border)] pt-4"
              style={{ animationDelay: `${(links.length + settingsItems.length + 2) * 50}ms` }}
            >
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  closeMobile();
                  signOut();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          )}

          <div
            className="nav-drawer-item mt-auto flex items-center justify-between border-t border-[var(--nav-glass-border)] px-3 py-4"
            style={{ animationDelay: `${(links.length + settingsItems.length + 4) * 50}ms` }}
          >
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </nav>
      </aside>

      <div className="nav-spacer" aria-hidden="true" />
    </>
  );
}
