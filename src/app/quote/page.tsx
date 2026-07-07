import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuotationForm from '@/components/QuotationForm';

export const metadata = {
  title: 'Request a Quote | Servixo Solutions KFT',
  description: 'Get a customized B2B IT project timeline, cost scope, and architectural brief from Servixo lead consultants.',
};

export default function QuotePage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-[var(--bg-base)] dark:bg-slate-950 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header Texts */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Request a Project Quote
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Fill out our interactive multi-step project brief. It takes under 3 minutes to scope your budget, timelines, and technical stack requirements.
            </p>
          </div>

          {/* Form Wizard */}
          <div className="relative z-10">
            <QuotationForm />
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
