import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'admin@servixo.com' },
      update: {},
      create: {
        email: 'admin@servixo.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin user successfully created in the Vercel Database!',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to seed database', details: errorMessage }, { status: 500 });
  }
}
