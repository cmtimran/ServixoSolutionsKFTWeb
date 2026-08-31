import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, ChevronDown, ArrowRight, Cloud, Code2, ShieldCheck, LineChart, Leaf } from 'lucide-react';
import Link from 'next/link';

import { dbFetchWithTimeout } from '@/lib/dbFetch';

import GtaArchitectureDiagram from '@/components/GtaArchitectureDiagram';

function stripEmojis(text: string) {
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
}

function parseInlineMarkdown(text: string) {
  const cleanText = stripEmojis(text);
  const parts = cleanText.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-normal text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}

function renderFormattedContent(content: string) {
  if (!content) return null;
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-5 text-sm sm:text-base font-normal leading-relaxed text-slate-700 dark:text-slate-300">
      {blocks.map((block, bIdx) => {
        const trimmed = stripEmojis(block);

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={bIdx} className="text-xl font-normal tracking-tight text-slate-900 dark:text-white pt-3 pb-1">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('- ')) {
          const listItems = trimmed.split('\n').filter((line) => line.trim().startsWith('- '));
          return (
            <ul key={bIdx} className="space-y-3 my-4">
              {listItems.map((item, iIdx) => {
                const itemText = item.replace(/^-\s*/, '');
                return (
                  <li key={iIdx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-sm font-normal leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0" />
                    <span className="font-normal">{parseInlineMarkdown(itemText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={bIdx} className="leading-relaxed font-normal">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

const ICON_MAP: Record<string, React.ElementType> = {
  Cloud: Cloud, Software: Code2, Cybersecurity: ShieldCheck, 'IT Consulting': LineChart, Environmental: Leaf,
};

const COLOR_MAP: Record<string, string> = {
  Cloud: 'text-blue-500 bg-blue-500/10',
  Software: 'text-indigo-500 bg-indigo-500/10',
  Cybersecurity: 'text-emerald-500 bg-emerald-500/10',
  'IT Consulting': 'text-amber-500 bg-amber-500/10',
  Environmental: 'text-green-500 bg-green-500/10',
};

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const services = await dbFetchWithTimeout(prisma.service.findMany({ select: { slug: true } }));
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: 'Service Not Found' };
  return { title: service.title, description: service.description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();

  const Icon = ICON_MAP[service.category] || Code2;
  const color = COLOR_MAP[service.category] || 'text-blue-500 bg-blue-500/10';
  const otherServices = await prisma.service.findMany({
    where: { NOT: { slug } },
    take: 3
  });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-25 animate-pulse-glow"
              style={{ background: 'radial-gradient(circle, var(--glow-blue) 0%, transparent 70%)' }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
              <Link href="/" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Services</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)' }}>{service.title}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="badge">{service.category}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-6">{service.title}</h1>
            <p className="text-xl leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="btn-primary font-normal">Get a Project Quote <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-outline font-normal">Talk to an Expert</Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20" style={{ background: 'var(--bg-surface)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: Main content */}
              <div className="lg:col-span-2 space-y-12">
                {/* About */}
                <div>
                  <h2 className="text-2xl font-normal mb-4">About This Service</h2>
                  {renderFormattedContent(service.content)}
                </div>

                {/* Custom Architecture Visual for GTA */}
                {service.slug === 'gateway-threat-authority' && (
                  <GtaArchitectureDiagram />
                )}

                {/* Benefits */}
                <div>
                  <h2 className="text-2xl font-normal mb-6">Key Benefits</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)' }}>
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-emerald)' }} />
                        <span className="text-sm font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{stripEmojis(b)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <h2 className="text-2xl font-normal mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {service.faqs && Array.isArray(service.faqs) && service.faqs.map((faq: any) => (
                      <div key={faq.question} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                        <details className="group">
                          <summary className="flex items-center justify-between p-5 cursor-pointer font-normal text-sm list-none" style={{ background: 'var(--bg-inset)' }}>
                            {faq.question}
                            <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180" style={{ color: 'var(--text-muted)' }} />
                          </summary>
                          <div className="p-5 text-sm leading-relaxed font-normal" style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)' }}>
                            {faq.answer}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Sidebar */}
              <div className="space-y-6">
                {/* Technologies */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-normal text-base mb-4">Technologies & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1.5 rounded-lg text-xs font-normal" style={{ background: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-indigo))', boxShadow: '0 8px 32px var(--glow-blue)' }}>
                  <h3 className="font-normal text-white mb-2">Ready to Start?</h3>
                  <p className="text-blue-100 text-sm mb-5 leading-relaxed font-normal">Get a fully scoped quote from our specialists within 24 hours.</p>
                  <Link href="/quote" className="block w-full py-3 rounded-xl bg-white text-sm font-normal text-center transition-all hover:opacity-90" style={{ color: 'var(--brand-indigo)' }}>
                    Request a Quote
                  </Link>
                </div>

                {/* Other services */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-normal text-base mb-4">Other Services</h3>
                  <div className="space-y-2">
                    {otherServices.map((s) => (
                      <Link key={s.id} href={`/services/${s.slug}`} className="flex items-center gap-3 p-3 rounded-xl transition-colors text-sm font-normal hover:bg-[var(--bg-inset)]">
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--brand-blue)' }} />
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
