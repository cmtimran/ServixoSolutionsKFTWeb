import { prisma } from '@/lib/prisma';
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-slate-400 mt-2">View all customer checkout sessions and payments.</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 text-sm">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{payment.customerName || 'Unknown Name'}</div>
                      <div className="text-xs text-slate-400">{payment.customerEmail || 'No email provided'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{payment.productName}</div>
                      <div className="text-xs text-slate-400 text-brand-indigo">{payment.planTier} Plan</div>
                    </td>
                    <td className="p-4 font-medium">
                      ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                    </td>
                    <td className="p-4">
                      {payment.status === 'complete' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      ) : payment.status === 'open' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          {payment.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
