'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS, MOCK_SERVICES, ProductMock, ServiceMock } from '@/lib/mockData';
import { Plus, Edit2, Trash2, X, Eye, Package, Cpu } from 'lucide-react';

export default function ProductsManager() {
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [products, setProducts] = useState<ProductMock[]>(MOCK_PRODUCTS);
  const [services, setServices] = useState<ServiceMock[]>(MOCK_SERVICES);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriceBasic, setFormPriceBasic] = useState(0);
  const [formCategory, setFormCategory] = useState('');

  // Handle open modal for create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormSlug('');
    setFormDesc('');
    setFormPriceBasic(0);
    setFormCategory('');
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSlug(item.slug);
    setFormDesc(item.description);
    setFormPriceBasic(item.priceBasic || 0);
    setFormCategory(item.category || '');
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (activeTab === 'products') {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  // Handle Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'products') {
      if (editingItem) {
        // Edit existing
        setProducts(products.map((p) => p.id === editingItem.id ? {
          ...p,
          title: formTitle,
          slug: formSlug,
          description: formDesc,
          priceBasic: formPriceBasic,
        } : p));
      } else {
        // Create new
        const newProduct: ProductMock = {
          id: 'p' + (products.length + 1),
          title: formTitle,
          slug: formSlug,
          description: formDesc,
          features: ['Self service admin dashboard', 'Automated webhooks setup'],
          specifications: { 'API': 'REST/GraphQL', 'Support': 'SLA contract' },
          priceBasic: formPriceBasic,
          pricePro: formPriceBasic * 2.5,
          priceEnterprise: formPriceBasic * 8,
          images: [],
        };
        setProducts([...products, newProduct]);
      }
    } else {
      if (editingItem) {
        setServices(services.map((s) => s.id === editingItem.id ? {
          ...s,
          title: formTitle,
          slug: formSlug,
          description: formDesc,
          category: formCategory,
        } : s));
      } else {
        const newService: ServiceMock = {
          id: 's' + (services.length + 1),
          title: formTitle,
          slug: formSlug,
          description: formDesc,
          content: 'Detailed outline of custom services.',
          category: formCategory || 'Software',
          benefits: ['Scalable infrastructure', '24/7 Monitoring'],
          technologies: ['React/Next.js', 'Kubernetes'],
          faqs: [{ question: 'How do we start?', answer: 'Contact our consultation team.' }],
          imageUrl: '',
        };
        setServices([...services, newService]);
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Products & Services Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Configure out-of-the-box SaaS product catalog rates and custom B2B services metadata.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === 'products' ? 'Product' : 'Service'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'products' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Products Catalog
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'services' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Cpu className="w-4 h-4 inline mr-2" />
          IT Services List
        </button>
      </div>

      {/* Data tables */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4 sm:p-5">Name / Slug</th>
              <th className="p-4 sm:p-5">Description</th>
              <th className="p-4 sm:p-5">
                {activeTab === 'products' ? 'Starting Price' : 'Category'}
              </th>
              <th className="p-4 sm:p-5 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {activeTab === 'products' ? (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-100">
                    <div>{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">/{item.slug}</div>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400 max-w-sm truncate">{item.description}</td>
                  <td className="p-4 sm:p-5 font-bold text-blue-400">${item.priceBasic}/mo</td>
                  <td className="p-4 sm:p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-450 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              services.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-100">
                    <div>{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">/{item.slug}</div>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400 max-w-sm truncate">{item.description}</td>
                  <td className="p-4 sm:p-5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border text-[9px] font-semibold text-slate-400 uppercase">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-450 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? 'Edit' : 'Create'} {activeTab === 'products' ? 'Product' : 'Service'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold">Title Name</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    placeholder={activeTab === 'products' ? 'e.g. Servixo Analytics Suite' : 'e.g. Custom Devops Automation'}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold">Slug Identifier</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    required
                    placeholder="e.g. devops-automation"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold">Description</label>
                  <textarea
                    rows={4}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    required
                    placeholder="Provide a comprehensive metadata summary..."
                    className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
                  />
                </div>

                {activeTab === 'products' ? (
                  <div className="space-y-2">
                    <label className="text-slate-400 font-semibold">Starting Price ($ / month)</label>
                    <input
                      type="number"
                      value={formPriceBasic}
                      onChange={(e) => setFormPriceBasic(Number(e.target.value))}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-slate-400 font-semibold">Service Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
                    >
                      <option value="">Select category...</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Software">Software</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="IT Consulting">IT Consulting</option>
                    </select>
                  </div>
                )}

                {/* Simulated file/image uploader */}
                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold block">Cover Image File</label>
                  <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center text-slate-500 hover:border-slate-700 transition-colors cursor-pointer">
                    <span className="font-semibold text-[10px]">Simulated Image Drag & Drop / Click to Upload</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
