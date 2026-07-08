import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // 1. Admin User
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

    // 2. Services
    const service1 = await prisma.service.upsert({
      where: { slug: 'cloud-migration' },
      update: {},
      create: {
        title: 'Cloud Migration',
        slug: 'cloud-migration',
        description: 'Seamless migration of your infrastructure to AWS, Azure, or GCP.',
        content: 'Our cloud migration services ensure zero downtime and maximum security...',
        category: 'Cloud',
        benefits: ['Zero Downtime', 'Cost Optimization', 'High Availability'],
      }
    });

    const service2 = await prisma.service.upsert({
      where: { slug: 'custom-software' },
      update: {},
      create: {
        title: 'Custom Software Development',
        slug: 'custom-software',
        description: 'Bespoke web and mobile applications tailored to your business needs.',
        content: 'We build scalable and robust applications using modern tech stacks...',
        category: 'Software',
        benefits: ['Scalable Architecture', 'Agile Delivery', 'Post-Launch Support'],
      }
    });

    // 3. Products
    const product1 = await prisma.product.upsert({
      where: { slug: 'starter-kit' },
      update: {},
      create: {
        title: 'Business Starter Kit',
        slug: 'starter-kit',
        description: 'Everything you need to get your business online.',
        priceBasic: 499,
        pricePro: 999,
        priceEnterprise: 2499,
        features: ['Custom Domain', 'Landing Page', 'Contact Form', 'Analytics Dashboard'],
        specifications: { 'Hosting': '1 Year Included', 'Support': 'Email Support' }
      }
    });

    const product2 = await prisma.product.upsert({
      where: { slug: 'enterprise-suite' },
      update: {},
      create: {
        title: 'Enterprise Management Suite',
        slug: 'enterprise-suite',
        description: 'A comprehensive ERP solution for large scale operations.',
        priceBasic: 4999,
        pricePro: 9999,
        priceEnterprise: 19999,
        features: ['HR Module', 'Finance Tracking', 'Asset Management', 'Custom Reporting'],
        specifications: { 'Deployment': 'Cloud or On-Premise', 'Support': '24/7 Dedicated' }
      }
    });

    // 4. Quotes (Since Quotes don't have unique non-ID fields naturally, we just count them and add if none exist)
    const quoteCount = await prisma.quote.count();
    if (quoteCount === 0) {
      await prisma.quote.createMany({
        data: [
          {
            clientName: 'Máté Kovács',
            clientEmail: 'mate@example.com',
            clientPhone: '+36301234567',
            companyName: 'Budapest FinTech',
            projectTypes: ['Cloud', 'Software'],
            budgetRange: '50k-100k',
            timeline: '3-6 months',
            projectDescription: 'We need to migrate our legacy monolith to microservices on AWS.',
            status: 'PENDING'
          },
          {
            clientName: 'Anna Szabó',
            clientEmail: 'anna@example.com',
            clientPhone: '+36201234567',
            companyName: 'GreenEnergy HU',
            projectTypes: ['Software'],
            budgetRange: '15k-50k',
            timeline: '1-3 months',
            projectDescription: 'Need an internal portal for tracking solar panel installations.',
            status: 'APPROVED'
          }
        ]
      });
    }

    // 5. Subscriptions
    const subCount = await prisma.subscription.count();
    if (subCount === 0) {
      await prisma.subscription.createMany({
        data: [
          { email: 'newsletter1@example.com' },
          { email: 'newsletter2@example.com' },
          { email: 'marketing_lead@example.com' },
        ]
      });
    }

    // 6. Reviews
    const reviewCount = await prisma.review.count();
    if (reviewCount === 0) {
      await prisma.review.createMany({
        data: [
          {
            clientName: 'David Miller',
            designation: 'CTO',
            company: 'Nexus B2B',
            rating: 5,
            title: 'Exceptional Service',
            reviewText: 'Servixo completely transformed our IT infrastructure. Highly recommended!',
            isApproved: true
          },
          {
            clientName: 'Sarah Jenkins',
            designation: 'Operations Director',
            company: 'Logistics Pro',
            rating: 4,
            title: 'Solid delivery',
            reviewText: 'Great communication and solid software delivery.',
            isApproved: false
          }
        ]
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database successfully seeded with User, Services, Products, Quotes, Subscriptions, and Reviews!'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to seed database', details: errorMessage }, { status: 500 });
  }
}
