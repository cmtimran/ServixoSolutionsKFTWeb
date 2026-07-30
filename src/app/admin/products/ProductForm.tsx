'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  priceBasic: number;
  pricePro: number;
  priceEnterprise: number;
};

export default function ProductForm({ initialData }: { initialData?: Product }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Product>(
    initialData || {
      title: '',
      slug: '',
      description: '',
      priceBasic: 0,
      pricePro: 0,
      priceEnterprise: 0,
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
      const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(json.error || 'Failed to save product');
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
        <Link href="/admin/products" className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Configure product details and pricing tiers.</p>
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
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Title *</label>
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

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Short Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pricing Tiers (€)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Basic Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.priceBasic}
                onChange={(e) => setFormData({ ...formData, priceBasic: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pro Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePro}
                onChange={(e) => setFormData({ ...formData, pricePro: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enterprise Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.priceEnterprise}
                onChange={(e) => setFormData({ ...formData, priceEnterprise: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end border-t border-slate-200 dark:border-slate-700/60">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
