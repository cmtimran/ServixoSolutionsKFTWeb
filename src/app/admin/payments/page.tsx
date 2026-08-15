import { prisma } from '@/lib/prisma';
import { CreditCard, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import SyncPaymentsButton from '@/components/admin/SyncPaymentsButton';

import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const currentFilter = params.status || 'paid';

  const statusWhere = currentFilter === 'paid' 
    ? { in: ['complete', 'success', 'paid'] } 
    : currentFilter === 'canceled' 
      ? { in: ['expired', 'canceled', 'cancelled'] } 
      : currentFilter === 'declined'
        ? { in: ['failed', 'declined', 'unpaid'] }
        : undefined;

  const payments = await prisma.payment.findMany({
    where: statusWhere ? { status: statusWhere } : undefined,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">View all customer checkout sessions and payments.</p>
        </div>
        <SyncPaymentsButton />
      </div>

      <div className="flex gap-4 mb-6">
        <Link 
          href="/admin/payments?status=all"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentFilter === 'all' ? 'bg-brand-indigo text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          All
        </Link>
        <Link 
          href="/admin/payments?status=paid"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentFilter === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          Paid
        </Link>
        <Link 
          href="/admin/payments?status=canceled"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentFilter === 'canceled' ? 'bg-rose-500/20 text-rose-400' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          Canceled
        </Link>
        <Link 
          href="/admin/payments?status=declined"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentFilter === 'declined' ? 'bg-amber-500/20 text-amber-400' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          Declined
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{payment.customerName || 'Unknown Name'}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{payment.customerEmail || 'No email provided'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{payment.productName}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 text-brand-indigo">{payment.planTier} Plan</div>
                    </td>
                    <td className="p-4 font-medium">
                      {payment.currency.toUpperCase() === 'USD' ? '$' : ''}{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {payment.currency.toUpperCase()}
                    </td>
                    <td className="p-4">
                      {payment.status === 'complete' || payment.status === 'success' || payment.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      ) : payment.status === 'open' || payment.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      ) : payment.status === 'failed' || payment.status === 'declined' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Declined
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-500 border border-slate-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Canceled
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 text-right">
                      {(payment.status === 'complete' || payment.status === 'success' || payment.status === 'paid') && (
                        <Link 
                          href={`/admin/payments/${payment.id}/invoice`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-brand-indigo hover:text-slate-900 dark:text-white text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Invoice
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
