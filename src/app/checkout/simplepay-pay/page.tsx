'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CreditCard, ShieldCheck, Lock, Building, User, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SimplePayContent() {
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

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.billingAddress) {
      setError('Kérjük, töltse ki a kötelező mezőket! / Please fill in all required fields.');
      return;
    }

    if (!formData.acceptDataTransfer) {
      setError('A fizetéshez el kell fogadnia az adattovábbítási nyilatkozatot.');
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
        setError('Nem érkezett válasz a fizetési szervertől.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Hálózati hiba történt.');
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
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Rendelés összegzése</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{productName}</h2>
            </div>
          </div>

          <div className="py-6 space-y-4 text-sm border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Csomag / Tier</span>
              <span className="font-semibold text-slate-900 dark:text-white px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                {planTier}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Fizetési szolgáltató</span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">OTP Mobil SimplePay</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Pénznem</span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs">Hungarian Forint (HUF)</span>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-base font-semibold text-slate-900 dark:text-white">Fizetendő összeg</span>
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
                <span>256-bites SSL titkosítású biztonságos fizetés</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Azonnali visszaigazolás és számlázás</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Billing Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Számlázási és ügyféladatok</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Kérjük, adja meg a számla kiállításához szükséges adatait a fizetés megkezdése előtt.
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
                1. Személyes / Kapcsolattartó adatok
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Teljes név / Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="pl. Kovács János"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    E-mail cím (hozzáféréshez) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="janos@pelda.hu"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Telefonszám / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+36 20 123 4567"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Company / Invoicing Details (Optional) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" />
                2. Céges adatok (Opcionális)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Cégnév / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="pl. Servixo Solutions Kft."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Adószám / Tax Number
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
                3. Számlázási cím / Billing Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-3">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Utca, házszám / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingAddress}
                    onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                    placeholder="pl. Rákóczi út 63."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Irányítószám / Zip *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingZip}
                    onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
                    placeholder="1081"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Város / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingCity}
                    onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                    placeholder="Budapest"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Ország / Country *
                  </label>
                  <select
                    value={formData.billingCountry}
                    onChange={(e) => setFormData({ ...formData, billingCountry: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="HU">Magyarország (HU)</option>
                    <option value="DE">Németország (DE)</option>
                    <option value="AT">Ausztria (AT)</option>
                    <option value="RO">Románia (RO)</option>
                    <option value="SK">Szlovákia (SK)</option>
                    <option value="US">Egyesült Államok (US)</option>
                    <option value="GB">Egyesült Királyság (GB)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mandatory SimplePay Data Forwarding Statement (Adattovábbítási nyilatkozat) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Adattovábbítási nyilatkozat / Data Transfer Declaration</span>
                </div>
                <p>
                  Tudomásul veszem, hogy a <strong>Servixo Solutions Kft.</strong> (1081 Budapest, Rákóczi út 63.) adatkezelő által a(z) servixosolutionskft.com felhasználói adatbázisában tárolt alábbi személyes adataim átadásra kerülnek az <strong>OTP Mobil Kft. (1143 Budapest, Hungária krt. 17-19.)</strong>, mint adatfeldolgozó részére.
                </p>
                <p className="text-[11px] text-slate-500">
                  Az adatfeldolgozó által végzett adatfeldolgozási tevékenység jellege és célja a SimplePay Adatkezelési tájékoztatóban tekinthető meg:{' '}
                  <a href="https://simplepay.hu/adatkezelesi-tajekoztato/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline">
                    simplepay.hu/adatkezelesi-tajekoztato
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
                  Kifejezetten elfogadom az <strong>Adattovábbítási nyilatkozatot</strong> és az Általános Szerződési Feltételeket. *
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
                    <span>Átirányítás a SimplePay felületére…</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Tovább a biztonságos SimplePay fizetéshez</span>
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
