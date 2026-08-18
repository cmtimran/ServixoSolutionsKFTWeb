'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle, FileText, Loader2, RefreshCw } from 'lucide-react';
import SyncPaymentsButton from '@/components/admin/SyncPaymentsButton';
import Link from 'next/link';

type PaymentRecord = {
  id: string;
  sessionId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  companyName: string | null;
  taxNumber: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingZip: string | null;
  billingCountry: string | null;
  productName: string;
  planTier: string;
  amount: number;
  currency: string;
  status: string;
  deliveryStatus?: string;
  deliveryNotes?: string | null;
  simplePayOrderRef: string | null;
  simplePayTransId: string | null;
  createdAt: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'paid' | 'canceled' | 'declined'>('paid');
  const [error, setError] = useState<string | null>(null);

  // Delivery Modal State
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [modalDeliveryStatus, setModalDeliveryStatus] = useState<string>('pending');
  const [modalDeliveryNotes, setModalDeliveryNotes] = useState<string>('');
  const [savingDelivery, setSavingDelivery] = useState<boolean>(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/payments?status=${currentFilter}`);
      const json = await res.json();
      if (json.success) {
        setPayments(json.data);
      } else {
        setError(json.error || 'Failed to load payments');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentFilter]);

  const openDeliveryModal = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setModalDeliveryStatus(payment.deliveryStatus || 'pending');
    setModalDeliveryNotes(payment.deliveryNotes || '');
  };

  const handleSaveDelivery = async () => {
    if (!selectedPayment) return;
    setSavingDelivery(true);
    try {
      const res = await fetch(`/api/admin/payments/${selectedPayment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryStatus: modalDeliveryStatus,
          deliveryNotes: modalDeliveryNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === selectedPayment.id
              ? { ...p, deliveryStatus: modalDeliveryStatus, deliveryNotes: modalDeliveryNotes }
              : p
          )
        );
        setSelectedPayment(null);
      } else {
        alert(json.error || 'Failed to update delivery status');
      }
    } catch (err: any) {
      alert(err.message || 'Network error updating delivery status');
    } finally {
      setSavingDelivery(false);
    }
  };

  const getDeliveryBadge = (delStatus?: string) => {
    switch (delStatus) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ✓ Delivered
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            ⏳ Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            ⏱ Needs Action
          </span>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order & Delivery Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track customer payments, issue credentials, and manage service delivery.
          </p>
        </div>
        <SyncPaymentsButton />
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          type="button"
          onClick={() => setCurrentFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          All
        </button>
        <button 
          type="button"
          onClick={() => setCurrentFilter('paid')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentFilter === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          Paid
        </button>
        <button 
          type="button"
          onClick={() => setCurrentFilter('canceled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentFilter === 'canceled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          Canceled
        </button>
        <button 
          type="button"
          onClick={() => setCurrentFilter('declined')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentFilter === 'declined' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800'}`}
        >
          Declined
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Delivery Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-500">
                    No orders or payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">
                        {payment.customerName || 'Unknown Customer'}
                        {payment.companyName && (
                          <span className="ml-2 text-xs font-normal text-slate-500">({payment.companyName})</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        <a href={`mailto:${payment.customerEmail}`} className="hover:underline text-indigo-500">
                          {payment.customerEmail || 'No email'}
                        </a>
                        {payment.customerPhone ? ` · ${payment.customerPhone}` : ''}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{payment.productName}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 text-brand-indigo">{payment.planTier} Plan</div>
                    </td>
                    <td className="p-4 font-medium">
                      {Math.round(payment.amount).toLocaleString('hu-HU')} {payment.currency.toUpperCase() === 'HUF' ? 'Ft' : payment.currency.toUpperCase()}
                    </td>
                    <td className="p-4">
                      {payment.status === 'complete' || payment.status === 'success' || payment.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : payment.status === 'open' || payment.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3 h-3" />
                          {payment.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {getDeliveryBadge(payment.deliveryStatus)}
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openDeliveryModal(payment)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        🚚 Delivery / Deliver
                      </button>
                      {(payment.status === 'complete' || payment.status === 'success' || payment.status === 'paid') && (
                        <Link 
                          href={`/admin/payments/${payment.id}/invoice`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
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

      {/* Delivery Management Drawer / Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Deliver Service & Access</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedPayment.productName} ({selectedPayment.planTier})
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Client summary */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Client Name:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedPayment.customerName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Client Email:</span>
                <a href={`mailto:${selectedPayment.customerEmail}`} className="font-semibold text-indigo-500 hover:underline">
                  {selectedPayment.customerEmail || 'N/A'}
                </a>
              </div>
              {selectedPayment.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedPayment.customerPhone}</span>
                </div>
              )}
              {selectedPayment.billingAddress && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Address:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 text-right">
                    {selectedPayment.billingAddress}, {selectedPayment.billingCity}
                  </span>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Delivery Status
                </label>
                <select
                  value={modalDeliveryStatus}
                  onChange={(e) => setModalDeliveryStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="pending">⏱ Pending (Needs Action)</option>
                  <option value="in_progress">⏳ In Progress (Preparing access/repository)</option>
                  <option value="delivered">✓ Delivered (License / Access sent to client)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Delivery Notes / Credentials / License Key
                </label>
                <textarea
                  rows={4}
                  value={modalDeliveryNotes}
                  onChange={(e) => setModalDeliveryNotes(e.target.value)}
                  placeholder="Enter license key, repository URL, dashboard login credentials, or client onboarding notes..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingDelivery}
                onClick={handleSaveDelivery}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {savingDelivery ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Delivery Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
