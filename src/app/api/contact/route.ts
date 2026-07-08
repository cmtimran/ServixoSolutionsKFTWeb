import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Save to Database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: body.department || 'general',
        message: `Company: ${body.company || '—'}\nPhone: ${body.phone || '—'}\n\n${message}`,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We\'ll respond within 2 business hours.',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
