'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/mockData';

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % MOCK_REVIEWS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + MOCK_REVIEWS.length) % MOCK_REVIEWS.length);
  };

  const activeReview = MOCK_REVIEWS[activeIdx];

  return (
    <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      <div className="text-center space-y-4">
        <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          Client Endorsements
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
          Trusted by European Tech Leaders
        </h3>
      </div>

      <div className="relative p-8 sm:p-16 rounded-3xl glass-card border shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
        
        {/* Quote watermark background */}
        <Quote className="absolute top-8 right-8 w-24 h-24 text-slate-200 dark:text-slate-800/20 pointer-events-none" />

        <div className="relative z-10">
          {/* Star Rating */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, starIdx) => (
              <Star
                key={starIdx}
                className={`w-5 h-5 ${
                  starIdx < activeReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Testimonial Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                &ldquo;{activeReview.title}&rdquo;
              </h4>
              <p className="text-slate-700 dark:text-slate-300 text-lg italic leading-relaxed">
                {activeReview.reviewText}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Profile Card and controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-slate-200/50 dark:border-[var(--border)] dark:border-slate-800/50 mt-8 relative z-10">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4"
            >
              {/* Fallback client profile avatar logo circle */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center shadow-lg uppercase text-sm shrink-0">
                {activeReview.logoUrl || activeReview.clientName.substring(0, 2)}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{activeReview.clientName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {activeReview.designation} &middot; <span className="font-semibold text-blue-500">{activeReview.company}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-[var(--bg-surface)] bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors shadow-sm"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-[var(--bg-surface)] bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors shadow-sm"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
