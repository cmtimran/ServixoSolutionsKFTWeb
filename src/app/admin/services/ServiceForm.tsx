'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Service = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
};

export default function ServiceForm({ initialData }: { initialData?: Service }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Service>(
    initialData || {
      title: '',
      slug: '',
      description: '',
      content: '',
      category: 'Cloud',
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/admin/services/${initialData.id}` : '/api/admin/services';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        router.push('/admin/services');
        router.refresh();
      } else {
        setError(json.error || 'Failed to save service');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            {isEdit ? 'Edit Service' : 'Create New Service'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Configure service details and category.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-8">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({
                  ...formData,
                  title,
                  slug: isEdit ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                });
              }}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="Cloud">Cloud</option>
              <option value="Software">Software</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="IT Consulting">IT Consulting</option>
            </select>
          </div>
          
          {/* Empty div for grid alignment */}
          <div className="hidden lg:block"></div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Short Description *</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>
          
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Detailed Content (Markdown Supported) *</label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
            />
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end border-t border-slate-200 dark:border-slate-700/60">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEdit ? 'Save Changes' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
}
