'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SyncPaymentsButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin/payments/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        // Force a hard refresh to show new data
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to sync", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-brand-indigo text-white font-medium rounded-lg transition-colors disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Refreshing...' : 'Refresh Payments'}
    </button>
  );
}
