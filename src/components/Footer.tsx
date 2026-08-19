import Link from 'next/link';
import { Mail, Phone, MapPin, Cpu, Share2, ExternalLink, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column — wider */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-indigo))' }}>
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight">SERVIXO</span>
                <span className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Solutions KFT</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Budapest's most trusted enterprise IT partner. Cloud migrations, bespoke software, cybersecurity, and strategic consulting since 2026.
            </p>

            {/* Contact mini list */}
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-blue)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Rákóczi út 63, Budapest 1081, Hungary</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-blue)' }} />
                <a href="mailto:hello@servixo.hu" className="transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}>servixokft@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-blue)' }} />
                <a href="tel:+3612345678" className="transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}>+36 20 281 1466</a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex gap-3 pt-1">
              {[{ icon: Share2, href: '#', label: 'LinkedIn' }, { icon: ExternalLink, href: '#', label: 'Website' }].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} title={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>Navigation</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/reviews', label: 'Client Reviews' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/quote', label: 'Get a Quote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:underline" style={{ color: 'var(--text-secondary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>Services</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/services', label: 'All Services' },
                { href: '/services/cloud-migration', label: 'Cloud Migration' },
                { href: '/services/custom-software', label: 'Custom Software' },
                { href: '/services/cybersecurity', label: 'Cybersecurity' },
                { href: '/services/it-consulting', label: 'IT Consulting' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:underline" style={{ color: 'var(--text-secondary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>Products</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products/servixo-erp', label: 'Servixo CoreERP' },
                { href: '/products/guardx-security', label: 'GuardX Sentinel' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:underline" style={{ color: 'var(--text-secondary)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA mini card */}
            <div className="mt-6 p-4 rounded-2xl" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Ready to start your project?
              </p>
              <Link href="/quote" className="flex items-center gap-1.5 text-xs font-bold transition-all hover:gap-2.5" style={{ color: 'var(--brand-blue)' }}>
                Get a Quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* SimplePay Payment Information & Logos (Chapter 7 Compliance) */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <a
              href="https://simplepartner.hu/PaymentService/Fizetesi_tajekoztato.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="SimplePay - Online Bankkártyás Fizetés / Online Card Payment"
              className="inline-block bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-transform hover:scale-105 shadow-sm"
            >
              <img
                src="https://simplepartner.hu/images/simple_logo.png"
                alt="SimplePay - Online Bank Card Payment"
                className="h-7 w-auto object-contain"
                width={197}
                height={27}
              />
            </a>
            <div className="text-[11px] leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Biztonságos online bankkártyás fizetés az OTP SimplePay rendszerén keresztül.
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Mastercard, Maestro, Visa, Visa Electron kártyák elfogadása.
              </p>
            </div>
          </div>
          <div className="text-right">
            <a
              href="https://simplepartner.hu/PaymentService/Payment_information.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-500 hover:underline inline-flex items-center gap-1"
            >
              SimplePay Payment Information (PDF) <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-subtle)' }}>
          <p>&copy; {new Date().getFullYear()} Servixo Solutions KFT. All rights reserved. Budapest, Hungary.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms-and-policies" className="hover:underline">Terms & Policies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
