'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_REVIEWS, ReviewMock } from '@/lib/mockData';
import { Check, X, Star, Trash2, Eye, EyeOff } from 'lucide-react';

interface ExtendedReview extends ReviewMock {
  isApproved: boolean;
}

const INITIAL_EXTENDED_REVIEWS: ExtendedReview[] = MOCK_REVIEWS.map((r, idx) => ({
  ...r,
  isApproved: idx < 2, // approve first two, third is pending approval
}));

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<ExtendedReview[]>(INITIAL_EXTENDED_REVIEWS);

  const handleToggleApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Client Reviews Moderation</h1>
        <p className="text-slate-400 text-sm mt-1">Approve, hide, or archive testimonials before they display on the public website pages.</p>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            layout
            className={`p-6 rounded-2xl border bg-slate-950 flex flex-col justify-between h-[300px] relative overflow-hidden ${
              review.isApproved ? 'border-slate-800' : 'border-amber-500/30 shadow-lg shadow-amber-500/5'
            }`}
          >
            {/* Pending Badge */}
            {!review.isApproved && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-wider">
                Pending Approval
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-3.5 h-3.5 ${
                      starIdx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-100 text-sm line-clamp-1">&ldquo;{review.title}&rdquo;</h4>
                <p className="text-slate-400 leading-relaxed line-clamp-4">{review.reviewText}</p>
              </div>
            </div>

            {/* Profile footer and actions */}
            <div className="border-t border-slate-900 pt-4 mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold uppercase text-[10px] shrink-0">
                  {review.logoUrl || review.clientName.substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-200 truncate">{review.clientName}</div>
                  <div className="text-[9px] text-slate-500 truncate">
                    {review.designation} &middot; <span className="text-blue-500">{review.company}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleToggleApproval(review.id)}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                    review.isApproved
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title={review.isApproved ? 'Hide Review' : 'Approve Review'}
                >
                  {review.isApproved ? <EyeOff className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-450 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="col-span-full p-10 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
            No client reviews submitted.
          </div>
        )}
      </div>
    </div>
  );
}
