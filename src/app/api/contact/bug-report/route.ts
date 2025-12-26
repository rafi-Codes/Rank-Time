// src/app/api/contact/bug-report/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, description, severity } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !description) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Prepare email data for Mailjet
    const emailData = {
      Messages: [
        {
          From: {
            Email: process.env.FROM_EMAIL,
            Name: process.env.FROM_NAME,
          },
          To: [
            {
              Email: 'rafihasan27rafi@gmail.com',
              Name: 'Rafi Hasan',
            },
          ],
          Subject: `[RankTime Bug Report] ${subject}`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                🐛 New Bug Report - RankTime
              </h2>

              <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #495057;">Reporter Information</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Severity:</strong>
                  <span style="background: ${
                    severity === 'critical' ? '#dc3545' :
                    severity === 'high' ? '#fd7e14' :
                    severity === 'medium' ? '#ffc107' : '#28a745'
                  }; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                    ${severity.toUpperCase()}
                  </span>
                </p>
              </div>

              <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
                <h3 style="margin-top: 0; color: #856404;">Bug Description</h3>
                <p style="white-space: pre-wrap; color: #495057;">${description}</p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
                <p>This bug report was submitted through the RankTime contact form.</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
        },
      ],
    };

    // Send email via Mailjet
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mailjet API error:', errorData);
      throw new Error('Failed to send email');
    }

    return NextResponse.json(
      { message: 'Bug report sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending bug report:', error);
    return NextResponse.json(
      { error: 'Failed to send bug report' },
      { status: 500 }
    );
  }
}