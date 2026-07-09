import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 });
    }

    const secretKeySetting = await prisma.setting.findUnique({ where: { key: 'stripeSecretKey' } });
    const stripeSecretKey = secretKeySetting?.value || process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return new NextResponse('Stripe not configured', { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-06-24.dahlia' as any,
    });

    const session = await stripe.checkout.sessions.retrieve(payment.sessionId, {
      expand: ['invoice']
    });

    const invoiceUrl = (session.invoice as Stripe.Invoice)?.hosted_invoice_url;

    if (invoiceUrl) {
      return NextResponse.redirect(invoiceUrl);
    } else {
      return new NextResponse('Invoice not generated yet or not available for this session.', { status: 404 });
    }
  } catch (err: any) {
    console.error('Error retrieving invoice:', err);
    return new NextResponse(err.message, { status: 500 });
  }
}
