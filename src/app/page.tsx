import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import ServicesGrid from '@/components/home/ServicesGrid';
import ProductsGrid from '@/components/home/ProductsGrid';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Servixo Solutions KFT | Premium IT Services & Product Suites',
  description: 'Enterprise IT solutions, bespoke software development, cloud migration, and cyber defense based in Budapest, Hungary.',
};

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [services, products] = await Promise.all([
    prisma.service.findMany({ take: 4 }),
    prisma.product.findMany({ take: 4 })
  ]);

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <ServicesGrid services={services} />
        <ProductsGrid products={products} />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
