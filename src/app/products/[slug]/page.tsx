import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { CheckCircle2, ArrowRight, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Product Not Found' };
  return { title: product.title, description: product.description };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const otherProducts = MOCK_PRODUCTS.filter((p) => p.slug !== slug);
  const PLANS = [
    { tier: 'Basic', price: product.priceBasic, features: ['Up to 5 users', 'Core features', 'Email support', '99.9% uptime SLA'] },
    { tier: 'Pro', price: product.pricePro, features: ['Up to 50 users', 'All features + API', 'Priority support', '99.95% uptime SLA'], featured: true },
    { tier: 'Enterprise', price: product.priceEnterprise, features: ['Unlimited users', 'Custom integrations', 'Dedicated manager', '99.99% uptime SLA'] },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20 animate-pulse-glow"
              style={{ background: 'radial-gradient(circle, var(--glow-indigo) 0%, transparent 70%)' }} />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
              <Link href="/" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Products</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)' }}>{product.title}</span>
            </div>
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-grow">
                <span className="badge mb-4 inline-block">Enterprise Software</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">{product.title}</h1>
                <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/quote" className="btn-primary">Request a Demo <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="#pricing" className="btn-outline">View Pricing</Link>
                </div>
              </div>
              {/* Price card */}
              <div className="w-full lg:w-64 flex-shrink-0 glass-card rounded-2xl p-6">
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Starting from</div>
                <div className="text-4xl font-extrabold text-gradient mb-0.5">${product.priceBasic}</div>
                <div className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>per month, billed annually</div>
                <CheckoutButton 
                  productName={product.title}
                  planTier="Basic"
                  price={product.priceBasic}
                  className="btn-primary w-full justify-center text-center block mb-3 style-override"
                >
                  Buy Now
                </CheckoutButton>
                <Link href="/contact" className="btn-outline w-full justify-center text-center block text-sm">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features & Specs */}
        <section className="py-20" style={{ background: 'var(--bg-surface)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Features */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <div className="space-y-4">
                  {product.features.map((f) => (
                    <div key={f} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-emerald)', opacity: 0.9 }}>
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm leading-relaxed pt-1" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <div
                      key={key}
                      className="flex items-start gap-4 px-5 py-4"
                      style={{
                        background: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-inset)',
                        borderBottom: idx < Object.entries(product.specifications).length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <span className="text-sm font-semibold flex-shrink-0 w-40" style={{ color: 'var(--text-muted)' }}>{key}</span>
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-muted)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <span className="badge mb-4 inline-block">Pricing Plans</span>
            <h2 className="text-3xl font-extrabold mb-4">Choose Your Plan</h2>
            <p className="text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>Pro plan includes a 14-day free trial. Credit card required.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {PLANS.map((plan) => (
                <div
                  key={plan.tier}
                  className={`rounded-2xl p-6 flex flex-col gap-5 ${plan.featured ? 'text-white relative' : 'glass-card'}`}
                  style={plan.featured ? { background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-indigo))', boxShadow: '0 12px 40px var(--glow-blue)' } : {}}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-900" /> Most Popular
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-extrabold">{plan.tier}</div>
                    <div className="text-3xl font-extrabold mt-2">${plan.price}<span className="text-sm font-normal opacity-70">/mo</span></div>
                  </div>
                  <div className="divider" style={plan.featured ? { background: 'rgba(255,255,255,0.15)' } : {}} />
                  <ul className="space-y-3 flex-grow">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: plan.featured ? '#bfdbfe' : 'var(--brand-emerald)' }} />
                        <span style={{ color: plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton
                    productName={product.title}
                    planTier={plan.tier}
                    price={plan.price}
                    featured={plan.featured}
                    className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${plan.featured ? 'bg-white hover:opacity-90' : 'btn-outline justify-center'}`}
                  >
                    {plan.tier === 'Pro' ? 'Start 14-Day Trial' : 'Buy Now'}
                  </CheckoutButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Products */}
        {otherProducts.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-surface)' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Explore Other Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="glass-card card-glow rounded-2xl p-6 flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-indigo))' }}>
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 group-hover:text-gradient transition-all">{p.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto flex-shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--brand-blue)' }} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
