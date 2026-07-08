import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // We will manually execute CREATE TABLE statements because Vercel Serverless Functions 
    // do not always have the Prisma CLI or schema.prisma file bundled with them to run `prisma db push`.

    await prisma.$transaction([
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT,
          "role" TEXT NOT NULL DEFAULT 'USER',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
      `),
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Service" (
          "id" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "benefits" TEXT[],
          "technologies" TEXT[],
          "faqs" JSONB NOT NULL,
          "imageUrl" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "Service"("slug");
      `),
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Product" (
          "id" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "features" TEXT[],
          "specifications" JSONB NOT NULL,
          "priceBasic" DOUBLE PRECISION NOT NULL,
          "pricePro" DOUBLE PRECISION NOT NULL,
          "priceEnterprise" DOUBLE PRECISION NOT NULL,
          "images" TEXT[],
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");
      `),
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ContactMessage" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "subject" TEXT,
          "message" TEXT NOT NULL,
          "isRead" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
        );
      `)
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Database tables successfully created via manual SQL execution!'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to create tables', details: errorMessage }, { status: 500 });
  }
}
