'use client';

import { motion } from 'framer-motion';
import { DollarSign, FileText, Mail, Users, ArrowUpRight, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminOverview() {
  const cards = [
    { label: 'Total Sales Revenue', value: '€184,500', change: '+14.2% from last month', icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Total Quotes Submitted', value: '38', change: '+8 this week', icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Newsletter Subscribers', value: '412', change: '+24 new entries', icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Active Service Inquiries', value: '14', change: '4 pending response', icon: Mail, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const recentQuotes = [
    { id: 'q1', client: 'Máté Kovács', company: 'Budapest FinTech Labs', types: 'Cloud Migration', budget: '50k-100k', status: 'IN_REVIEW' },
    { id: 'q2', client: 'Anna Szabó', company: 'GreenEnergy HU', types: 'Software, Cloud', budget: '15k-50k', status: 'APPROVED' },
    { id: 'q3', client: 'David Miller', company: 'Nexus B2B', types: 'Cybersecurity', budget: '100k+', status: 'PENDING' },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time telemetry and management controls for Servixo Solutions KFT.</p>
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
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{card.label}</span>
                <span className="text-2xl font-bold text-white block">{card.value}</span>
                <span className="text-[10px] text-slate-500 font-medium block">{card.change}</span>
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
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Analytics</h3>
              <p className="text-xs text-slate-500">Sales volume performance and growth trajectory</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              +18.4% YoY
            </span>
          </div>

          {/* Simple CSS simulated chart bars */}
          <div className="h-[200px] flex items-end justify-between gap-3 pt-6 border-b border-slate-800">
            {[40, 55, 45, 60, 80, 95, 75, 90, 110, 130, 120, 145].map((val, idx) => (
              <div key={idx} className="flex-grow flex flex-col items-center gap-2 group">
                {/* Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300 relative"
                  style={{ height: `${(val / 160) * 100}%` }}
                >
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    €{val}k
                  </span>
                </div>
                {/* Month label */}
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Quotes</h3>
            <Link href="/admin/quotes" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentQuotes.map((quote) => (
              <div key={quote.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-start gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-200">{quote.client}</div>
                  <div className="text-[10px] text-slate-500">{quote.company}</div>
                  <div className="inline-flex px-2 py-0.5 rounded bg-slate-900 border text-[9px] font-medium text-slate-400">
                    {quote.types}
                  </div>
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <div className="font-bold text-slate-300">Est. {quote.budget}</div>
                  {quote.status === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                      <CheckCircle className="w-3 h-3" /> Approved
                    </span>
                  ) : quote.status === 'IN_REVIEW' ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-400">
                      <Clock className="w-3 h-3" /> In Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
