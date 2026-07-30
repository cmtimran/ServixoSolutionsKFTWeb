'use client';

import { motion } from 'framer-motion';
import { DollarSign, FileText, Mail, Users, ArrowUpRight, TrendingUp, CheckCircle, Clock, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type DashboardData = {
  counts: {
    totalProducts: number;
    totalServices: number;
    totalUsers: number;
    unreadQueries: number;
  };
  recentQueries: Array<{
    id: string;
    name: string;
    subject: string | null;
    isRead: boolean;
    createdAt: string;
  }>;
};

export default function AdminOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Products', value: data?.counts.totalProducts || 0, change: 'Active in catalog', icon: Package, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Total Services', value: data?.counts.totalServices || 0, change: 'Active in catalog', icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Unread Queries', value: data?.counts.unreadQueries || 0, change: 'Awaiting response', icon: Mail, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Total Users', value: data?.counts.totalUsers || 0, change: 'Admin accounts', icon: Users, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Real-time telemetry and management controls for Servixo Solutions KFT.</p>
      </div>

      {/* Grid of Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{card.label}</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white block">{card.value}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium block">{card.change}</span>
              </div>
              <div className={`p-3.5 rounded-xl shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Row: Analytics Chart Mock and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart mock */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Analytics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-500">Sales volume performance and growth trajectory</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              +18.4% YoY
            </span>
          </div>

          {/* Simple CSS simulated chart bars */}
          <div className="h-[200px] flex items-end justify-between gap-3 pt-6 border-b border-slate-200 dark:border-slate-800">
            {[40, 55, 45, 60, 80, 95, 75, 90, 110, 130, 120, 145].map((val, idx) => (
              <div key={idx} className="flex-grow flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300 relative"
                  style={{ height: `${(val / 160) * 100}%` }}
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border text-slate-900 dark:text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    €{val}k
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-semibold">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Queries</h3>
            <Link href="/admin/queries" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {data?.recentQueries && data.recentQueries.length > 0 ? (
              data.recentQueries.map((query) => (
                <div key={query.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-slate-200">{query.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-500">{query.subject || 'No Subject'}</div>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <div className="text-slate-600 dark:text-slate-400 text-[10px]">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </div>
                    {query.isRead ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400">
                        <Clock className="w-3 h-3" /> Unread
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-500 text-sm">No recent queries found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
