import RateLimit from '@/models/RateLimit';
import { logger } from '@/lib/logger';

const OTP_FAILURE_LIMIT = 5;
const OTP_LOCK_MS = 15 * 60 * 1000;
const PASSWORD_RESET_REQUEST_LIMIT = 5;
const PASSWORD_RESET_WINDOW_MS = 60 * 60 * 1000;
const FAILURE_WINDOW_MS = 60 * 60 * 1000;
const BACKOFF_MS = [0, 30_000, 120_000, 300_000, 900_000];

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function requestKey(email: string, ip: string) {
  return `${normalizeKey(email)}:${ip || 'unknown'}`;
}

export async function checkOtpAttempts(email: string, ip: string) {
  const now = new Date();
  const checks = await RateLimit.find({
    key: { $in: [normalizeKey(email), requestKey(email, ip)] },
    scope: 'otp_verify',
    resetAt: { $gt: now },
  });

  const locked = checks.find((record) => record.lockedUntil && record.lockedUntil > now);
  if (locked) {
    return {
      allowed: false,
      reason: 'locked',
      retryAfterSeconds: Math.ceil((locked.lockedUntil!.getTime() - now.getTime()) / 1000),
    };
  }

  const delayed = checks.find((record) => record.nextAllowedAt && record.nextAllowedAt > now);
  if (delayed) {
    return {
      allowed: false,
      reason: 'backoff',
      retryAfterSeconds: Math.ceil((delayed.nextAllowedAt!.getTime() - now.getTime()) / 1000),
    };
  }

  return { allowed: true };
}

export async function recordOtpFailure(email: string, ip: string) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + FAILURE_WINDOW_MS);
  const keys = [normalizeKey(email), requestKey(email, ip)];

  for (const key of keys) {
    const record = await RateLimit.findOneAndUpdate(
      { key, scope: 'otp_verify' },
      {
        $setOnInsert: { resetAt },
        $inc: { attempts: 1 },
      },
      { upsert: true, new: true }
    );

    if (record.resetAt <= now) {
      record.attempts = 1;
      record.resetAt = resetAt;
    }

    if (record.attempts >= OTP_FAILURE_LIMIT) {
      record.lockedUntil = new Date(now.getTime() + OTP_LOCK_MS);
      record.nextAllowedAt = record.lockedUntil;
    } else {
      const delay = BACKOFF_MS[Math.min(record.attempts - 1, BACKOFF_MS.length - 1)];
      record.nextAllowedAt = new Date(now.getTime() + delay);
    }

    await record.save();
  }

  logger.warn('OTP verification failed', { email: normalizeKey(email), ip });
}

export async function clearOtpAttempts(email: string, ip: string) {
  await RateLimit.deleteMany({
    key: { $in: [normalizeKey(email), requestKey(email, ip)] },
    scope: 'otp_verify',
  });
}

export async function checkPasswordResetAttempts(email: string, ip: string) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + PASSWORD_RESET_WINDOW_MS);
  const keys = [normalizeKey(email), requestKey(email, ip)];

  for (const key of keys) {
    const record = await RateLimit.findOneAndUpdate(
      { key, scope: 'password_reset_request' },
      {
        $setOnInsert: { resetAt },
        $inc: { attempts: 1 },
      },
      { upsert: true, new: true }
    );

    if (record.resetAt <= now) {
      record.attempts = 1;
      record.resetAt = resetAt;
      await record.save();
    }

    if (record.attempts > PASSWORD_RESET_REQUEST_LIMIT) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((record.resetAt.getTime() - now.getTime()) / 1000),
      };
    }
  }

  return { allowed: true };
}
