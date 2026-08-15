import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Policies | Servixo Solutions KFT',
  description: 'Terms of Service, Payment, and Product Policies for Servixo Solutions KFT',
};

export const revalidate = 60; // Revalidate every 60 seconds

import { dbFetchWithTimeout } from '@/lib/dbFetch';

export default async function TermsAndPoliciesPage() {
  let setting = null;
  try {
    setting = await dbFetchWithTimeout(prisma.setting.findUnique({
      where: { key: 'terms_and_policies_content' },
    }));
  } catch (err) {
    console.error('Error fetching terms:', err);
  }

  const content = setting?.value || '<p>Our terms and policies are currently being updated. Please check back later.</p>';

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-6 sm:px-10 mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-6">
          Terms and Policies
        </h1>
        
        <div 
          className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </div>
  );
}
