import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let quotesList: any[] = [];

    if (process.env.DATABASE_URL) {
      quotesList = await prisma.quote.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, data: quotesList });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: 'Quote ID and status are required' }, { status: 400 });
    }

    let updatedQuote = null;

    if (process.env.DATABASE_URL) {
      updatedQuote = await prisma.quote.update({
        where: { id },
        data: { status },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Quote status updated successfully',
      data: updatedQuote || { id, status },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
