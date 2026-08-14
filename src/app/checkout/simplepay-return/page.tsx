'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle, Loader2, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

type PaymentEvent = 'SUCCESS' | 'FAIL' | 'TIMEOUT' | 'CANCEL' | 'UNKNOWN';

interface ReturnData {
  orderRef: string;
  transactionId: string;
  e: PaymentEvent;
}

/**
 * SimplePay returns the user here after payment with a base64-encoded `r` param.
 * Example: /checkout/simplepay-return?r=<base64json>
 *
 * The `r` param decodes to: { orderRef, e (event), t (transactionId), m (merchant) }
 */
function parseReturnParam(r: string | null): ReturnData | null {
  if (!r) return null;
  try {
    // SimplePay may use URL-safe base64 (replace - with + and _ with /)
    const normalised = r.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalised));
    return {
      orderRef:      decoded.o ?? decoded.orderRef ?? 'N/A',
      transactionId: decoded.t ?? decoded.transactionId ?? 'N/A',
      e:             decoded.e ?? 'UNKNOWN',
    };
  } catch {
    return null;
  }
}

const EVENT_CONFIG: Record<PaymentEvent, {
  icon:  React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  bg:   string;
  border: string;
}> = {
  SUCCESS: {
    icon:     <CheckCircle2 className="w-12 h-12 text-emerald-400" />,
    title:    'Payment Successful!',
    subtitle: 'Your transaction has been completed. You will receive a confirmation email shortly.',
    color:    'text-emerald-400',
    bg:       'bg-emerald-500/10',
    border:   'border-emerald-500/30',
  },
  FAIL: {
    icon:     <XCircle className="w-12 h-12 text-red-400" />,
    title:    'Payment Failed',
    subtitle: 'Your transaction could not be processed. Please try again or use a different card.',
    color:    'text-red-400',
    bg:       'bg-red-500/10',
    border:   'border-red-500/30',
  },
  TIMEOUT: {
    icon:     <AlertCircle className="w-12 h-12 text-amber-400" />,
    title:    'Session Timed Out',
    subtitle: 'Your payment session expired. Please return to the store and try again.',
    color:    'text-amber-400',
    bg:       'bg-amber-500/10',
    border:   'border-amber-500/30',
  },
  CANCEL: {
    icon:     <AlertCircle className="w-12 h-12 text-slate-400" />,
    title:    'Payment Cancelled',
    subtitle: 'You cancelled the payment. No charge has been made.',
    color:    'text-slate-400',
    bg:       'bg-slate-700/30',
    border:   'border-slate-600/40',
  },
  UNKNOWN: {
    icon:     <AlertCircle className="w-12 h-12 text-slate-400" />,
    title:    'Unknown Status',
    subtitle: 'We could not determine the payment outcome. Please contact our support team.',
    color:    'text-slate-400',
    bg:       'bg-slate-700/30',
    border:   'border-slate-600/40',
  },
};

function ReturnContent() {
  const searchParams = useSearchParams();
  const [data, setData]     = useState<ReturnData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SimplePay sends the result as ?r=<base64>
    const r = searchParams.get('r');
    const parsed = parseReturnParam(r);
    setData(parsed);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const event = (data?.e ?? 'UNKNOWN') as PaymentEvent;
  const cfg   = EVENT_CONFIG[event] ?? EVENT_CONFIG.UNKNOWN;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className={`max-w-md w-full ${cfg.bg} border ${cfg.border} rounded-2xl p-8 text-center shadow-2xl`}>
        {/* Icon */}
        <div className={`w-20 h-20 ${cfg.bg} rounded-full flex items-center justify-center mx-auto mb-6 border ${cfg.border}`}>
          {cfg.icon}
        </div>

        <h1 className={`text-2xl font-bold ${cfg.color} mb-3`}>{cfg.title}</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{cfg.subtitle}</p>

        {/* Transaction details */}
        {data && (
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-6 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Order Ref</span>
              <span className="text-slate-300 truncate">{data.orderRef}</span>
            </div>
            {data.transactionId !== 'N/A' && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Transaction ID</span>
                <span className="text-slate-300 truncate">{data.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Status</span>
              <span className={`font-semibold ${cfg.color}`}>{event}</span>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {event === 'SUCCESS' ? (
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          ) : (
            <>
              <Link
                href="/products"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </Link>
              <Link
                href="/contact"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium"
              >
                Contact Support
              </Link>
            </>
          )}
        </div>

        {/* Powered by footer */}
        <p className="mt-6 text-slate-600 text-xs">
          Processed by SimplePay — OTP Mobil Kft.
        </p>
      </div>
    </div>
  );
}

export default function SimplePayReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        </div>
      }
    >
      <ReturnContent />
    </Suspense>
  );
}
