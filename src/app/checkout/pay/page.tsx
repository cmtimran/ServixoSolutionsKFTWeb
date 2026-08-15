'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * /checkout/pay — redirects to /checkout/simplepay-pay (SimplePay)
 * Kept for backwards compatibility with any existing links.
 */
function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/checkout/simplepay-pay?${searchParams.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-spin mb-4" />
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Redirecting to payment…</p>
    </div>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutPayPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20 transition-colors">
        <Suspense fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-500 dark:text-indigo-400 animate-spin" />
          </div>
        }>
          <RedirectContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
