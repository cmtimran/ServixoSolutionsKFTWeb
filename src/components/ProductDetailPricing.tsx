'use client';

import { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import CheckoutButton from '@/components/CheckoutButton';
import { Product } from '@prisma/client';

export default function ProductDetailPricing({ product }: { product: any }) {
  const [interval, setInterval] = useState<'month' | 'year'>('month');
  const multiplier = interval === 'year' ? 12 : 1;
  const intervalLabel = interval === 'year' ? '/year' : '/mo';

  const PLANS = [
    { tier: 'Basic', price: product.priceBasic * multiplier, features: ['Up to 5 users', 'Core features', 'Email support', '99.9% uptime SLA'] },
    { tier: 'Pro', price: product.pricePro * multiplier, features: ['Up to 50 users', 'All features + API', 'Priority support', '99.95% uptime SLA'], featured: true },
    { tier: 'Enterprise', price: product.priceEnterprise * multiplier, features: ['Unlimited users', 'Custom integrations', 'Dedicated manager', '99.99% uptime SLA'] },
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-muted)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <span className="badge mb-4 inline-block">Pricing Plans</span>
        <h2 className="text-3xl font-extrabold mb-4">Choose Your Plan</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>Pro plan includes a 14-day free trial. Credit card required.</p>
        
        <div className="flex justify-center mb-12 relative z-10">
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
                <div className="text-3xl font-extrabold mt-2">
                  {product.currency === 'HUF' ? `${plan.price} Ft` : product.currency === 'EUR' ? `€${plan.price}` : `$${plan.price}`}
                  <span className="text-sm font-normal opacity-70">{intervalLabel}</span>
                </div>
              </div>
              <div className="divider" style={plan.featured ? { background: 'rgba(255,255,255,0.15)' } : {}} />
              <ul className="space-y-3 flex-grow">
                {plan.features.map((f: string) => (
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
                currency={product.currency || 'USD'}
                interval={interval}
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
  );
}
