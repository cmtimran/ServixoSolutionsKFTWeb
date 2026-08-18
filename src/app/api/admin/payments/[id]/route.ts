import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deliveryStatus, deliveryNotes } = await request.json();

    const dataToUpdate: any = {};
    if (deliveryStatus) {
      if (!['pending', 'in_progress', 'delivered'].includes(deliveryStatus)) {
        return NextResponse.json({ error: 'Invalid delivery status' }, { status: 400 });
      }
      dataToUpdate.deliveryStatus = deliveryStatus;
    }
    if (deliveryNotes !== undefined) {
      dataToUpdate.deliveryNotes = deliveryNotes;
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, data: updatedPayment });
  } catch (error: any) {
    console.error('Error updating payment delivery status:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}