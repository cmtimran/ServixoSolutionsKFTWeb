'use client';

import { useState } from 'react';
import { CheckCircle2, ArrowRight, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { Product } from '@prisma/client';

export default function ProductsList({ products }: { products: any[] }) {
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  // Multiplier for pricing
  const multiplier = interval === 'year' ? 12 : 1;
  const intervalLabel = interval === 'year' ? '/year' : '/month';

  // For the pricing table, we'll feature the first product's tiers if available, or a specific SaaS product.
  const saasProduct = products.find(p => p.slug === 'saas-subscription') || products[0];

  return (
    <>
      <div className="flex justify-center mb-10 relative z-10">
        <div className="bg-[var(--bg-inset)] border border-[var(--border)] rounded-full p-1 flex items-center">
          <button 
            onClick={() => setInterval('month')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${interval === 'month' ? 'bg-[var(--brand-indigo)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setInterval('year')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${interval === 'year' ? 'bg-[var(--brand-indigo)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            Yearly <span className="text-xs text-[var(--brand-emerald)] ml-1">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-6xl mx-auto space-y-16">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
            >
              {/* Image / Visual Panel */}
              <div className={`${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  {/* Decorative dashboard mockup */}
                  <div className="absolute inset-0 p-6">
                    <div className="w-full h-full rounded-xl overflow-hidden flex flex-col gap-3" style={{ background: 'var(--bg-inset)' }}>
                      {/* Top bar */}
                      <div className="flex items-center gap-2 px-4 pt-3">
                        {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => (
                          <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                        ))}
                        <div className="ml-4 h-4 rounded" style={{ width: '40%', background: 'var(--border-strong)' }} />
                      </div>
                      {/* Content rows */}
                      <div className="px-4 pb-3 grid grid-cols-3 gap-2 flex-grow">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', height: i < 3 ? '60px' : '80px' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Product label overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-indigo))' }}>
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{product.title}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Live Dashboard Preview</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="space-y-6">
                  <span className="badge">Product</span>
                  <h2 className="text-3xl font-extrabold">{product.title}</h2>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>

                  {/* Features */}
                  <div className="space-y-3">
                    {product.features.map((f: string) => (
                      <div key={f} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-emerald)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing tiers mini */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { tier: 'Basic', price: product.priceBasic * multiplier },
                      { tier: 'Pro', price: product.pricePro * multiplier },
                      { tier: 'Enterprise', price: product.priceEnterprise * multiplier },
                    ].map(({ tier, price }) => (
                      <div key={tier} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)' }}>
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{tier}</div>
                        <div className="text-lg font-extrabold text-gradient">${price}</div>
                        <div className="text-[9px]" style={{ color: 'var(--text-subtle)' }}>{intervalLabel}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link href={`/products/${product.slug}`} className="btn-primary">
                      See Full Details <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/quote" className="btn-outline">Request Demo</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specs comparison */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="badge mb-4 inline-block">Transparent Pricing</span>
          <h2 className="text-3xl font-extrabold mb-4">Simple, Scalable Plans</h2>
          <p className="text-lg mb-14" style={{ color: 'var(--text-secondary)' }}>
            All plans include dedicated onboarding support and API access. Pro plan includes a 14-day free trial (credit card required).
          </p>
          
          {saasProduct && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { tier: 'Basic', desc: 'For startups and small teams.', price: saasProduct.priceBasic * multiplier, features: ['Up to 5 users', 'Core modules', 'Email support', '99.9% SLA'] },
                { tier: 'Pro', desc: 'For growing businesses.', price: saasProduct.pricePro * multiplier, features: ['Up to 50 users', 'All modules + API', 'Priority support', '99.95% SLA'], featured: true },
                { tier: 'Enterprise', desc: 'For large corporations.', price: saasProduct.priceEnterprise * multiplier, features: ['Unlimited users', 'Custom integrations', 'Dedicated success manager', '99.99% SLA'] },
              ].map((plan) => (
                <div
                  key={plan.tier}
                  className={`rounded-2xl p-6 flex flex-col gap-4 text-left ${plan.featured ? 'text-white' : 'glass-card'}`}
                  style={plan.featured ? { background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-indigo))', boxShadow: '0 8px 32px var(--glow-blue)' } : {}}
                >
                  {plan.featured && (
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-300 mb-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-300" /> Most Popular
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-extrabold">{plan.tier}</div>
                    <div className="text-sm mt-1" style={{ color: plan.featured ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{plan.desc}</div>
                  </div>
                  <div className="text-3xl font-extrabold flex items-end gap-1">
                    ${plan.price} <span className="text-sm font-normal pb-1" style={{ color: plan.featured ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{intervalLabel}</span>
                  </div>
                  <div className="divider" />
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.featured ? 'text-blue-200' : ''}`} style={!plan.featured ? { color: 'var(--brand-emerald)' } : {}} />
                        <span style={{ color: plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton
                    productName={saasProduct.title}
                    planTier={plan.tier}
                    price={plan.price}
                    interval={interval}
                    featured={plan.featured}
                    className={`block w-full text-center py-3 rounded-xl text-sm font-bold mt-auto transition-all ${plan.featured ? 'bg-white hover:opacity-90' : 'btn-outline text-center justify-center'}`}
                  >
                    {plan.tier === 'Pro' ? 'Start 14-Day Trial' : 'Buy Now'}
                  </CheckoutButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
