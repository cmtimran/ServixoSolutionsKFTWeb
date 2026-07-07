import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ message: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'A valid email address is required.' }, { status: 400 });
    }

    // In production: send to email service (Resend, SendGrid, etc.) or save to DB
    console.log('[Contact Form Submission]', {
      name,
      email,
      company: body.company || '—',
      phone: body.phone || '—',
      department: body.department || 'general',
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We\'ll respond within 2 business hours.',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
