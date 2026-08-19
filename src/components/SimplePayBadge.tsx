'use client';

import React from 'react';

export default function SimplePayBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm ${className}`}>
      <a
        href="https://simplepartner.hu/PaymentService/Fizetesi_tajekoztato.pdf"
        target="_blank"
        rel="noopener noreferrer"
        title="SimplePay - Online Bankkártyás Fizetés"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-700">
          <img
            src="/simplepay_logo.svg"
            alt="SimplePay by OTP Group"
            className="h-6 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            Mastercard
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            Maestro
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            Visa
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            Visa Electron
          </span>
        </div>
      </a>
    </div>
  );
}
