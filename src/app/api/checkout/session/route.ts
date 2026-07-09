import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const secretKeySetting = await prisma.setting.findUnique({ where: { key: 'stripeSecretKey' } });
    const stripeSecretKey = secretKeySetting?.value || process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
       return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-06-24.dahlia' as any,
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Update our database Payment record
    const payment = await prisma.payment.findUnique({
      where: { sessionId: session.id }
    });

    if (payment) {
      // Update with the latest status and customer info
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: session.status || 'unknown',
          customerEmail: session.customer_details?.email || null,
          customerName: session.customer_details?.name || null,
        }
      });
    }

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email
    });
  } catch (err: any) {
    console.error('Error retrieving checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
