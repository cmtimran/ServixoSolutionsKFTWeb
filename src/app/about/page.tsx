import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Users, Award, Target, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Servixo Solutions KFT — our story, values, and the expert team behind Budapest\'s premier IT services company.',
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

const TEAM = [
  {
    name: 'Balázs Fekete',
    title: 'Chief Executive Officer',
    bio: '18 years in enterprise tech. Former VP Engineering at Deutsche Telekom Hungary. Led digital transformation for 3 Fortune 500 clients.',
    initials: 'BF',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    name: 'Réka Horváth',
    title: 'Chief Technology Officer',
    bio: 'Cloud architecture specialist. Google Cloud Certified Professional. Built multi-region systems handling 50M+ daily transactions.',
    initials: 'RH',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    name: 'Dávid Molnár',
    title: 'Head of Cybersecurity',
    bio: 'OSCP & CEH certified ethical hacker. 12 years securing banking systems across Central Europe. ISO 27001 lead auditor.',
    initials: 'DM',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    name: 'Zsófia Varga',
    title: 'Head of Client Success',
    bio: 'Former McKinsey IT consultant. Drives account growth and ensures SLA compliance across all enterprise partnerships.',
    initials: 'ZV',
    gradient: 'from-rose-600 to-pink-600',
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
              Founded in 2014 by a small team of passionate engineers in Budapest, Servixo Solutions KFT was born from a simple belief: enterprises deserve IT partners who combine global technology expertise with local market understanding.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              Over a decade, we've grown to a 45+ specialist team, serving clients across 8 European countries. Our proprietary products — CoreERP and GuardX — are trusted by companies from mid-size startups to multinational corporations.
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

        {/* Team */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-muted)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="badge mb-4 inline-block">The Team</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Leadership You Can Trust</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Senior specialists with decades of combined experience across cloud, software, and cybersecurity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="glass-card rounded-2xl p-6 text-center flex flex-col items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-0.5">{member.name}</h3>
                    <p className="text-xs font-semibold mb-3" style={{ color: 'var(--brand-blue)' }}>{member.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{member.bio}</p>
                  </div>
                </div>
              ))}
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
              <Link href="/contact" className="btn-outline">Contact Our Team</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
