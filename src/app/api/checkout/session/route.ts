import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/checkout/session
 * Replaced Stripe session lookup with SimplePay order status lookup from our DB.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderRef = searchParams.get('order_ref') || searchParams.get('session_id');

    if (!orderRef) {
      return NextResponse.json({ error: 'order_ref is required' }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { simplePayOrderRef: orderRef },
          { sessionId: orderRef },
        ],
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({
      status:         payment.status,
      orderRef:       payment.simplePayOrderRef,
      transactionId:  payment.simplePayTransId,
      customer_email: payment.customerEmail,
      amount:         payment.amount,
      currency:       payment.currency,
      productName:    payment.productName,
      planTier:       payment.planTier,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
