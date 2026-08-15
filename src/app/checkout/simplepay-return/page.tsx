import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, Home, FileText } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PrintButton from './PrintButton';

type PaymentEvent = 'SUCCESS' | 'FAIL' | 'TIMEOUT' | 'CANCEL' | 'UNKNOWN';

interface ReturnData {
  orderRef: string;
  transactionId: string;
  e: PaymentEvent;
}

function parseReturnParam(r: string | null): ReturnData | null {
  if (!r) return null;
  try {
    const normalised = r.replace(/-/g, '+').replace(/_/g, '/');
    const decodedStr = Buffer.from(normalised, 'base64').toString('utf8');
    const decoded = JSON.parse(decodedStr);
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
    color:    'text-emerald-500 dark:text-emerald-400',
    bg:       'bg-emerald-500/10',
    border:   'border-emerald-500/30',
  },
  FAIL: {
    icon:     <XCircle className="w-12 h-12 text-red-400" />,
    title:    'Payment Failed',
    subtitle: 'Your transaction could not be processed. Please try again or use a different card.',
    color:    'text-red-500 dark:text-red-400',
    bg:       'bg-red-500/10',
    border:   'border-red-500/30',
  },
  TIMEOUT: {
    icon:     <AlertCircle className="w-12 h-12 text-amber-400" />,
    title:    'Session Timed Out',
    subtitle: 'Your payment session expired. Please return to the store and try again.',
    color:    'text-amber-500 dark:text-amber-400',
    bg:       'bg-amber-500/10',
    border:   'border-amber-500/30',
  },
  CANCEL: {
    icon:     <AlertCircle className="w-12 h-12 text-slate-400" />,
    title:    'Payment Cancelled',
    subtitle: 'You cancelled the payment. No charge has been made.',
    color:    'text-slate-500 dark:text-slate-400',
    bg:       'bg-slate-700/30',
    border:   'border-slate-600/40',
  },
  UNKNOWN: {
    icon:     <AlertCircle className="w-12 h-12 text-slate-400" />,
    title:    'Unknown Status',
    subtitle: 'We could not determine the payment outcome. Please contact our support team.',
    color:    'text-slate-500 dark:text-slate-400',
    bg:       'bg-slate-700/30',
    border:   'border-slate-600/40',
  },
};

export default async function SimplePayReturnPage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const { r } = await searchParams;
  const data = parseReturnParam(r || null);
  
  let paymentRecord = null;
  if (data && data.orderRef && data.orderRef !== 'N/A') {
    paymentRecord = await prisma.payment.findUnique({
      where: { simplePayOrderRef: data.orderRef }
    });
  }

  const event = (data?.e ?? 'UNKNOWN') as PaymentEvent;
  const cfg   = EVENT_CONFIG[event] ?? EVENT_CONFIG.UNKNOWN;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 print:p-0 print:bg-white transition-colors">
      <div className={`max-w-md w-full bg-white dark:bg-slate-900 ${cfg.bg} border border-slate-200 dark:border-transparent dark:${cfg.border} rounded-2xl p-8 text-center shadow-lg dark:shadow-2xl print:shadow-none print:border-none print:bg-white transition-all`}>
        {/* Header / Invoice Title (Visible more clearly on print) */}
        <div className="hidden print:block text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Servixo Solutions Kft.</h1>
          <p className="text-slate-500 mt-1">Payment Receipt</p>
        </div>

        {/* Icon */}
        <div className={`w-20 h-20 ${cfg.bg} rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-transparent dark:${cfg.border} print:hidden`}>
          {cfg.icon}
        </div>

        <h1 className={`text-2xl font-bold ${cfg.color} mb-3`}>{cfg.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium print:hidden">{cfg.subtitle}</p>

        {/* Transaction & Order details */}
        {(data || paymentRecord) && (
          <div className="bg-slate-50 dark:bg-slate-900/60 print:bg-white border border-slate-200 dark:border-slate-700/50 print:border-slate-300 rounded-xl p-4 mb-6 text-left space-y-3 text-sm">
            
            {/* Extended DB Details if available */}
            {paymentRecord && (
              <>
                <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-700/50 print:border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">Customer</span>
                  <span className="text-slate-900 dark:text-slate-200 text-right">
                    {paymentRecord.customerName || 'N/A'}<br/>
                    <span className="text-xs text-slate-500">{paymentRecord.customerEmail}</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-700/50 print:border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">Product</span>
                  <span className="text-slate-900 dark:text-slate-200 text-right">
                    {paymentRecord.productName}<br/>
                    <span className="text-xs text-brand-indigo">{paymentRecord.planTier} Plan</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-700/50 print:border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">Amount Paid</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">
                    {paymentRecord.currency === 'USD' ? '$' : ''}{paymentRecord.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {paymentRecord.currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-700/50 print:border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">Date</span>
                  <span className="text-slate-900 dark:text-slate-200">
                    {new Date(paymentRecord.createdAt).toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {/* Base SimplePay Return Details */}
            {data && (
              <>
                <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-700/50 print:border-slate-200 pb-2">
                  <span className="text-slate-500 font-semibold">Order Ref</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-xs">{data.orderRef}</span>
                </div>
                {data.transactionId !== 'N/A' && (
                  <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-700/50 print:border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Transaction ID</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono text-xs">{data.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 font-semibold">Gateway Status</span>
                  <span className={`font-bold ${cfg.color}`}>{event}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          {event === 'SUCCESS' ? (
            <>
              <Link
                href="/"
                className="flex-[2] flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
              <PrintButton />
            </>
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
        <p className="mt-6 text-slate-500 dark:text-slate-600 text-xs font-medium print:mt-12">
          Processed by SimplePay — OTP Mobil Kft.<br className="hidden print:block" />
          <span className="hidden print:block mt-1">Thank you for your business!</span>
        </p>
      </div>
    </div>
  );
}
