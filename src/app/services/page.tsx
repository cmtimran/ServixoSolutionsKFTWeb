import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';
import { Cloud, Code2, ShieldCheck, LineChart, ArrowRight, CheckCircle2, Leaf } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IT Services',
  description: 'Explore Servixo\'s full range of enterprise IT services — cloud migration, custom software development, cybersecurity, and strategic IT consulting.',
};

const ICON_MAP: Record<string, React.ElementType> = {
  Cloud: Cloud,
  Software: Code2,
  Cybersecurity: ShieldCheck,
  'IT Consulting': LineChart,
  Environmental: Leaf,
};

const GRADIENT_MAP: Record<string, string> = {
  Cloud: 'from-blue-500 to-cyan-500',
  Software: 'from-indigo-500 to-purple-500',
  Cybersecurity: 'from-emerald-500 to-teal-500',
  'IT Consulting': 'from-amber-500 to-orange-500',
  Environmental: 'from-green-500 to-emerald-600',
};

const COLOR_MAP: Record<string, string> = {
  Cloud: 'text-blue-500 bg-blue-500/10',
  Software: 'text-indigo-500 bg-indigo-500/10',
  Cybersecurity: 'text-emerald-500 bg-emerald-500/10',
  'IT Consulting': 'text-amber-500 bg-amber-500/10',
  Environmental: 'text-green-500 bg-green-500/10',
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await prisma.service.findMany();

  return (
    <>
      <Header />
      <main>
        <PageHero
          badge="Our Capabilities"
          title="Enterprise IT Services"
          titleHighlight="Built to Scale"
          description="From cloud infrastructure to custom software and advanced cybersecurity — we provide end-to-end IT solutions for the most demanding B2B environments."
          cta={{ label: 'Request a Quote', href: '/quote' }}
          ctaSecondary={{ label: 'Contact Us', href: '/contact' }}
        />

        {/* Services Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service) => {
                const Icon = ICON_MAP[service.category] || Code2;
                const gradient = GRADIENT_MAP[service.category] || 'from-blue-500 to-indigo-500';
                const color = COLOR_MAP[service.category] || 'text-blue-500 bg-blue-500/10';
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="glass-card card-glow rounded-3xl p-8 flex flex-col gap-6 group"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          {service.category}
                        </div>
                        <h2 className="text-xl font-bold group-hover:text-gradient transition-all">{service.title}</h2>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {service.description}
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 gap-2">
                      {service.benefits.slice(0, 3).map((b) => (
                        <div key={b} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-emerald)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center gap-2 text-sm font-semibold mt-auto" style={{ color: 'var(--brand-blue)' }}>
                      Explore Service
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-surface)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <span className="badge mb-4 inline-block">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Our Delivery Process</h2>
            <p className="text-lg mb-14" style={{ color: 'var(--text-secondary)' }}>
              A structured, transparent engagement model from first contact to go-live.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Discovery Call', desc: 'We understand your technical requirements, constraints, and business goals.' },
                { step: '02', title: 'Proposal & Scope', desc: 'You receive a detailed project brief, cost estimate, and delivery timeline.' },
                { step: '03', title: 'Agile Development', desc: 'Weekly sprints, demo sessions, and transparent progress reporting.' },
                { step: '04', title: 'Launch & Support', desc: 'Production deployment with SLA monitoring and ongoing maintenance options.' },
              ].map((phase, idx) => (
                <div key={phase.step} className="flex flex-col items-center text-center gap-3 relative">
                  {idx < 3 && (
                    <div className="hidden sm:block absolute top-6 left-[calc(50%+28px)] right-0 h-px" style={{ background: 'var(--border-strong)' }} />
                  )}
                  <div
                    className="w-12 h-12 rounded-2xl text-white font-bold text-sm flex items-center justify-center flex-shrink-0 z-10"
                    style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-indigo))' }}
                  >
                    {phase.step}
                  </div>
                  <h3 className="font-bold text-sm">{phase.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center px-4" style={{ background: 'var(--bg-muted)' }}>
          <h2 className="text-3xl font-extrabold mb-4">Start Your Project Today</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Our team of 45+ specialists is ready to take on your most complex technical challenges.
          </p>
          <Link href="/quote" className="btn-primary mx-auto">
            Get a Free Project Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
