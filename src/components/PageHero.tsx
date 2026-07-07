import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PageHeroProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  cta?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export default function PageHero({ badge, title, titleHighlight, description, cta, ctaSecondary }: PageHeroProps) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-30 animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, var(--glow-blue) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-20 right-[10%] w-72 h-72 rounded-full opacity-20 animate-float-slower"
          style={{ background: 'radial-gradient(circle, var(--glow-indigo) 0%, transparent 70%)' }}
        />
      </div>

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--border-strong) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <div className="flex justify-center mb-6">
            <span className="badge">{badge}</span>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          {titleHighlight ? (
            <>
              {title}{' '}
              <span className="text-gradient">{titleHighlight}</span>
            </>
          ) : (
            title
          )}
        </h1>

        <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>

        {(cta || ctaSecondary) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {cta && (
              <Link href={cta.href} className="btn-primary">
                {cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {ctaSecondary && (
              <Link href={ctaSecondary.href} className="btn-outline">
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
