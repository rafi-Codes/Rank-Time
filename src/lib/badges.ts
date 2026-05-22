export const DEFAULT_BADGES = [
  {
    badgeId: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first challenge',
    icon: '🎯',
    category: 'achievement',
    target: 1,
  },
  {
    badgeId: 'problem_solver',
    name: 'Problem Solver',
    description: 'Complete 10 challenges',
    icon: '🧠',
    category: 'achievement',
    target: 10,
  },
  {
    badgeId: 'master_coder',
    name: 'Master Coder',
    description: 'Complete 50 challenges',
    icon: '👑',
    category: 'achievement',
    target: 50,
  },
  {
    badgeId: 'week_streak',
    name: 'Week Warrior',
    description: 'Complete challenges for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    target: 7,
  },
  {
    badgeId: 'month_streak',
    name: 'Monthly Champion',
    description: 'Complete challenges for 30 consecutive days',
    icon: '⭐',
    category: 'streak',
    target: 30,
  },
  {
    badgeId: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 challenges in under 30 minutes each',
    icon: '⚡',
    category: 'skill',
    target: 5,
  },
  {
    badgeId: 'hard_challenge_master',
    name: 'Hard Challenge Master',
    description: 'Complete 10 hard difficulty challenges',
    icon: '💪',
    category: 'skill',
    target: 10,
  },
  {
    badgeId: 'array_specialist',
    name: 'Array Specialist',
    description: 'Complete 10 array-related challenges',
    icon: '📊',
    category: 'skill',
    target: 10,
  },
  {
    badgeId: 'graph_specialist',
    name: 'Graph Specialist',
    description: 'Complete 10 graph-related challenges',
    icon: '🕸️',
    category: 'skill',
    target: 10,
  },
  {
    badgeId: 'dynamic_programming_specialist',
    name: 'DP Specialist',
    description: 'Complete 10 dynamic programming challenges',
    icon: '🧮',
    category: 'skill',
    target: 10,
  },
] as const;

export type DefaultBadge = (typeof DEFAULT_BADGES)[number];

export const DEFAULT_BADGE_BY_ID = DEFAULT_BADGES.reduce<Record<string, DefaultBadge>>((acc, badge) => {
  acc[badge.badgeId] = badge;
  return acc;
}, {});
