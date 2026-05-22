import type { NavLinkItem, SettingsMenuItem } from './Navbar';

export const marketingNavLinks: NavLinkItem[] = [
  { label: 'Features', href: '/#features', isHash: true },
  { label: 'Workflow', href: '/#workflow', isHash: true },
  { label: 'Contact', href: '/contact' },
];

export const dashboardSettingsItems: SettingsMenuItem[] = [
  { label: 'Leaderboard', value: 'leaderboard' },
  { label: 'Rank Buddy', value: 'rankbuddy' },
  { label: 'Tracksheet', value: 'tracksheet' },
  { label: 'Graphs', value: 'graphs' },
  { label: 'Codeforces', value: 'codeforces' },
  { label: 'Social', value: 'social' },
];

export const termsNavLinks: NavLinkItem[] = [
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Dashboard', href: '/dashboard' },
];

export const privacyNavLinks: NavLinkItem[] = [
  { label: 'Contact', href: '/contact' },
  { label: 'Dashboard', href: '/dashboard' },
];
