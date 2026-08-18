import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Drop existing tables in case they were created with incorrect types (like TEXT for enums)
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User" CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Service" CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Product" CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "ContactMessage" CASCADE;`);
    
    // Create Enums
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create Tables with Correct Enum Types
    await prisma.$transaction([
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT,
          "role" "Role" NOT NULL DEFAULT 'USER',
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
          "currency" TEXT NOT NULL DEFAULT 'HUF',
          "images" TEXT[],
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'HUF';`),
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
      `),
      // Missing tables that were in schema.prisma:
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Quote" (
          "id" TEXT NOT NULL,
          "projectTypes" TEXT[],
          "budgetRange" TEXT NOT NULL,
          "timeline" TEXT NOT NULL,
          "projectDescription" TEXT NOT NULL,
          "attachmentUrl" TEXT,
          "clientName" TEXT NOT NULL,
          "clientEmail" TEXT NOT NULL,
          "clientPhone" TEXT NOT NULL,
          "companyName" TEXT,
          "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Review" (
          "id" TEXT NOT NULL,
          "clientName" TEXT NOT NULL,
          "designation" TEXT NOT NULL,
          "company" TEXT NOT NULL,
          "rating" INTEGER NOT NULL,
          "title" TEXT,
          "reviewText" TEXT NOT NULL,
          "logoUrl" TEXT,
          "imageUrl" TEXT,
          "isApproved" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Subscription" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_email_key" ON "Subscription"("email");
      `),
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Setting" (
          "key" TEXT NOT NULL,
          "value" TEXT NOT NULL,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
        );
      `),
      // Ensure Payment table exists and has all new columns
      prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Payment" (
          "id" TEXT NOT NULL,
          "sessionId" TEXT NOT NULL,
          "customerEmail" TEXT,
          "customerName" TEXT,
          "customerPhone" TEXT,
          "companyName" TEXT,
          "taxNumber" TEXT,
          "billingAddress" TEXT,
          "billingCity" TEXT,
          "billingZip" TEXT,
          "billingCountry" TEXT,
          "productName" TEXT NOT NULL,
          "planTier" TEXT NOT NULL,
          "amount" DOUBLE PRECISION NOT NULL,
          "currency" TEXT NOT NULL DEFAULT 'HUF',
          "status" TEXT NOT NULL DEFAULT 'pending',
          "deliveryStatus" TEXT NOT NULL DEFAULT 'pending',
          "deliveryNotes" TEXT,
          "simplePayOrderRef" TEXT,
          "simplePayTransId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
        );
      `),
      prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Payment_sessionId_key" ON "Payment"("sessionId");`),
      prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Payment_simplePayOrderRef_key" ON "Payment"("simplePayOrderRef");`),

      // Add missing columns to Payment if table already existed previously
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "customerPhone" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "companyName" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "taxNumber" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "billingAddress" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "billingCity" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "billingZip" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "billingCountry" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "deliveryStatus" TEXT NOT NULL DEFAULT 'pending';`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "deliveryNotes" TEXT;`),

      // Add missing columns to Quote
      prisma.$executeRawUnsafe(`ALTER TABLE "Quote" ADD COLUMN IF NOT EXISTS "adminNotes" TEXT;`),
      prisma.$executeRawUnsafe(`ALTER TABLE "Quote" ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT;`)
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Database tables and enums successfully created via manual SQL execution!'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to create tables', details: errorMessage }, { status: 500 });
  }
}
