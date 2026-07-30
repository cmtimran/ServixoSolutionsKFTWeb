'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Service = {
  id: string;
  title: string;
  slug: string;
  category: string;
  createdAt: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const json = await res.json();
      if (json.success) {
        setServices(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (error) {
      console.error(error);
      alert('Error deleting service');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Services Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your service offerings, categories, and descriptions.</p>
        </div>
        <Link href="/admin/services/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-2.5 px-5 rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          Add New Service
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-950 text-slate-700 dark:text-slate-300 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Service Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-500">
                    No services found. Create your first service!
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 dark:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      {service.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{service.slug}</td>
                    <td className="px-6 py-4">{new Date(service.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
