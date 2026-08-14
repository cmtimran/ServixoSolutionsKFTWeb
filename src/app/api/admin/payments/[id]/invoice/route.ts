import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/payments/[id]/invoice
 * Returns SimplePay payment details for a given payment ID.
 * (Stripe invoice redirect replaced — SimplePay does not host invoices via API)
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const payment = await prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 });
    }

    // Return payment details as JSON (no hosted invoice URL with SimplePay)
    return NextResponse.json({
      id:              payment.id,
      orderRef:        payment.simplePayOrderRef,
      transactionId:   payment.simplePayTransId,
      productName:     payment.productName,
      planTier:        payment.planTier,
      amount:          payment.amount,
      currency:        payment.currency,
      status:          payment.status,
      customerEmail:   payment.customerEmail,
      createdAt:       payment.createdAt,
    });
  } catch (err: any) {
    console.error('Error retrieving payment:', err);
    return new NextResponse(err.message, { status: 500 });
  }
}
