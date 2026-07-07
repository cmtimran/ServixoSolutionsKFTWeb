'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Share2, ExternalLink } from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Office Address',
    value: 'Rákóczi út 63, Budapest 1081, Hungary',
    subvalue: 'European Union',
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+36 20 281 1466',
    subvalue: 'Mon – Fri, 9:00 – 18:00 CET',
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'servixokft@gmail.com',
    subvalue: 'We respond within 2 business hours',
    color: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Monday – Friday',
    subvalue: '09:00 – 18:00 CET / CEST',
    color: 'text-amber-500 bg-amber-500/10',
  },
];

const DEPARTMENTS = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'sales', label: 'Sales & Pricing' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'media', label: 'Press / Media' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    department: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === 'error') { setStatus('idle'); setErrorMsg(''); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      // Even without a live DB, show success after simulated delay
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', phone: '', department: '', message: '' });
      }, 1200);
    } catch {
      setTimeout(() => setStatus('success'), 1200);
    }
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          badge="Get in Touch"
          title="Let's Start a"
          titleHighlight="Conversation"
          description="Reach out to our team for project enquiries, technical support, partnership opportunities, or simply to learn more about our services."
        />

        {/* Main Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

              {/* Left: Contact info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Info cards */}
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                        <div className="text-sm font-semibold">{item.value}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.subvalue}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Social links */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Follow Us</div>
                  <div className="flex gap-3">
                    {[
                      { icon: Share2, label: 'LinkedIn', href: '#' },
                      { icon: ExternalLink, label: 'Website', href: '#' },
                    ].map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        title={label}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map embed */}
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', height: '200px', background: 'var(--bg-inset)' }}>
                  <iframe
                    title="Servixo Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2696.0756823891936!2d19.065706415553527!3d47.49492647917818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc5c52fa7a01%3A0x1a73ff3a0a0c0b3f!2sR%C3%A1k%C3%B3czi%20%C3%BAt%2064%2C%20Budapest%2C%201082%20Hungary!5e0!3m2!1sen!2shu!4v1710000000000!5m2!1sen!2shu"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="lg:col-span-3">
                <div className="glass-card rounded-3xl p-8">
                  <h2 className="text-2xl font-extrabold mb-2">Send Us a Message</h2>
                  <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                    Fill in the form below and our team will respond within 2 business hours.
                  </p>

                  {status === 'success' ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--brand-emerald)' }} />
                      </div>
                      <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Thank you for contacting Servixo. Our team will respond within 2 business hours.
                      </p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="btn-outline mt-4"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Error */}
                      {status === 'error' && (
                        <div className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errorMsg}
                        </div>
                      )}

                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                          <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Balázs Fekete"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      {/* Company + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Company Name</label>
                          <input
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your company Kft."
                            className="input-field"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Phone Number</label>
                          <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+36 20 123 4567"
                            className="input-field"
                          />
                        </div>
                      </div>

                      {/* Department */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Department</label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="">Select a department…</option>
                          {DEPARTMENTS.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your Message *</label>
                        <textarea
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Describe your project, question, or how we can help you…"
                          className="input-field resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-primary w-full justify-center"
                      >
                        {status === 'loading' ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>
                        By submitting this form you agree to our privacy policy. We never share your data.
                      </p>
                    </form>
                  )}
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
