import { z } from 'zod';

export const emailSchema = z.string().trim().email();
export const otpSchema = z.string().trim().min(4).max(8);
export const passwordSchema = z.string().min(7).max(128);

export const forgotPasswordOtpSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resetPasswordOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  password: passwordSchema,
});

export const sessionSchema = z.object({
  problemTitle: z.string().min(1).max(200),
  problemRating: z.number().min(0).max(4000),
  totalTime: z.number().min(1).max(86400),
  laps: z.array(
    z.object({
      name: z.string().min(1).max(100),
      time: z.number().min(1).max(86400),
      comment: z.string().max(500).optional(),
    })
  ),
  comments: z.string().max(1000).optional(),
  problemUrl: z.string().url().optional(),
});

export const challengeSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(200),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topics: z.array(z.string().min(1).max(50)).min(1),
  bonusPoints: z.number().min(5).max(20),
  category: z.enum(['algorithms', 'data-structures', 'consistency', 'difficulty', 'practice', 'learning', 'general']),
  type: z.enum(['daily', 'weekly', 'monthly']),
  deadline: z.preprocess((value) => {
    if (typeof value === 'string' || value instanceof Date) {
      return new Date(value);
    }
    return value;
  }, z.date().refine((date) => date.getTime() > Date.now(), {
    message: 'Deadline must be in the future',
  })),
});

export const learningCurriculumWeekSchema = z.object({
  week: z.number().int().min(1),
  focus: z.string().min(5).max(200),
  goals: z.array(z.string().min(5)).min(1),
  practice: z.array(z.string().min(5)).min(1),
  resources: z.array(z.string().min(5)).optional(),
});

export const learningCurriculumSchema = z.object({
  strengths: z.array(z.string().min(5)).min(1),
  weaknesses: z.array(z.string().min(5)).min(1),
  recommendations: z.array(z.string().min(5)).min(1),
  curriculum: z.array(learningCurriculumWeekSchema).min(3).max(8),
});
