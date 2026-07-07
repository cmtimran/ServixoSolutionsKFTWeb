'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Award, ShieldAlert, Briefcase, ArrowRight } from 'lucide-react';
import { MOCK_SERVICES } from '@/lib/mockData';

const iconMap: Record<string, any> = {
  'cloud-migration': Cpu,
  'custom-software': Award,
  'cybersecurity': ShieldAlert,
  'it-consulting': Briefcase,
};

export default function ServicesGrid() {
  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          Elite Capabilities
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bespoke IT Services Tailored for Enterprise Growth
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          From robust cloud infrastructure to secure software systems, we build architectures that adapt to your scaling needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_SERVICES.map((service, idx) => {
          const Icon = iconMap[service.slug] || Cpu;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex"
            >
              <Link
                href={`/services/${service.slug}`}
                className="group relative flex flex-col justify-between p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 shadow-sm hover:shadow-md dark:shadow-none card-glow transition-all duration-300 w-full"
              >
                <div className="space-y-6">
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-6 group-hover:translate-x-1 transition-transform">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
