import { prisma } from '@/lib/prisma';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'Contact Queries | Admin Panel',
};

export const dynamic = 'force-dynamic';

async function markAsRead(id: string) {
  'use server';
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath('/admin/queries');
}

export default async function QueriesPage() {
  const queries = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Queries</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        {queries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No contact queries yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {queries.map((query) => (
              <div key={query.id} className={`p-6 ${!query.isRead ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{query.subject}</h3>
                      {!query.isRead && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {query.name} ({query.email})</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(query.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                      {query.message}
                    </div>
                  </div>
                  {!query.isRead && (
                    <form action={markAsRead.bind(null, query.id)}>
                      <button 
                        type="submit"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800/50 dark:hover:border-blue-500/50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Read
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
