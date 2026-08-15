'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Key } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    contactEmail: '',
    contactPhone: '',
    companyAddress: '',
    defaultTheme: 'light',
    simplepayMerchantId: '',
    simplepaySecretKey: '',
    simplepayMerchantIdEUR: '',
    simplepaySecretKeyEUR: '',
    simplepayMerchantIdUSD: '',
    simplepaySecretKeyUSD: '',
    simplepayEnvironment: 'sandbox',
  });
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
            simplepayMerchantIdEUR: json.data.simplepayMerchantIdEUR || '',
            simplepaySecretKeyEUR: json.data.simplepaySecretKeyEUR || '',
            simplepayMerchantIdUSD: json.data.simplepayMerchantIdUSD || '',
            simplepaySecretKeyUSD: json.data.simplepaySecretKeyUSD || '',
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
        <p className="text-slate-600 dark:text-slate-400">Manage your core website configuration, contact details, and integrations.</p>
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
              SimplePay Configuration
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 pb-2">
              Manage your SimplePay (OTP Mobil) credentials. SimplePay requires different Merchant IDs for different currencies. Leave blank to use environment variables or Sandbox fallbacks.
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

              {/* HUF Credentials */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Hungarian Forint (HUF) Credentials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Merchant ID</label>
                    <input
                      type="text"
                      value={settings.simplepayMerchantId}
                      onChange={(e) => setSettings({ ...settings, simplepayMerchantId: e.target.value })}
                      placeholder="e.g. OMS57078401"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Secret Key</label>
                    <input
                      type="password"
                      value={settings.simplepaySecretKey}
                      onChange={(e) => setSettings({ ...settings, simplepaySecretKey: e.target.value })}
                      placeholder="••••••••••••••••••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* USD Credentials */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">US Dollar (USD) Credentials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Merchant ID</label>
                    <input
                      type="text"
                      value={settings.simplepayMerchantIdUSD}
                      onChange={(e) => setSettings({ ...settings, simplepayMerchantIdUSD: e.target.value })}
                      placeholder="Leave blank for test fallback"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Secret Key</label>
                    <input
                      type="password"
                      value={settings.simplepaySecretKeyUSD}
                      onChange={(e) => setSettings({ ...settings, simplepaySecretKeyUSD: e.target.value })}
                      placeholder="••••••••••••••••••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* EUR Credentials */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Euro (EUR) Credentials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Merchant ID</label>
                    <input
                      type="text"
                      value={settings.simplepayMerchantIdEUR}
                      onChange={(e) => setSettings({ ...settings, simplepayMerchantIdEUR: e.target.value })}
                      placeholder="Leave blank for test fallback"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Secret Key</label>
                    <input
                      type="password"
                      value={settings.simplepaySecretKeyEUR}
                      onChange={(e) => setSettings({ ...settings, simplepaySecretKeyEUR: e.target.value })}
                      placeholder="••••••••••••••••••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-sm text-indigo-800 dark:text-indigo-300">
              <span className="font-semibold text-indigo-900 dark:text-indigo-200">ℹ️ Note:</span> If these fields are empty, the system will fall back to `.env.local` variables or the default Sandbox credentials for testing.
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <div className={`text-sm font-medium ${message.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
              {message}
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
