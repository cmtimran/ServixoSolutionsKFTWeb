import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Users, Award, Target, Zap, CheckCircle2, ArrowRight, Cloud, ShieldCheck, Code2, Leaf, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Servixo Solutions KFT — our story, core principles, technical domain expertise, and enterprise-grade software and cybersecurity solutions.',
};

const VALUES = [
  {
    icon: Target,
    title: 'Precision Engineering',
    desc: 'Every system we build is designed to exact client specifications, benchmarked against enterprise SLA standards.',
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    icon: Award,
    title: 'Proven Excellence',
    desc: 'Over 500 successfully delivered projects across financial technology, energy, healthcare, and logistics sectors.',
    color: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    icon: Users,
    title: 'Client-First Culture',
    desc: 'We treat every client\'s business as our own. Long-term partnerships, not one-off transactions.',
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'Rapid Execution',
    desc: 'Agile delivery frameworks ensure rapid prototyping, weekly sprints, and real results within weeks.',
    color: 'text-amber-500 bg-amber-500/10',
  },
];

const WORK_DOMAINS = [
  {
    icon: Cloud,
    badge: 'Cloud & Infrastructure',
    title: 'Enterprise Cloud Transformation',
    desc: 'We architect, migrate, and optimize resilient multi-cloud environments across AWS, Azure, and Google Cloud with 99.99% availability guarantees.',
    highlights: ['Multi-Region Cloud Architecture', 'Automated DevOps & CI/CD Pipelines', 'Zero-Downtime Database Migration', 'Cost & Performance Optimization'],
    gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
    iconColor: 'text-blue-500 bg-blue-500/10',
  },
  {
    icon: Code2,
    badge: 'Software Engineering',
    title: 'Custom Web & Microservice Development',
    desc: 'Engineering tailored enterprise platforms, microservices, and AI-assisted tools using modern frameworks built to handle high traffic and critical workloads.',
    highlights: ['Next.js, Node.js & Go Systems', 'Custom ERP & Core Platform Solutions', 'Scalable REST & GraphQL APIs', 'Full IP & Code Base Ownership'],
    gradient: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    icon: ShieldCheck,
    badge: 'Cybersecurity',
    title: 'Threat Mitigation & Defense Systems',
    desc: 'Proactive cyber defense, penetration testing, compliance management, and proprietary products like Gateway Threat Authority (GTA) for real-time DDoS protection.',
    highlights: ['Penetration Testing & Audits', 'Gateway Threat Authority (GTA)', 'GuardX Endpoint Protection', 'ISO 27001 & GDPR Compliance'],
    gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    icon: Leaf,
    badge: 'Environmental Engineering',
    title: 'ETP, EIA & Sustainable Solutions',
    desc: 'Designing comprehensive Environmental Treatment Plants (ETP), conducting Environmental Impact Assessments (EIA), and implementing industrial waste management systems.',
    highlights: ['Effluent Treatment Plant (ETP) Design', 'Environmental Impact Assessment (EIA)', 'Industrial Waste Recycling Systems', 'Sustainability & Regulatory Audits'],
    gradient: 'from-amber-500/10 to-emerald-500/10 border-amber-500/20',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          badge="Who We Are"
          title="Built on Expertise,"
          titleHighlight="Driven by Results"
          description="Servixo Solutions KFT is Budapest's most trusted enterprise IT partner — combining deep technical mastery with unwavering commitment to client success since 2014."
          cta={{ label: 'Meet Our Services', href: '/services' }}
          ctaSecondary={{ label: 'Get a Quote', href: '/quote' }}
        />

        {/* Stats bar */}
        <section className="py-12 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Projects Delivered', value: '500+' },
                { label: 'Years of Excellence', value: '10+' },
                { label: 'Enterprise Clients', value: '120+' },
                { label: 'Tech Specialists', value: '45+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="badge mb-4 inline-block">Our Principles</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">What Sets Us Apart</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Four core values that guide every engagement — from initial consultation to post-launch support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="glass-card card-glow rounded-2xl p-6 flex flex-col gap-4"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${v.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-2">{v.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story section */}
        <section className="py-20" style={{ background: 'var(--bg-surface)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="badge mb-4 inline-block">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              A Decade of Building the <span className="text-gradient">Digital Future</span>
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Founded in 2014 by passionate engineers in Budapest, Servixo Solutions KFT was born from a simple belief: enterprises deserve IT partners who combine global technology expertise with local market understanding.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              Over a decade, we have expanded operations across 8 European countries. Our proprietary products — CoreERP, GuardX, and Gateway Threat Authority — are trusted by companies from mid-size startups to multinational corporations.
            </p>
            <div className="space-y-3">
              {['EU GDPR Compliant Operations', 'ISO 27001 Certified Security Practices', 'Microsoft & AWS Certified Partner Network'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-emerald)' }} />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Work & Capabilities */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-muted)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="badge mb-4 inline-block">What We Do</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Our Work & Technical Capabilities</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                We engineer mission-critical systems, secure digital perimeters, and deliver end-to-end technology solutions tailored for enterprise scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
              {WORK_DOMAINS.map((domain) => {
                const Icon = domain.icon;
                return (
                  <div
                    key={domain.title}
                    className={`glass-card rounded-2xl p-8 border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${domain.gradient}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${domain.iconColor}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-secondary border border-white/10">
                          {domain.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-3">{domain.title}</h3>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                        {domain.desc}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      {domain.highlights.map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-emerald)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glass-card rounded-2xl p-8 text-center max-w-3xl mx-auto border" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold mb-2">Looking for a custom solution or consultation?</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Explore our full suite of digital solutions, proprietary software products, and environmental engineering services.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/services" className="btn-primary text-sm">
                  View All Services <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/products" className="btn-outline text-sm">
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center" style={{ background: 'var(--bg-surface)' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4">Ready to Work With Us?</h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              Let's discuss your project. We'll deliver a custom scope, timeline, and cost estimate within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-primary">Get a Free Quote <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-outline">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

