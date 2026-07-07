'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
      {/* Background Gradients & Effects */}
      <div className="absolute inset-0 z-0 bg-[var(--bg-base)] dark:bg-slate-950">
        {/* Floating Orb 1 */}
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-blue-500/10 rounded-full blur-[120px] animate-float-slow" />
        {/* Floating Orb 2 */}
        <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-indigo-600/10 rounded-full blur-[100px] animate-float-slower" />
        {/* Dot grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/8 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Empowering B2B Enterprises & Startups
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none max-w-5xl mx-auto">
            Architecting the Future of{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Enterprise IT Solutions
            </span>
          </h1>

          {/* Description (Exactly 30 words) */}
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Servixo Solutions KFT designs and implements premium, scalable IT systems, bespoke software, and cloud architectures from Budapest, enabling businesses worldwide to streamline operations, maximize security, and accelerate digital growth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="#services"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.03] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Services
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm shadow-sm"
            >
              <Calendar className="w-5 h-5 text-blue-400" />
              Book a Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
