'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Info } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    contactEmail: '',
    contactPhone: '',
    companyAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // We are using hardcoded state for now until the API is fully wired
  // since this is a placeholder implementation.
  useEffect(() => {
    // In a real implementation, you would fetch from /api/settings here
    setSettings({
      contactEmail: 'info@servixosolutions.com',
      contactPhone: '+1 (555) 123-4567',
      companyAddress: 'Budapest, Hungary',
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    
    setSaving(false);
    setMessage('Settings successfully saved! (Mocked for now)');
    setTimeout(() => setMessage(''), 3000);
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Settings</h1>
        <p className="text-slate-400">Manage your core website configuration and contact details.</p>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-200">
          <strong>Note:</strong> This is currently a frontend placeholder interface. The backend API integration for the Settings table will be completed in the next phase.
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">Contact Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Public Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Public Phone Number</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Company Address</label>
                <textarea
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="text-sm text-green-400 font-medium">
              {message}
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
