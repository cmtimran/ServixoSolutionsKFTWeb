'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Loader2,
  CreditCard,
  ShieldCheck,
  Lock,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Search,
  ChevronDown as ChevronDownIcon,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ALL_COUNTRIES } from '@/lib/countries';

function CountrySelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = ALL_COUNTRIES.find((c) => c.code === value) || ALL_COUNTRIES.find((c) => c.code === 'HU');

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white flex items-center justify-between focus:outline-none focus:border-indigo-500 cursor-pointer"
      >
        <span className="truncate">{selectedCountry ? `${selectedCountry.name} (${selectedCountry.code})` : 'Select Country'}</span>
        <ChevronDownIcon className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-64 flex flex-col">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 sticky top-0 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                autoFocus
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 py-1"
              />
            </div>
            <div className="overflow-y-auto flex-1 p-1">
              {filteredCountries.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500">No country found</div>
              ) : (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      value === c.code
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-[10px] ${value === c.code ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {c.code}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SimplePayContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const productName = searchParams.get('productName') || 'Product';
  const planTier    = searchParams.get('planTier') || 'Basic';
  const rawPrice    = searchParams.get('price') || '120000';
  const numericPrice = Math.round(parseFloat(rawPrice) || 120000);

  // Form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    taxNumber: '',
    billingAddress: '',
    billingCity: 'Budapest',
    billingZip: '1081',
    billingCountry: 'HU',
    acceptTerms: true,
    acceptDataTransfer: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail) {
      setError(t('checkout.required_error'));
      return;
    }

    if (!formData.acceptDataTransfer) {
      setError(t('checkout.consent_error'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/simplepay/start', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          productName,
          planTier,
          price: numericPrice,
          currency: 'HUF',
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else if (data.paymentUrl) {
        // Redirect to SimplePay hosted checkout
        window.location.href = data.paymentUrl;
      } else {
        setError('No response from payment server');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'A network error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Order Summary Column (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-28">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{t('checkout.summary_title')}</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{productName}</h2>
            </div>
          </div>

          <div className="py-6 space-y-4 text-sm border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">{t('checkout.tier')}</span>
              <span className="font-semibold text-slate-900 dark:text-white px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                {planTier}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">{t('checkout.payment_provider')}</span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">OTP Mobil SimplePay</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">{t('checkout.currency')}</span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">Hungarian Forint (HUF)</span>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-base font-semibold text-slate-900 dark:text-white">{t('checkout.gross_total')}</span>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {numericPrice.toLocaleString('hu-HU')} Ft
                </div>
                <div className="text-[11px] text-slate-500">ÁFA-t tartalmazza / Gross total</div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t('checkout.ssl_badge')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t('checkout.instant_badge')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Billing Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('checkout.billing_title')}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('checkout.billing_subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl p-4 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                {t('checkout.section_1')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.full_name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. John Doe / Kovács János"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+36 20 123 4567"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Company / Invoicing Details (Optional) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" />
                {t('checkout.section_2')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.company_name')}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Corp / Servixo Solutions Kft."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.tax_number')}
                  </label>
                  <input
                    type="text"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    placeholder="12345678-1-42"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                {t('checkout.section_3')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-3">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.address')}
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                    placeholder="e.g. Street Name, House Number"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.zip')}
                  </label>
                  <input
                    type="text"
                    value={formData.billingZip}
                    onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
                    placeholder="1081"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.city')}
                  </label>
                  <input
                    type="text"
                    value={formData.billingCity}
                    onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                    placeholder="Budapest / Dhaka / London..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('checkout.country')}
                  </label>
                  <CountrySelect
                    value={formData.billingCountry}
                    onChange={(val) => setFormData({ ...formData, billingCountry: val })}
                  />
                </div>
              </div>
            </div>

            {/* Mandatory SimplePay Data Forwarding Statement (Adattovábbítási nyilatkozat) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{t('checkout.declaration_title')}</span>
                </div>
                <p>
                  {t('checkout.declaration_text')}
                </p>
                <p className="text-[11px] text-slate-500">
                  <a href="https://simplepay.hu/adatkezelesi-tajekoztato/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline">
                    {t('checkout.declaration_privacy_link')} (simplepay.hu)
                  </a>
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptDataTransfer}
                  onChange={(e) => setFormData({ ...formData, acceptDataTransfer: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {t('checkout.declaration_consent')}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('checkout.redirecting')}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>{t('checkout.submit_btn')}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default function SimplePayPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-16 transition-colors">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
          }
        >
          <SimplePayContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
