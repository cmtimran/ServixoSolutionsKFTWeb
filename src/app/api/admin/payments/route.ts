import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') || 'all';

    const statusWhere = statusParam === 'paid' 
      ? { in: ['complete', 'success', 'paid'] } 
      : statusParam === 'canceled' 
        ? { in: ['expired', 'canceled', 'cancelled'] } 
        : statusParam === 'declined' 
          ? { in: ['failed', 'declined', 'unpaid'] } 
          : undefined;

    const payments = await prisma.payment.findMany({
      where: statusWhere ? { status: statusWhere } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    console.error('[Admin Payments API] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
