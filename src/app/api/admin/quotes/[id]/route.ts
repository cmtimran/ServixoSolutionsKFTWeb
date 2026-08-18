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

    const { status, adminNotes } = await request.json();

    const dataToUpdate: any = {};
    if (status) {
      if (!['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      dataToUpdate.status = status;
    }
    if (adminNotes !== undefined) {
      dataToUpdate.adminNotes = adminNotes;
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, data: updatedQuote });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.quote.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Quote deleted' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
