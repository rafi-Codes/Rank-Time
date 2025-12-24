import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random unique usertag
export function generateUserTag(): string {
  const adjectives = [
    'Swift', 'Bold', 'Clever', 'Brave', 'Wise', 'Quick', 'Sharp', 'Smart',
    'Fast', 'Agile', 'Keen', 'Bright', 'Crafty', 'Daring', 'Eager', 'Fierce',
    'Grand', 'Hasty', 'Ideal', 'Jolly', 'Kind', 'Lively', 'Mighty', 'Noble',
    'Proud', 'Quick', 'Rapid', 'Smart', 'Tough', 'Ultra', 'Vivid', 'Witty',
    'Xenon', 'Young', 'Zesty', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Echo'
  ];

  const nouns = [
    'Coder', 'Hacker', 'Dev', 'Ninja', 'Wizard', 'Guru', 'Master', 'Pro',
    'Expert', 'Ace', 'Champ', 'Hero', 'Star', 'King', 'Queen', 'Lord',
    'Sage', 'Mind', 'Brain', 'Soul', 'Spirit', 'Force', 'Power', 'Storm',
    'Thunder', 'Lightning', 'Fire', 'Ice', 'Wind', 'Earth', 'Sky', 'Sea'
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 9999) + 1;

  return `${randomAdjective}${randomNoun}${randomNumber}`;
}
