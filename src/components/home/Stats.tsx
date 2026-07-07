'use client';

import { motion } from 'framer-motion';
import { MOCK_STATS } from '@/lib/mockData';

export default function Stats() {
  return (
    <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl glass-card border shadow-2xl">
        {MOCK_STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="text-center space-y-2 border-r last:border-r-0 border-slate-200 dark:border-slate-800/50"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
