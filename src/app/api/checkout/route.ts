import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { productName, planTier, price, interval = 'month' } = await req.json();

    // Fetch Stripe keys from the database settings
    const secretKeySetting = await prisma.setting.findUnique({ where: { key: 'stripeSecretKey' } });
    const publicKeySetting = await prisma.setting.findUnique({ where: { key: 'stripePublicKey' } });

    const stripeSecretKey = secretKeySetting?.value || process.env.STRIPE_SECRET_KEY;
    const stripePublicKey = publicKeySetting?.value || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
       // Simulate checkout if Stripe isn't configured
       return NextResponse.json({ 
         mock: true,
         url: `/checkout/mock?session_id=mock_session_${Date.now()}`
       });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-06-24.dahlia' as any,
    });

    // Convert price string/number to cents
    const unitAmount = parseInt(String(price).replace(/[^0-9]/g, '')) * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${productName} - ${planTier} Plan`,
            },
            unit_amount: unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription', // or 'payment' if it's a one-time charge, but standard SaaS is subscription
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
    });

    return NextResponse.json({ sessionId: session.id, publicKey: stripePublicKey });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
