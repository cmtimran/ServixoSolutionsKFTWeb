import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const secretKeySetting = await prisma.setting.findUnique({ where: { key: 'stripeSecretKey' } });
    const stripeSecretKey = secretKeySetting?.value || process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-06-24.dahlia' as any,
    });

    const pendingPayments = await prisma.payment.findMany({
      where: { status: { in: ['pending', 'open'] } }
    });

    let updatedCount = 0;

    for (const payment of pendingPayments) {
      try {
        const session = await stripe.checkout.sessions.retrieve(payment.sessionId);
        if (session.status !== payment.status) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { 
              status: session.status || 'unknown',
              customerEmail: session.customer_details?.email || payment.customerEmail,
              customerName: session.customer_details?.name || payment.customerName,
            }
          });
          updatedCount++;
        }
      } catch (err) {
        // Session might not exist or error
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
