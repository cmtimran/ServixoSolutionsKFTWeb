'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Eye, Check, AlertCircle, Clock, Trash2, ArrowUpRight } from 'lucide-react';

interface QuoteItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  projectTypes: string[];
  budgetRange: string;
  timeline: string;
  projectDescription: string;
  attachmentName: string | null;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const INITIAL_QUOTES: QuoteItem[] = [
  {
    id: 'q1',
    clientName: 'Máté Kovács',
    clientEmail: 'm.kovacs@budapestfintech.hu',
    clientPhone: '+36 30 123 4567',
    companyName: 'Budapest FinTech Labs',
    projectTypes: ['cloud', 'software'],
    budgetRange: '50k-100k',
    timeline: '3-6m',
    projectDescription: 'We need to migrate our microservices accounting API from an on-premise server to AWS. The project requires high compliance frameworks for bank audits.',
    attachmentName: 'BFL_Migration_Proposal.pdf',
    status: 'IN_REVIEW',
    createdAt: '2026-07-05 14:23',
  },
  {
    id: 'q2',
    clientName: 'Anna Szabó',
    clientEmail: 'contact@greenenergy.hu',
    clientPhone: '+36 20 987 6543',
    companyName: 'GreenEnergy HU',
    projectTypes: ['software'],
    budgetRange: '15k-50k',
    timeline: '1-3m',
    projectDescription: 'Looking to build an internal dashboard to track energy production across solar stations. Needs real-time webhook updates.',
    attachmentName: null,
    status: 'APPROVED',
    createdAt: '2026-07-04 09:12',
  },
  {
    id: 'q3',
    clientName: 'David Miller',
    clientEmail: 'd.miller@nexusb2b.com',
    clientPhone: '+44 7911 123456',
    companyName: 'Nexus B2B',
    projectTypes: ['security'],
    budgetRange: '100k+',
    timeline: '6m+',
    projectDescription: 'Full external and internal penetration audit and threat vulnerability report across our cloud infrastructure.',
    attachmentName: 'Nexus_Security_Audit_Brief.docx',
    status: 'PENDING',
    createdAt: '2026-07-06 11:45',
  },
];

export default function QuoteManager() {
  const [quotes, setQuotes] = useState<QuoteItem[]>(INITIAL_QUOTES);
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);

  const handleStatusChange = (id: string, newStatus: QuoteItem['status']) => {
    setQuotes((prev) =>
      prev.map((quote) => (quote.id === id ? { ...quote, status: newStatus } : quote))
    );
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDelete = (id: string) => {
    setQuotes((prev) => prev.filter((quote) => quote.id !== id));
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Quote Manager</h1>
        <p className="text-slate-400 text-sm mt-1">Review incoming B2B service requests, view attached SRS briefs, and coordinate client statuses.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Table/List of Quotes */}
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Client / Company</th>
                    <th className="p-4 sm:p-5">Project Scope</th>
                    <th className="p-4 sm:p-5">Budget</th>
                    <th className="p-4 sm:p-5">Status</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-slate-100">{quote.clientName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{quote.companyName}</div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <div className="flex gap-1 flex-wrap">
                          {quote.projectTypes.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border text-[9px] font-semibold text-slate-400 uppercase">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[200px]">
                          {quote.projectDescription}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-slate-200">
                        {quote.budgetRange === '100k+' ? '€100k+' : `€${quote.budgetRange}`}
                      </td>
                      <td className="p-4 sm:p-5">
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteItem['status'])}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[10px] border focus:outline-none cursor-pointer ${
                            quote.status === 'APPROVED'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : quote.status === 'REJECTED'
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                              : quote.status === 'IN_REVIEW'
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}
                        >
                          <option value="PENDING" className="bg-slate-950">Pending</option>
                          <option value="IN_REVIEW" className="bg-slate-950">In Review</option>
                          <option value="APPROVED" className="bg-slate-950">Approved</option>
                          <option value="REJECTED" className="bg-slate-950">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4 sm:p-5 text-right shrink-0">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(quote.id)}
                            className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-600 transition-all cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-slate-500">
                        No quotes submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Quote Detail Sidebar Panel */}
        <div>
          <AnimatePresence mode="wait">
            {selectedQuote ? (
              <motion.div
                key={selectedQuote.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">Quote Details</h3>
                    <span className="text-[10px] text-slate-500">{selectedQuote.createdAt}</span>
                  </div>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-xs text-slate-400 hover:text-white font-semibold"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4 text-xs divide-y divide-slate-900">
                  {/* Client Info */}
                  <div className="space-y-2 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Client Info</span>
                    <div className="space-y-1">
                      <div className="font-bold text-slate-200">{selectedQuote.clientName}</div>
                      <div className="text-slate-400">{selectedQuote.companyName || 'No Company'}</div>
                      <div className="text-slate-400">{selectedQuote.clientEmail}</div>
                      <div className="text-slate-400">{selectedQuote.clientPhone}</div>
                    </div>
                  </div>

                  {/* Scope Details */}
                  <div className="space-y-3 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Project Scope</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500">Budget Range</span>
                        <div className="font-bold text-slate-300">{selectedQuote.budgetRange}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Timeline Target</span>
                        <div className="font-bold text-slate-300">{selectedQuote.timeline}</div>
                      </div>
                    </div>
                  </div>

                  {/* Message Description */}
                  <div className="space-y-2 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Project Brief</span>
                    <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                      {selectedQuote.projectDescription}
                    </p>
                  </div>

                  {/* Attachments */}
                  {selectedQuote.attachmentName && (
                    <div className="space-y-2 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Attachments</span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Downloading attachment: ${selectedQuote.attachmentName}`);
                        }}
                        className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-600 transition-colors w-full"
                      >
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate text-xs font-semibold">{selectedQuote.attachmentName}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-auto" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-10 border border-slate-800 border-dashed rounded-2xl text-center text-slate-500 text-xs">
                Select a quote from the table to view comprehensive details, contact info, and attached specifications.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
