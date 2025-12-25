// src/app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email address is required' }, { status: 400 });
    }

    const subject = 'RankTime Email Test';
    const text = 'This is a test email from RankTime using Mailjet API.';
    const html = '<p>This is a <strong>test email</strong> from RankTime using Mailjet API.</p><p>If you received this, email integration is working!</p>';

    await sendEmail(email, subject, text, html);

    return NextResponse.json({ message: 'Test email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { message: 'Failed to send test email', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}