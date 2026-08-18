'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, Mail, Phone, Clock, DollarSign, FileText } from 'lucide-react';

type Quote = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string | null;
  projectTypes: string[];
  budgetRange: string;
  timeline: string;
  projectDescription: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  adminNotes?: string | null;
  createdAt: string;
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeNotesQuoteId, setActiveNotesQuoteId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState<boolean>(false);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/admin/quotes');
      const json = await res.json();
      if (json.success) {
        setQuotes(json.data);
      } else {
        setError(json.error || 'Failed to fetch quotes');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      
      if (json.success) {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: status as any } : q));
      } else {
        alert(json.error || 'Error updating status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notesText })
      });
      const json = await res.json();
      if (json.success) {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, adminNotes: notesText } : q));
        setActiveNotesQuoteId(null);
      } else {
        alert(json.error || 'Error saving notes');
      }
    } catch (error) {
      alert('Error saving notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return;
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (json.success) {
        setQuotes(prev => prev.filter(q => q.id !== id));
      } else {
        alert(json.error || 'Error deleting quote');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting quote');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'IN_REVIEW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Quote Requests & Delivery</h1>
        <p className="text-slate-600 dark:text-slate-400">Review client project requirements, prepare proposals, and manage custom deliverables.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {quotes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-500">
            No quote requests found.
          </div>
        ) : (
          quotes.map((quote) => (
            <div key={quote.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 md:w-1/3 bg-white dark:bg-slate-950/50 border-b md:border-b-0 md:border-r border-slate-800/60 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{quote.clientName}</h3>
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border outline-none cursor-pointer appearance-none ${getStatusColor(quote.status)}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_REVIEW">IN REVIEW</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                  {quote.companyName && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{quote.companyName}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500 dark:text-slate-500" />
                    <a href={`mailto:${quote.clientEmail}`} className="hover:text-blue-400 transition-colors">{quote.clientEmail}</a>
                  </div>
                  {quote.clientPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500 dark:text-slate-500" />
                      <a href={`tel:${quote.clientPhone}`} className="hover:text-blue-400 transition-colors">{quote.clientPhone}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 pt-2">
                    <Clock className="w-3.5 h-3.5" />
                    Requested on {new Date(quote.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Direct Email Action Button */}
                <div className="pt-2">
                  <a
                    href={`mailto:${quote.clientEmail}?subject=Proposal: Custom IT Solution for ${quote.clientName}&body=Dear ${quote.clientName},%0D%0A%0D%0AThank you for reaching out to Servixo Solutions Kft. regarding your ${quote.projectTypes.join(', ')} project.%0D%0A%0D%0A`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Send Proposal / Email
                  </a>
                </div>
              </div>
              
              <div className="p-6 md:w-2/3 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {quote.projectTypes.map(type => (
                    <span key={type} className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {type}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase flex items-center gap-1"><DollarSign className="w-3.5 h-3.5"/> Budget</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{quote.budgetRange}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Timeline</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{quote.timeline}</p>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  <span className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase flex items-center gap-1"><FileText className="w-3.5 h-3.5"/> Requirements & Scope</span>
                  <div className="bg-white dark:bg-slate-950 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 border border-slate-800/60 leading-relaxed max-h-[150px] overflow-y-auto">
                    {quote.projectDescription}
                  </div>
                </div>

                {/* Admin Delivery & Proposal Notes */}
                {quote.adminNotes && activeNotesQuoteId !== quote.id && (
                  <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-indigo-400 block">Internal Delivery Notes / Proposal:</span>
                    <p className="text-slate-300 whitespace-pre-wrap">{quote.adminNotes}</p>
                  </div>
                )}

                {activeNotesQuoteId === quote.id && (
                  <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Proposal / Delivery Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="Add estimate notes, tech stack decisions, milestone schedule, or deliverables..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveNotesQuoteId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingNotes}
                        onClick={() => handleSaveNotes(quote.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                      >
                        {savingNotes ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <button
                    onClick={() => {
                      setActiveNotesQuoteId(quote.id);
                      setNotesText(quote.adminNotes || '');
                    }}
                    className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    📝 {quote.adminNotes ? 'Edit Notes / Proposal' : '+ Add Delivery Notes'}
                  </button>

                  <button
                    onClick={() => handleDelete(quote.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
