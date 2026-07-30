'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, Star, CheckCircle, XCircle } from 'lucide-react';

type Review = {
  id: string;
  clientName: string;
  designation: string;
  company: string;
  rating: number;
  title: string | null;
  reviewText: string;
  isApproved: boolean;
  createdAt: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      } else {
        setError(json.error || 'Failed to fetch reviews');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      const json = await res.json();
      
      if (json.success) {
        fetchReviews();
      } else {
        alert(json.error || 'Error updating approval status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating approval status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (json.success) {
        fetchReviews();
      } else {
        alert(json.error || 'Error deleting review');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting review');
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Client Reviews</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage and approve client testimonials for the public site.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-500">
            No reviews found.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 md:w-1/3 bg-slate-950/50 border-b md:border-b-0 md:border-r border-slate-800/60 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{review.clientName}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {review.designation} at <span className="text-indigo-400">{review.company}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                      />
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                    Submitted {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:w-2/3 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-200">{review.title || 'Untitled Review'}</h4>
                  
                  <button
                    onClick={() => toggleApproval(review.id, review.isApproved)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      review.isApproved 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-700 hover:text-slate-900 dark:text-white'
                    }`}
                  >
                    {review.isApproved ? (
                      <><CheckCircle className="w-3.5 h-3.5" /> Approved</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5" /> Hidden</>
                    )}
                  </button>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 border border-slate-800/60 leading-relaxed italic flex-grow">
                  "{review.reviewText}"
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Review
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
