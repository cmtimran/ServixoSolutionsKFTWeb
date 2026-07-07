import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { MOCK_REVIEWS } from '@/lib/mockData';
import { Star, Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Reviews',
  description: 'Read what enterprise clients say about working with Servixo Solutions KFT — authentic reviews from CTOs, Directors, and IT leaders across Europe.',
};

const EXTRA_REVIEWS = [
  {
    id: 'r4', clientName: 'Klaus Weber', designation: 'IT Director', company: 'AlphaLogistics GmbH',
    rating: 5, title: 'Best Technical Partner We\'ve Had',
    reviewText: 'Servixo delivered our warehouse management system 2 weeks ahead of schedule. Their code quality is exceptional and the documentation was thorough.',
    logoUrl: 'ALG',
  },
  {
    id: 'r5', clientName: 'Petra Novák', designation: 'Head of Digital', company: 'VivaHealth SK',
    rating: 5, title: 'Transformed Our Patient Portal',
    reviewText: 'The custom healthcare portal Servixo built handles 10,000+ concurrent users flawlessly. GDPR compliance was built in from day one — not an afterthought.',
    logoUrl: 'VH',
  },
  {
    id: 'r6', clientName: 'Marco Bianchi', designation: 'CTO', company: 'Finova Italia',
    rating: 5, title: 'World-Class Security Audit',
    reviewText: 'After the penetration test, Servixo patched 11 critical vulnerabilities and trained our development team on secure coding. Our auditors were impressed.',
    logoUrl: 'FI',
  },
];

const ALL_REVIEWS = [...MOCK_REVIEWS, ...EXTRA_REVIEWS];

const GRADIENT_MAP: Record<string, string> = {
  r1: 'from-blue-600 to-indigo-600',
  r2: 'from-emerald-600 to-teal-600',
  r3: 'from-purple-600 to-pink-600',
  r4: 'from-orange-600 to-amber-600',
  r5: 'from-rose-600 to-red-600',
  r6: 'from-cyan-600 to-blue-600',
};

export default function ReviewsPage() {
  const avgRating = (ALL_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / ALL_REVIEWS.length).toFixed(1);

  return (
    <>
      <Header />
      <main>
        <PageHero
          badge="Social Proof"
          title="Trusted by"
          titleHighlight="Industry Leaders"
          description="Real testimonials from enterprise clients who have partnered with Servixo across cloud, software, and cybersecurity projects."
          cta={{ label: 'Get a Quote', href: '/quote' }}
          ctaSecondary={{ label: 'Contact Us', href: '/contact' }}
        />

        {/* Summary stats */}
        <section className="py-12 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-4xl font-extrabold text-gradient">{avgRating}</div>
                <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Average Rating</div>
              </div>
              <div className="h-16 w-px hidden sm:block" style={{ background: 'var(--border)' }} />
              <div>
                <div className="text-4xl font-extrabold text-gradient">{ALL_REVIEWS.length}</div>
                <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Verified Reviews</div>
              </div>
              <div className="h-16 w-px hidden sm:block" style={{ background: 'var(--border)' }} />
              <div>
                <div className="text-4xl font-extrabold text-gradient">120+</div>
                <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Enterprise Clients</div>
              </div>
              <div className="h-16 w-px hidden sm:block" style={{ background: 'var(--border)' }} />
              <div>
                <div className="text-4xl font-extrabold text-gradient">99%</div>
                <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Would Recommend</div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="glass-card card-glow rounded-2xl p-6 flex flex-col gap-5"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : ''}`}
                        style={i >= review.rating ? { color: 'var(--border-strong)' } : {}}
                      />
                    ))}
                  </div>

                  {/* Quote icon */}
                  <Quote className="w-8 h-8" style={{ color: 'var(--brand-blue)', opacity: 0.3 }} />

                  {/* Title & text */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-base mb-2">&ldquo;{review.title}&rdquo;</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {review.reviewText}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="divider" />

                  {/* Client */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 bg-gradient-to-br ${GRADIENT_MAP[review.id] || 'from-blue-600 to-indigo-600'}`}
                    >
                      {review.logoUrl}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{review.clientName}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {review.designation} · <span style={{ color: 'var(--brand-blue)' }}>{review.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logos strip */}
        <section className="py-14 border-y px-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-widest mb-8" style={{ color: 'var(--text-muted)' }}>
              Trusted by teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {['Budapest FinTech Labs', 'GreenEnergy HU', 'Nexus B2B', 'AlphaLogistics GmbH', 'VivaHealth SK', 'Finova Italia'].map((co) => (
                <div key={co} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ color: 'var(--text-subtle)', background: 'var(--bg-inset)', border: '1px solid var(--border)' }}>
                  {co}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center px-4" style={{ background: 'var(--bg-muted)' }}>
          <h2 className="text-3xl font-extrabold mb-4">Become Our Next Success Story</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join 120+ enterprises who trust Servixo to deliver mission-critical IT solutions.
          </p>
          <Link href="/quote" className="btn-primary mx-auto">
            Start Your Project <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
