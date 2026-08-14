import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/payments/sync
 * Replaced Stripe sync with a SimplePay status check from our DB.
 * (SimplePay updates status via IPN — this endpoint just returns current DB state.)
 */
export async function POST() {
  try {
    const pendingPayments = await prisma.payment.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      message: 'SimplePay payments are updated in real-time via IPN webhook.',
      pendingCount: pendingPayments.length,
      pendingPayments: pendingPayments.map(p => ({
        id:        p.id,
        orderRef:  p.simplePayOrderRef,
        product:   p.productName,
        plan:      p.planTier,
        amount:    p.amount,
        currency:  p.currency,
        createdAt: p.createdAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
