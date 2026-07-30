'use client';

import { useState, useEffect } from 'react';

import { Loader2, Save, FileText } from 'lucide-react';


export default function LegalSettingsPage() {
  const [settings, setSettings] = useState({
    privacy_policy_content: '',
    terms_and_policies_content: '',
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
            privacy_policy_content: json.data.privacy_policy_content || '',
            terms_and_policies_content: json.data.terms_and_policies_content || '',
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
        setMessage('Legal policies successfully saved to database!');
      } else {
        setMessage('Error saving policies.');
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Legal Pages</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage the content of your Privacy Policy and Terms & Policies pages.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* Privacy Policy Editor */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Privacy Policy</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This content will be displayed on the public /privacy-policy page.</p>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <textarea 
              value={settings.privacy_policy_content}
              onChange={(e) => setSettings({ ...settings, privacy_policy_content: e.target.value })}
              className="w-full h-[400px] p-4 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none resize-none font-mono text-sm"
              placeholder="Enter HTML content for Privacy Policy..."
            />
          </div>
        </div>

        {/* Terms and Policies Editor */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Terms and Policies</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This content will be displayed on the public /terms-and-policies page.</p>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <textarea 
              value={settings.terms_and_policies_content}
              onChange={(e) => setSettings({ ...settings, terms_and_policies_content: e.target.value })}
              className="w-full h-[400px] p-4 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none resize-none font-mono text-sm"
              placeholder="Enter HTML content for Terms and Policies..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div className={`text-sm font-medium ${message.includes('Error') ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {message}
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Publish Changes
          </button>
        </div>
      </form>
    </div>
  );
}
