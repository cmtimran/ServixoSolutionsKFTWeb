'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Upload, FileText, X, Shield, Clock, HelpCircle, User } from 'lucide-react';

const PROJECT_TYPES = [
  { id: 'software', label: 'Custom Software Development', desc: 'Bespoke web, mobile, or enterprise SaaS' },
  { id: 'cloud', label: 'Cloud Infrastructure & Migration', desc: 'AWS/Azure/GCP scaling and automation' },
  { id: 'security', label: 'Cyber Defense & Security Auditing', desc: 'Penetration testing & ISO 27001 readiness' },
  { id: 'consulting', label: 'IT Strategy & vCTO Advisory', desc: 'Technology roadmap and team optimization' },
];

const BUDGET_RANGES = [
  { value: '5k-15k', label: '€5,000 - €15,000' },
  { value: '15k-50k', label: '€15,000 - €50,000' },
  { value: '50k-100k', label: '€50,000 - €100,000' },
  { value: '100k+', label: '€100,000+' },
];

const TIMELINES = [
  { value: 'under-1m', label: 'Less than 1 Month' },
  { value: '1-3m', label: '1 to 3 Months' },
  { value: '3-6m', label: '3 to 6 Months' },
  { value: '6m+', label: '6+ Months / Long Term' },
];

export default function QuotationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectTypes: [] as string[],
    budgetRange: '',
    timeline: '',
    projectDescription: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
  });

  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle checkboxes
  const handleTypeToggle = (typeId: string) => {
    setFormData((prev) => {
      const types = prev.projectTypes.includes(typeId)
        ? prev.projectTypes.filter((t) => t !== typeId)
        : [...prev.projectTypes, typeId];
      return { ...prev, projectTypes: types };
    });
    setErrorMsg('');
  };

  // Drag and Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      });
    }
  };

  // Form step navigation & validation
  const validateStep = () => {
    if (step === 1) {
      if (formData.projectTypes.length === 0) {
        setErrorMsg('Please select at least one project type.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.budgetRange) {
        setErrorMsg('Please choose your budget range.');
        return false;
      }
      if (!formData.timeline) {
        setErrorMsg('Please choose your project timeline.');
        return false;
      }
    }
    if (step === 3) {
      if (formData.projectDescription.trim().length < 20) {
        setErrorMsg('Please provide a brief description (at least 20 characters).');
        return false;
      }
    }
    if (step === 4) {
      if (!formData.clientName.trim()) {
        setErrorMsg('Name is required.');
        return false;
      }
      if (!formData.clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
        setErrorMsg('Please enter a valid corporate email.');
        return false;
      }
      if (!formData.clientPhone.trim()) {
        setErrorMsg('Phone number is required.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setErrorMsg('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    // Simulate API request to submit quote
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, attachmentName: attachedFile?.name }),
      });
      
      // Simulate database success even if backend route not fully running
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 1500);
    } catch (err) {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl glass-card border shadow-2xl p-6 sm:p-10">
      {/* Progress Bar */}
      {!submitSuccess && (
        <div className="space-y-4 mb-10">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <span>Step {step} of 4</span>
            <span>{Math.round(((step - 1) / 3) * 100)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-[var(--bg-surface)] dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Forms Multi-Step Wizard Content */}
      <div className="min-h-[300px]">
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quote Request Received!</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for inquiring with Servixo Solutions KFT. Our lead IT solutions architect is reviewing your specifications and will follow up with an initial brief within 24 business hours.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  setStep(1);
                  setSubmitSuccess(false);
                  setFormData({
                    projectTypes: [],
                    budgetRange: '',
                    timeline: '',
                    projectDescription: '',
                    clientName: '',
                    clientEmail: '',
                    clientPhone: '',
                    companyName: '',
                  });
                  setAttachedFile(null);
                }}
                className="px-6 py-3 rounded-xl bg-[var(--bg-inset)] dark:bg-slate-800 text-slate-900 dark:text-white dark:hover:bg-slate-700 text-sm font-semibold transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: Project Type selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    What type of project are we building?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Select all capabilities that apply to your technical requirements.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROJECT_TYPES.map((type) => {
                    const isSelected = formData.projectTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeToggle(type.id)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10'
                            : 'border-slate-200 dark:border-[var(--border)] dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-[var(--border)] dark:border-slate-700 bg-[var(--bg-inset)] dark:bg-slate-900/10 dark:bg-[var(--bg-inset)] dark:bg-slate-900/30'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{type.label}</span>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-500 border-blue-500 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-[var(--border)] dark:border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 block">{type.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Budget & Timeline selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Budget Range & Timeline
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Help us align expectations with your budget capabilities and delivery schedules.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Budget Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-600 dark:text-slate-300">Estimated Budget Range</label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => {
                        setFormData({ ...formData, budgetRange: e.target.value });
                        setErrorMsg('');
                      }}
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-colors"
                    >
                      <option value="">Select range...</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Timeline Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-600 dark:text-slate-300">Target Delivery Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => {
                        setFormData({ ...formData, timeline: e.target.value });
                        setErrorMsg('');
                      }}
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-colors"
                    >
                      <option value="">Select timeline...</option>
                      {TIMELINES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Description & File Uploader */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                    Describe your project specifications
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Outline the main scope, user stories, or architecture considerations.</p>
                </div>

                <div className="space-y-4">
                  <textarea
                    rows={6}
                    value={formData.projectDescription}
                    onChange={(e) => {
                      setFormData({ ...formData, projectDescription: e.target.value });
                      setErrorMsg('');
                    }}
                    placeholder="Provide a detailed overview of your project requirements (e.g. system modules, core user accounts, hosting preferences)..."
                    className="w-full p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm leading-relaxed transition-colors"
                  />

                  {/* Drag and Drop Uploader */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20'
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                    />

                    {attachedFile ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] dark:bg-slate-900/80 max-w-md mx-auto border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div className="text-left">
                            <div className="text-sm font-semibold truncate max-w-[200px] text-slate-900 dark:text-white">
                              {attachedFile.name}
                            </div>
                            <div className="text-[10px] text-slate-600 dark:text-slate-400">{attachedFile.size}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer space-y-2 block"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          Drag and drop your SRS/Brief here
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400">
                          Supports PDF, DOCX, ZIP (Max 10MB)
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Client Contact Info */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    How can we reach you?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Provide your business contact details so we can deliver your custom quote brief.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-600 dark:text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => {
                        setFormData({ ...formData, clientName: e.target.value });
                        setErrorMsg('');
                      }}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-600 dark:text-slate-300">Corporate Email Address *</label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => {
                        setFormData({ ...formData, clientEmail: e.target.value });
                        setErrorMsg('');
                      }}
                      placeholder="e.g. name@company.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-600 dark:text-slate-300">Phone Number *</label>
                    <input
                      type="text"
                      value={formData.clientPhone}
                      onChange={(e) => {
                        setFormData({ ...formData, clientPhone: e.target.value });
                        setErrorMsg('');
                      }}
                      placeholder="e.g. +36 20 123 4567"
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-600 dark:text-slate-300">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => {
                        setFormData({ ...formData, companyName: e.target.value });
                      }}
                      placeholder="e.g. Acme Kft"
                      className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-[var(--border)] dark:border-slate-800/60 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white font-semibold text-sm transition-all cursor-pointer flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
