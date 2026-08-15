'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';

function SimplePayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'preparing' | 'redirecting' | 'error'>('preparing');

  useEffect(() => {
    const productName = searchParams.get('productName');
    const planTier    = searchParams.get('planTier');
    const price       = searchParams.get('price');

    if (!productName || !price) {
      setError('Missing product information.');
      setStatus('error');
      return;
    }

    setStatus('preparing');

    fetch('/api/simplepay/start', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ productName, planTier, price, currency: 'HUF' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStatus('error');
        } else if (data.paymentUrl) {
          setStatus('redirecting');
          // Hard redirect to SimplePay's hosted payment page
          window.location.href = data.paymentUrl;
        } else {
          setError('No payment URL returned from SimplePay.');
          setStatus('error');
        }
      })
      .catch((err) => {
        setError(err.message || 'An unexpected error occurred.');
        setStatus('error');
      });
  }, [searchParams]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-red-500/10 border border-slate-200 dark:border-red-500/30 rounded-2xl p-8 text-center shadow-lg dark:shadow-none">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Initialisation Failed</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg transition-colors text-sm font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors">
      <div className="max-w-md w-full text-center">
        {/* Animated logo / icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          <div className="relative w-24 h-24 bg-white dark:bg-indigo-600/30 rounded-full flex items-center justify-center border border-slate-200 dark:border-indigo-500/40 shadow-md dark:shadow-none">
            <ShieldCheck className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {status === 'preparing' ? 'Preparing Your Payment…' : 'Redirecting to SimplePay…'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
          {status === 'preparing'
            ? 'Securely initialising your transaction with SimplePay.'
            : 'You will be redirected to SimplePay\'s secure payment page momentarily.'}
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-500 text-xs font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500 dark:text-slate-500" />
          <span>Powered by SimplePay (OTP Mobil)</span>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex items-center justify-center gap-4 text-slate-500 dark:text-slate-600 text-xs font-medium">
          <span className="flex items-center gap-1">🔒 256-bit SSL</span>
          <span>·</span>
          <span className="flex items-center gap-1">🛡️ 3D Secure</span>
          <span>·</span>
          <span className="flex items-center gap-1">🇭🇺 OTP Mobil</span>
        </div>
      </div>
    </div>
  );
}

export default function SimplePayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
          <Loader2 className="w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-spin" />
        </div>
      }
    >
      <SimplePayContent />
    </Suspense>
  );
}
