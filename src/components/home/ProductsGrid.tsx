'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export default function ProductsGrid() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950/40 border-y border-slate-100 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            SaaS & Product Suites
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Premium Out-of-the-Box Software Solutions
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Deploy state-of-the-art enterprise tools built for direct integration, high reliability, and premium security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {MOCK_PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-lg dark:shadow-none transition-shadow duration-300 overflow-hidden group"
            >
              {/* Product Header & Info */}
              <div className="p-8 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {product.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Starting at</span>
                    <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                      ${product.priceBasic}
                    </span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">/mo</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="border-t border-slate-100 dark:border-[var(--border)] dark:border-slate-800/60 pt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-4">
                    Key Capabilities Included:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.slice(0, 4).map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-[var(--bg-base)] dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  href={`/products/${product.slug}?buy=true`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
