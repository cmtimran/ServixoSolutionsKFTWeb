import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';
import ProductsList from '@/components/ProductsList';

export const metadata: Metadata = {
  title: 'Software Products',
  description: 'Explore Servixo\'s enterprise software products — Servixo CoreERP and GuardX Cyber Sentinel. Scalable, secure, and built for modern businesses.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const dbProducts = await prisma.product.findMany();
  const products = dbProducts.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <>
      <Header />
      <main>
        <PageHero
          badge="Our Products"
          title="Enterprise Software"
          titleHighlight="Products"
          description="Purpose-built SaaS products designed for the enterprise. From intelligent ERP systems to AI-powered cybersecurity agents."
          cta={{ label: 'Request a Demo', href: '/quote' }}
          ctaSecondary={{ label: 'View Pricing', href: '#pricing' }}
        />

        <ProductsList products={products} />
      </main>
      <Footer />
    </>
  );
}
