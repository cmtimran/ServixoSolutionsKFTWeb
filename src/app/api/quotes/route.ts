import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      projectTypes,
      budgetRange,
      timeline,
      projectDescription,
      clientName,
      clientEmail,
      clientPhone,
      companyName,
      attachmentName,
    } = body;

    // Server-side validation
    if (!projectTypes || projectTypes.length === 0) {
      return NextResponse.json({ message: 'Project types required' }, { status: 400 });
    }
    if (!clientName || !clientEmail || !clientPhone) {
      return NextResponse.json({ message: 'Client name, email, and phone are required' }, { status: 400 });
    }

    let savedQuote = null;

    // Check if database url is present before attempting database write
    if (process.env.DATABASE_URL) {
      try {
        savedQuote = await prisma.quote.create({
          data: {
            projectTypes,
            budgetRange,
            timeline,
            projectDescription,
            clientName,
            clientEmail,
            clientPhone,
            companyName,
            attachmentUrl: attachmentName || null,
          },
        });
      } catch (dbErr) {
        console.warn('Database write failed, falling back to mock response', dbErr);
      }
    }

    // Return successful response (mock fallback if db not connected)
    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      data: savedQuote || {
        id: Math.random().toString(36).substr(2, 9),
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
