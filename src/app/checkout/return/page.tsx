'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutReturnPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
          setLoading(false);
        })
        .catch(() => {
          setStatus('error');
          setLoading(false);
        });
    } else {
      setStatus('error');
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-brand-indigo animate-spin mb-4" />
        <p className="text-slate-400">Verifying payment...</p>
      </div>
    );
  }

  if (status === 'open') {
    return (
      <div className="min-h-screen bg-slate-950 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <Loader2 className="w-16 h-16 text-yellow-500 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Payment Processing</h1>
          <p className="text-slate-400 mb-8">
            Your payment is still processing. We'll update you once it's complete.
          </p>
          <Link href="/client-portal" className="inline-block px-6 py-3 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-medium rounded-lg transition-colors">
            Go to Client Portal
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="min-h-screen bg-slate-950 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-slate-400 mb-8">
            Thank you for your purchase. {customerEmail ? `A confirmation email has been sent to ${customerEmail}.` : ''}
          </p>
          <div className="space-y-4">
            <Link href="/client-portal" className="flex items-center justify-center w-full px-6 py-3 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-medium rounded-lg transition-colors">
              Go to Client Portal
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/" className="inline-block text-slate-400 hover:text-white transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
        <p className="text-slate-400 mb-8">
          We couldn't verify your payment. If you believe this is an error, please contact support.
        </p>
        <Link href="/contact" className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
