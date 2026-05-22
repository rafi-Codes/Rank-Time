/*
 * OTP brute-force / rate limiting helpers.
 *
 * This implementation uses MongoDB as a fallback store. In production, swap to Redis
 * for better TTL and eviction behavior.
 */

import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import connectDB from './db';

type OtpAttemptContext = {
  email: string;
  ip: string;
  purpose: 'reset' | 'verify' | string;
};

const DEFAULTS = {
  maxOtpRequestsPerHour: 5,
  lockAfterFailedAttempts: 5,
  lockMinutes: 15,
  backoffMs: [0, 30_000, 120_000, 300_000, 900_000],
};

function safeIp(ip: string | undefined | null) {
  return (ip || '').toString().trim() || 'unknown_ip';
}

function getHourKey(now: Date) {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const h = String(now.getUTCHours()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:00Z`;
}

function getBackoffMs(failedAttempts: number) {
  return DEFAULTS.backoffMs[Math.min(Math.max(failedAttempts, 0), DEFAULTS.backoffMs.length - 1)];
}

async function getAttemptsDocument(ctx: OtpAttemptContext) {
  const conn = await connectDB();
  const db = conn.connection.db;
  if (!db) {
    throw new Error('Database connection not available');
  }
  const coll = db.collection('otpAttemptLocks');

  const now = new Date();
  const hourBucket = getHourKey(now);

  await coll.updateOne(
    { email: ctx.email, ip: ctx.ip, purpose: ctx.purpose },
    {
      $setOnInsert: {
        createdAt: now,
        failedAttempts: 0,
        lockedUntil: null,
        requestHour: hourBucket,
        requestCount: 0,
        lastAttemptAt: now,
      },
      $set: { updatedAt: now },
    },
    { upsert: true }
  );

  return coll.findOne({ email: ctx.email, ip: ctx.ip, purpose: ctx.purpose });
}

async function updateAttemptsDocument(filter: Record<string, unknown>, update: Record<string, unknown>) {
  const conn = await connectDB();
  const db = conn.connection.db;
  if (!db) {
    throw new Error('Database connection not available');
  }
  const coll = db.collection('otpAttemptLocks');
  await coll.updateOne(filter, update, { upsert: true });
}

export async function checkPasswordResetAttempts(request: NextRequest, ctx: OtpAttemptContext) {
  const ip = safeIp(request.headers.get('x-forwarded-for'));
  const now = new Date();
  const hourBucket = getHourKey(now);
  const filter = { email: ctx.email, ip, purpose: ctx.purpose };

  const doc = await getAttemptsDocument({ ...ctx, ip });
  if (!doc) {
    return { ok: true } as const;
  }

  const lockedUntil = doc.lockedUntil ? new Date(doc.lockedUntil) : null;
  if (lockedUntil && lockedUntil.getTime() > now.getTime()) {
    return { ok: false, retryAfterMs: lockedUntil.getTime() - now.getTime() } as const;
  }

  const requestCount = doc.requestHour === hourBucket ? doc.requestCount ?? 0 : 0;
  if (requestCount >= DEFAULTS.maxOtpRequestsPerHour) {
    const bucketEnd = new Date(`${hourBucket}`);
    bucketEnd.setUTCHours(bucketEnd.getUTCHours() + 1);
    return { ok: false, retryAfterMs: bucketEnd.getTime() - now.getTime() } as const;
  }

  const update: Record<string, unknown> = {
    $set: { requestHour: hourBucket, updatedAt: now },
  };

  if (doc.requestHour === hourBucket) {
    (update as any).$inc = { requestCount: 1 };
  } else {
    (update as any).$set = { ...(update as any).$set, requestCount: 1 };
  }

  await updateAttemptsDocument(filter, update);

  return { ok: true } as const;
}

export async function checkOtpAttempts(request: NextRequest, ctx: OtpAttemptContext) {
  const ip = safeIp(request.headers.get('x-forwarded-for'));
  const now = new Date();

  const doc = await getAttemptsDocument({ ...ctx, ip });
  if (!doc) {
    return { ok: true } as const;
  }

  const lockedUntil = doc.lockedUntil ? new Date(doc.lockedUntil) : null;
  if (lockedUntil && lockedUntil.getTime() > now.getTime()) {
    return { ok: false, retryAfterMs: lockedUntil.getTime() - now.getTime() } as const;
  }

  const failedAttempts = doc.failedAttempts ?? 0;
  const backoffMs = getBackoffMs(failedAttempts);
  const lastAttemptAt = doc.lastAttemptAt ? new Date(doc.lastAttemptAt) : null;

  if (lastAttemptAt && lastAttemptAt.getTime() + backoffMs > now.getTime()) {
    return { ok: false, retryAfterMs: lastAttemptAt.getTime() + backoffMs - now.getTime() } as const;
  }

  return { ok: true } as const;
}

export async function recordFailedOtpAttempt(email: string, ip: string, purpose: string) {
  const now = new Date();
  const filter = { email, ip, purpose };

  await updateAttemptsDocument(filter, {
    $inc: { failedAttempts: 1 },
    $set: { updatedAt: now, lastAttemptAt: now },
  });

  const doc = await getAttemptsDocument({ email, ip, purpose });
  const failedAttempts = doc?.failedAttempts ?? 0;

  if (failedAttempts >= DEFAULTS.lockAfterFailedAttempts) {
    const lockedUntil = new Date(now.getTime() + DEFAULTS.lockMinutes * 60 * 1000);
    await updateAttemptsDocument(filter, {
      $set: { lockedUntil, updatedAt: now },
    });
  }
}

export async function clearOtpAttemptRecord(email: string, ip: string, purpose: string) {
  const conn = await connectDB();
  const db = conn.connection.db;
  if (!db) {
    throw new Error('Database connection not available');
  }
  const coll = db.collection('otpAttemptLocks');

  await coll.deleteOne({ email, ip, purpose });
}

