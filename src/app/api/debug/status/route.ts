// Safe debug endpoint for diagnosing Auth / env issues.
// Enabled only when DEBUG_AUTH=true to avoid leaking production info.
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET() {
  if (process.env.DEBUG_AUTH !== 'true') {
    return NextResponse.json({ ok: false, message: 'debug disabled' }, { status: 404 });
  }

  const rawNextAuthUrl = process.env.NEXTAUTH_URL || null;
  const nextAuthUrl = rawNextAuthUrl ? rawNextAuthUrl.replace(/\/+$/, '') : null;
  const safe = {
    nodeEnv: process.env.NODE_ENV || null,
    nextAuthUrlRaw: rawNextAuthUrl,
    nextAuthUrl: nextAuthUrl,
    nextAuthUrlHasTrailingSlash: !!rawNextAuthUrl && rawNextAuthUrl.endsWith('/'),
    nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
    mongoUriSet: !!process.env.MONGODB_URI,
  };

  return NextResponse.json({ ok: true, data: safe });
}
