'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, Mail } from 'lucide-react';

type Subscription = {
  id: string;
  email: string;
  createdAt: string;
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/admin/subscriptions');
      const json = await res.json();
      if (json.success) {
        setSubscriptions(json.data);
      } else {
        setError(json.error || 'Failed to fetch subscriptions');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (json.success) {
        fetchSubscriptions();
      } else {
        alert(json.error || 'Error deleting subscription');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Newsletter Subscriptions</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage email subscribers.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-950 text-slate-700 dark:text-slate-300 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Subscriber Email</th>
                <th className="px-6 py-4">Subscribed On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-500">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0 border border-blue-500/20">
                        <Mail className="w-4 h-4 text-blue-400" />
                      </div>
                      <a href={`mailto:${sub.email}`} className="text-slate-200 hover:text-blue-400 transition-colors">
                        {sub.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex justify-end">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group relative"
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
