import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex-grow flex items-center justify-center py-32">
        <div className="max-w-md w-full mx-auto p-8 glass-card rounded-3xl text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-4">Payment Successful!</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Thank you for your purchase. We have received your payment and your subscription is now active. You will receive an email confirmation shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="btn-primary w-full justify-center">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
