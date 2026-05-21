export const LEAGUE_THRESHOLDS = {
  bronze: 0,
  silver: 1200,
  gold: 2500,
  platinum: 6000,
  diamond: 12000,
  master: 25000,
  grandmaster: 50000,
} as const;

export type LeagueKey = keyof typeof LEAGUE_THRESHOLDS;

export const LEAGUE_ORDER = Object.keys(LEAGUE_THRESHOLDS) as LeagueKey[];

export function getLeagueForScore(score: number): LeagueKey {
  if (score >= LEAGUE_THRESHOLDS.grandmaster) return 'grandmaster';
  if (score >= LEAGUE_THRESHOLDS.master) return 'master';
  if (score >= LEAGUE_THRESHOLDS.diamond) return 'diamond';
  if (score >= LEAGUE_THRESHOLDS.platinum) return 'platinum';
  if (score >= LEAGUE_THRESHOLDS.gold) return 'gold';
  if (score >= LEAGUE_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

export function getLeagueLabel(league: string): string {
  return league
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
