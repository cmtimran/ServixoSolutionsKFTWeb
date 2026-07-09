'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MockCheckout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing delay
    setTimeout(() => {
      router.push(`/checkout/success?session_id=mock_session_${Date.now()}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          <div className="glass-card rounded-3xl p-8 space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--brand-indigo)] rounded-full flex items-center justify-center mx-auto mb-4 bg-opacity-20">
                <CreditCard className="w-8 h-8 text-[var(--brand-indigo)]" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Secure Checkout</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                This is a simulated payment page. No real money will be charged.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--text-secondary)]">Name on Card</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-[var(--bg-inset)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--brand-indigo)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--text-secondary)]">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-[var(--bg-inset)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--brand-indigo)] transition-colors"
                  />
                  <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--text-secondary)]">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-[var(--bg-inset)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--brand-indigo)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--text-secondary)]">CVC</label>
                  <input 
                    type="text" 
                    required
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-[var(--bg-inset)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--brand-indigo)] transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
