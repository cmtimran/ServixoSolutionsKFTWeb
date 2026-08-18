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
    const currency    = searchParams.get('currency') || 'USD';

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
      <div className="w-full flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-red-500/10 border border-slate-200 dark:border-red-500/30 rounded-2xl p-8 text-center shadow-lg dark:shadow-none">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Initialisation Failed</h2>
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-800 dark:text-red-300 font-mono text-sm break-all">{error}</p>
          </div>
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
    <div className="w-full flex flex-col items-center justify-center p-6 max-w-xl mx-auto">
      <div className="w-full text-center">
        {/* Animated logo / icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          <div className="relative w-24 h-24 bg-white dark:bg-indigo-600/30 rounded-full flex items-center justify-center border border-slate-200 dark:border-indigo-500/40 shadow-md dark:shadow-none">
            <ShieldCheck className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {status === 'preparing' ? 'Fizetés előkészítése… / Preparing Payment…' : 'Átirányítás a SimplePay oldalára… / Redirecting…'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          {status === 'preparing'
            ? 'Biztonságos kapcsolat létesítése az OTP Mobil SimplePay rendszerével.'
            : 'Pillanatokon belül átirányítjuk a SimplePay fizetési felületére.'}
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-500 text-xs font-medium mb-6">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500 dark:text-slate-500" />
          <span>Fizetési szolgáltató / Payment Provider: OTP Mobil Kft. (SimplePay)</span>
        </div>

        {/* Mandatory SimplePay Data Forwarding Statement (Adattovábbítási nyilatkozat) */}
        <div className="text-left bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <div className="font-semibold text-slate-900 dark:text-slate-200">
            Adattovábbítási nyilatkozat / Data Transfer Declaration:
          </div>
          <p>
            Tudomásul veszem, hogy a <strong>Servixo Solutions Kft.</strong> (1081 Budapest, Rákóczi út 63.) adatkezelő által a(z) servixosolutionskft.com felhasználói adatbázisában tárolt alábbi személyes adataim átadásra kerülnek az <strong>OTP Mobil Kft. (1143 Budapest, Hungária krt. 17-19.)</strong>, mint adatfeldolgozó részére.
          </p>
          <p className="text-[11px] text-slate-500">
            Az adatfeldolgozó által végzett adatfeldolgozási tevékenység jellege és célja a SimplePay Adatkezelési tájékoztatóban tekinthető meg:{' '}
            <a href="https://simplepay.hu/adatkezelesi-tajekoztato/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline">
              simplepay.hu/adatkezelesi-tajekoztato
            </a>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-4 text-slate-500 dark:text-slate-600 text-xs font-medium">
          <span className="flex items-center gap-1">🔒 256-bit SSL</span>
          <span>·</span>
          <span className="flex items-center gap-1">🛡️ 3D Secure</span>
          <span>·</span>
          <span className="flex items-center gap-1">🇭🇺 OTP Mobil SimplePay</span>
        </div>
      </div>
    </div>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SimplePayPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 transition-colors">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-spin" />
            </div>
          }
        >
          <SimplePayContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
