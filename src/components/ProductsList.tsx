'use client';

import { useState } from 'react';
import { CheckCircle2, ArrowRight, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { Product } from '@prisma/client';

export default function ProductsList({ products }: { products: any[] }) {
  const [interval, setInterval] = useState<'month' | 'year'>('month');
  const [selectedTiers, setSelectedTiers] = useState<Record<string, 'Basic' | 'Pro' | 'Enterprise'>>({});

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

                  {/* Pricing tiers mini - Selectable */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { tier: 'Basic', price: product.priceBasic * multiplier },
                      { tier: 'Pro', price: product.pricePro * multiplier },
                      { tier: 'Enterprise', price: product.priceEnterprise * multiplier },
                    ].map(({ tier, price }) => {
                      const isSelected = (selectedTiers[product.id] || 'Basic') === tier;
                      return (
                        <button
                          key={tier}
                          onClick={() => setSelectedTiers({ ...selectedTiers, [product.id]: tier as any })}
                          className={`text-center p-3 rounded-xl transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[var(--brand-indigo)] text-white shadow-md border-transparent' 
                              : 'bg-[var(--bg-inset)] border-[var(--border)] hover:border-slate-500'
                          }`}
                          style={{ borderStyle: 'solid', borderWidth: '1px' }}
                        >
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-blue-200' : 'text-[var(--text-muted)]'}`}>{tier}</div>
                          <div className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-gradient'}`}>
                            {Math.round(price).toLocaleString('hu-HU')} Ft
                          </div>
                          <div className={`text-[9px] ${isSelected ? 'text-blue-200' : 'text-[var(--text-subtle)]'}`}>{intervalLabel}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <CheckoutButton
                      productName={product.title}
                      planTier={selectedTiers[product.id] || 'Basic'}
                      price={((selectedTiers[product.id] || 'Basic') === 'Basic' ? product.priceBasic : 
                           (selectedTiers[product.id] || 'Basic') === 'Pro' ? product.pricePro : 
                           product.priceEnterprise) * multiplier}
                      currency="HUF"
                      interval={interval}
                      className="btn-primary"
                    />
                    <Link href={`/products/${product.slug}`} className="btn-outline">
                      See Full Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


    </>
  );
}
