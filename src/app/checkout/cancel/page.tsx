import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <>
      <Header />
      <main className="flex-grow flex items-center justify-center py-32">
        <div className="max-w-md w-full mx-auto p-8 glass-card rounded-3xl text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-4">Payment Cancelled</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Your checkout process was cancelled. You have not been charged. If you experienced an issue or have questions, please contact our support team.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/products" className="btn-primary w-full justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
