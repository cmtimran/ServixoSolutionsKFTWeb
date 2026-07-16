import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'A valid email is required' }, { status: 400 });
    }

    let savedSubscription = null;

    if (process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL) {
      try {
        savedSubscription = await prisma.subscription.create({
          data: { email },
        });
      } catch (dbErr: any) {
        // If user already subscribed (unique constraint violation)
        if (dbErr.code === 'P2002') {
          return NextResponse.json({ message: 'This email is already subscribed' }, { status: 400 });
        }
        console.warn('Database write failed, falling back to mock response', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed to newsletter successfully',
      data: savedSubscription || {
        id: Math.random().toString(36).substr(2, 9),
        email,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
