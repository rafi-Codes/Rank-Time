// Safe debug endpoint for diagnosing Auth / env issues.
// Enabled only when DEBUG_AUTH=true to avoid leaking production info.
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET() {
  if (process.env.DEBUG_AUTH !== 'true') {
    return NextResponse.json({ ok: false, message: 'debug disabled' }, { status: 404 });
  }

  const safe = {
    nodeEnv: process.env.NODE_ENV || null,
    nextAuthUrl: process.env.NEXTAUTH_URL || null,
    nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
    mongoUriSet: !!process.env.MONGODB_URI,
  };

  return NextResponse.json({ ok: true, data: safe });
}
