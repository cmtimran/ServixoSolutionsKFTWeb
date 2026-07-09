'use client';

'use client';

import { useState, useEffect, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CheckoutPayContent() {
  const searchParams = useSearchParams();
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productName = searchParams.get('productName');
    const planTier = searchParams.get('planTier');
    const price = searchParams.get('price');
    const interval = searchParams.get('interval') || 'month';

    if (!productName || !price) {
      setError('Missing product information.');
      return;
    }

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, planTier, price, interval }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.clientSecret && data.publicKey) {
          setStripePromise(loadStripe(data.publicKey));
          setClientSecret(data.clientSecret);
        } else {
          setError('Failed to initialize checkout.');
        }
      })
      .catch((err) => {
        setError(err.message || 'An error occurred.');
      });
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 text-red-400 p-6 rounded-xl border border-red-500/20 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Checkout Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8 shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Complete Your Purchase
          </h1>
          
          {stripePromise && clientSecret ? (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout className="w-full" />
            </EmbeddedCheckoutProvider>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Preparing checkout...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-brand-indigo animate-spin mb-4" />
        <p className="text-slate-400">Loading checkout...</p>
      </div>
    }>
      <CheckoutPayContent />
    </Suspense>
  );
}
