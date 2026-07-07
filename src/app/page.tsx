import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import ServicesGrid from '@/components/home/ServicesGrid';
import ProductsGrid from '@/components/home/ProductsGrid';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Servixo Solutions KFT | Premium IT Services & Product Suites',
  description: 'Enterprise IT solutions, bespoke software development, cloud migration, and cyber defense based in Budapest, Hungary.',
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <ServicesGrid />
        <ProductsGrid />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
