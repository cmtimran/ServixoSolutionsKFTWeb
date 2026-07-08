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
  createdAt: string;
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        fetchQuotes();
      } else {
        alert(json.error || 'Error updating status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return;
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (json.success) {
        fetchQuotes();
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
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Quote Requests</h1>
        <p className="text-slate-400">Manage client inquiries and project quotes.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {quotes.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            No quote requests found.
          </div>
        ) : (
          quotes.map((quote) => (
            <div key={quote.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 md:w-1/3 bg-slate-950/50 border-b md:border-b-0 md:border-r border-slate-800/60 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-white">{quote.clientName}</h3>
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
                    <p className="text-sm text-slate-400 font-medium">{quote.companyName}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <a href={`mailto:${quote.clientEmail}`} className="hover:text-blue-400 transition-colors">{quote.clientEmail}</a>
                  </div>
                  {quote.clientPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <a href={`tel:${quote.clientPhone}`} className="hover:text-blue-400 transition-colors">{quote.clientPhone}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                    <Clock className="w-3.5 h-3.5" />
                    Requested on {new Date(quote.createdAt).toLocaleDateString()}
                  </div>
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
                    <span className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><DollarSign className="w-3.5 h-3.5"/> Budget</span>
                    <p className="text-sm text-slate-300 font-medium">{quote.budgetRange}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Timeline</span>
                    <p className="text-sm text-slate-300 font-medium">{quote.timeline}</p>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  <span className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1"><FileText className="w-3.5 h-3.5"/> Description</span>
                  <div className="bg-slate-950 p-4 rounded-xl text-sm text-slate-300 border border-slate-800/60 leading-relaxed max-h-[200px] overflow-y-auto">
                    {quote.projectDescription}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleDelete(quote.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Quote
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
