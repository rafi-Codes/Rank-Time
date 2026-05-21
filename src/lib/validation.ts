import { z } from 'zod';

const htmlEscapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function sanitizeText(value: string) {
  return value.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] ?? char).trim();
}

const sanitizedString = (min: number, max: number) =>
  z.string().trim().min(min).max(max).transform(sanitizeText);

const optionalSanitizedString = (max: number) =>
  z.string().trim().max(max).transform(sanitizeText).optional().or(z.literal('').transform(() => undefined));

const codeforcesProblemUrl = z
  .string()
  .trim()
  .url()
  .refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === 'codeforces.com' || parsed.hostname.endsWith('.codeforces.com');
    } catch {
      return false;
    }
  }, 'Problem URL must be a Codeforces link')
  .optional()
  .or(z.literal('').transform(() => undefined));

export const sessionSchema = z.object({
  problemTitle: sanitizedString(1, 200),
  problemRating: z.coerce.number().int().min(0).max(4000),
  totalTime: z.coerce.number().int().positive().max(86400),
  laps: z
    .array(
      z.object({
        name: sanitizedString(1, 100),
        time: z.coerce.number().int().positive().max(86400),
        comment: optionalSanitizedString(500),
      })
    )
    .default([]),
  comments: optionalSanitizedString(1000),
  problemUrl: codeforcesProblemUrl,
});

export const emailSchema = z.string().trim().email().max(320).toLowerCase();

export const otpSchema = z.string().trim().regex(/^\d{4,6}$/);

export const passwordSchema = z.string().min(7).max(128);

export const challengeSchema = z.object({
  title: sanitizedString(5, 100),
  description: sanitizedString(5, 250),
  type: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topics: z.array(sanitizedString(1, 50)).min(1).max(8),
  bonusPoints: z.coerce.number().int().min(1).max(50),
  points: z.coerce.number().int().min(0).max(100).optional(),
  category: sanitizedString(1, 50),
  deadline: z.coerce.date().refine((date) => date.getTime() > Date.now(), 'Challenge deadline must be in the future'),
});
