'use client';

import { useState } from 'react';
import { Download, Trash2, Mail, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: 'sub1', email: 'director@budapestfintech.hu', createdAt: '2026-07-06 09:12' },
  { id: 'sub2', email: 'admin@greenenergy.hu', createdAt: '2026-07-05 16:34' },
  { id: 'sub3', email: 'secops@nexusb2b.com', createdAt: '2026-07-04 11:23' },
  { id: 'sub4', email: 'kovacs.l@innovations.hu', createdAt: '2026-07-03 15:45' },
];

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [showExportToast, setShowExportToast] = useState(false);

  const handleDelete = (id: string) => {
    setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = 'ID,Email,SubscribedAt\n';
    const rows = subscribers.map((sub) => `${sub.id},${sub.email},${sub.createdAt}`).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    
    // Trigger download
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `servixo_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show feedback toast
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Newsletter Subscribers</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage and export all subscriber emails collected from the public website newsletter components.</p>
        </div>
        
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4 sm:p-5">Subscriber Email</th>
              <th className="p-4 sm:p-5">Subscription Date</th>
              <th className="p-4 sm:p-5 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-100 text-sm">{sub.email}</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400 font-medium">{sub.createdAt}</td>
                <td className="p-4 sm:p-5 text-right">
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-450 hover:bg-rose-600 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
                    title="Remove Subscriber"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-slate-500 dark:text-slate-500">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Export feedback toast */}
      <AnimatePresence>
        {showExportToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-4 rounded-xl bg-emerald-500 text-slate-900 dark:text-white shadow-xl text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>CSV exported successfully! Check downloads.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
