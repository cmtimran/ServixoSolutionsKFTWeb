import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get real counts from DB
    const totalProducts = await prisma.product.count();
    const totalServices = await prisma.service.count();
    const totalUsers = await prisma.user.count();
    const unreadQueries = await prisma.contactMessage.count({
      where: { isRead: false }
    });

    // Get 5 most recent contact messages
    const recentQueries = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        subject: true,
        isRead: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          totalProducts,
          totalServices,
          totalUsers,
          unreadQueries,
        },
        recentQueries
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
