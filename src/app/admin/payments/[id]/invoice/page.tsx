import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from '@/app/checkout/simplepay-return/PrintButton';

export default async function AdminInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payment = await prisma.payment.findUnique({ where: { id } });

  if (!payment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 print:p-0 print:bg-white flex justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white print:text-black">Servixo Solutions Kft.</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Payment Receipt / Invoice</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm text-slate-500">Receipt #{payment.id.split('-')[0].toUpperCase()}</div>
            <div className="text-sm text-slate-500 mt-1">{new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {/* Customer & Order Details */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</h3>
            <div className="text-slate-900 dark:text-slate-200 font-medium">{payment.customerName || 'Customer'}</div>
            <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">{payment.customerEmail || 'No email provided'}</div>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Info</h3>
            <div className="text-slate-900 dark:text-slate-200 text-sm"><span className="font-medium">Gateway:</span> SimplePay</div>
            <div className="text-slate-900 dark:text-slate-200 text-sm mt-1 truncate"><span className="font-medium">Order Ref:</span> {payment.simplePayOrderRef || 'N/A'}</div>
            {payment.simplePayTransId && (
              <div className="text-slate-900 dark:text-slate-200 text-sm mt-1"><span className="font-medium">Transaction ID:</span> {payment.simplePayTransId}</div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 text-sm font-semibold text-slate-900 dark:text-slate-200">Description</th>
                <th className="py-3 text-sm font-semibold text-slate-900 dark:text-slate-200 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-4">
                  <div className="font-medium text-slate-900 dark:text-slate-200">{payment.productName}</div>
                  <div className="text-sm text-slate-500 mt-1">{payment.planTier} Plan Subscription</div>
                </td>
                <td className="py-4 text-right text-slate-900 dark:text-slate-200 font-medium">
                  {payment.currency === 'USD' ? '$' : ''}{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {payment.currency.toUpperCase()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-3 border-t-2 border-slate-900 dark:border-slate-700 font-bold text-lg">
              <span className="text-slate-900 dark:text-slate-200">Total Paid</span>
              <span className="text-brand-indigo dark:text-indigo-400">
                {payment.currency === 'USD' ? '$' : ''}{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {payment.currency.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-12 flex justify-between items-center text-sm text-slate-500">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-300">Servixo Solutions Kft.</p>
            <p>Rákóczi út 63, Budapest 1081, Hungary</p>
          </div>
          <div className="text-right">
            <p>servixokft@gmail.com</p>
            <p>+36 20 281 1466</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-12 flex justify-center print:hidden">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
