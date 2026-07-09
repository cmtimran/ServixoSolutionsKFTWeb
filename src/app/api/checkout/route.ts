import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { productName, planTier, price, interval = 'month' } = await req.json();
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://www.servixosolutionskft.com';

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
      ui_mode: 'embedded' as any,
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
      mode: 'subscription',
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        productName,
        planTier,
      }
    });

    // Create a pending payment record
    await prisma.payment.create({
      data: {
        sessionId: session.id,
        productName,
        planTier,
        amount: unitAmount / 100,
        currency: 'USD',
        status: 'pending',
      }
    });

    return NextResponse.json({ clientSecret: session.client_secret, publicKey: stripePublicKey });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
