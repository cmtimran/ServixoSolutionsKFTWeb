'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Key, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    contactEmail: '',
    contactPhone: '',
    companyAddress: '',
    defaultTheme: 'light',
    simplepayMerchantId: '',
    simplepaySecretKey: '',
    simplepayEnvironment: 'sandbox',
  });
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setSettings({
            contactEmail: json.data.contactEmail || '',
            contactPhone: json.data.contactPhone || '',
            companyAddress: json.data.companyAddress || '',
            defaultTheme: json.data.defaultTheme || 'light',
            simplepayMerchantId: json.data.simplepayMerchantId || '',
            simplepaySecretKey: json.data.simplepaySecretKey || '',
            simplepayEnvironment: json.data.simplepayEnvironment || 'sandbox',
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage('Settings successfully saved to database!');
      } else {
        setMessage('Error saving settings.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Platform Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your core website configuration, contact details, and SimplePay integration.</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <form onSubmit={handleSave} className="max-w-2xl space-y-10">
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-2">Contact Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Public Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="info@servixosolutions.com"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Public Phone Number</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Address</label>
                <textarea
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                  rows={3}
                  placeholder="Budapest, Hungary"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Site Appearance */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              Site Appearance
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 pb-2">Configure the default look and feel for visitors.</p>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default Theme</label>
                <select
                  value={settings.defaultTheme}
                  onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="light">Light Mode (Bright)</option>
                  <option value="dark">Dark Mode</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-500">Users can still toggle the theme manually using the icon in the header.</p>
              </div>
            </div>
          </div>

          {/* SimplePay Integration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              SimplePay Configuration (HUF)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 pb-2">
              Manage your OTP Mobil SimplePay (HUF) credentials.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Environment</label>
                <select
                  value={settings.simplepayEnvironment}
                  onChange={(e) => setSettings({ ...settings, simplepayEnvironment: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="live">Live (Production)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Merchant ID (HUF)</label>
                <input
                  type="text"
                  value={settings.simplepayMerchantId}
                  onChange={(e) => setSettings({ ...settings, simplepayMerchantId: e.target.value })}
                  placeholder="e.g. OMS57078401"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Secret Key</label>
                <div className="relative">
                  <input
                    type={showSecretKey ? "text" : "password"}
                    value={settings.simplepaySecretKey}
                    onChange={(e) => setSettings({ ...settings, simplepaySecretKey: e.target.value })}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={showSecretKey ? "Hide Secret Key" : "Show Secret Key"}
                  >
                    {showSecretKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-sm text-indigo-800 dark:text-indigo-300">
              <span className="font-semibold text-indigo-900 dark:text-indigo-200">ℹ️ Note:</span> Default merchant ID is <code>OMS57078401</code>.
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <div className={`text-sm font-medium ${message.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
              {message}
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
