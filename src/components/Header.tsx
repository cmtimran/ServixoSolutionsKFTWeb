'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, ChevronDown, Award, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [darkMode, setDarkMode] = useState(true); // Dark mode default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Apply dark class by default
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setProductsDropdownOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel border-b py-4 shadow-lg'
          : 'bg-white dark:bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-white dark:to-slate-200">
                SERVIXO
              </span>
              <span className="text-xs block text-slate-700 dark:text-slate-400 font-semibold tracking-widest uppercase">
                Solutions KFT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-300'
              }`}
            >
              Home
            </Link>
            
            <Link
              href="/about"
              className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                pathname === '/about' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-300'
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-slate-300 hover:text-blue-500 transition-colors cursor-pointer py-2"
              >
                Services <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-64 rounded-2xl glass-card p-2 shadow-xl border border-slate-200/80 dark:border-slate-800/80"
                  >
                    <div className="grid gap-1">
                      <Link
                        href="/services"
                        className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 transition-colors"
                      >
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-blue-500">All Services →</div>
                          <div className="text-[10px] text-slate-500">Browse our full capability list</div>
                        </div>
                      </Link>
                      <Link
                        href="/services/cloud-migration"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Cloud Migration</div>
                          <div className="text-[10px] text-slate-500">Scale on secure cloud infrastructure</div>
                        </div>
                      </Link>
                      <Link
                        href="/services/custom-software"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Software Dev</div>
                          <div className="text-[10px] text-slate-500">Premium bespoke applications</div>
                        </div>
                      </Link>
                      <Link
                        href="/services/cybersecurity"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Cybersecurity</div>
                          <div className="text-[10px] text-slate-500">Lock down your core infrastructure</div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-slate-300 hover:text-blue-500 transition-colors cursor-pointer py-2"
              >
                Products <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {productsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setProductsDropdownOpen(true)}
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-64 rounded-2xl glass-card p-2 shadow-xl border border-slate-200/80 dark:border-slate-800/80"
                  >
                    <div className="grid gap-1">
                      <Link
                        href="/products"
                        className="p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 transition-colors block"
                      >
                        <div className="text-sm font-semibold text-indigo-500">All Products →</div>
                        <div className="text-[10px] text-slate-500">Browse our full product catalog</div>
                      </Link>
                      <Link
                        href="/products/servixo-erp"
                        className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors block"
                      >
                        <div className="text-sm font-semibold">Servixo CoreERP</div>
                        <div className="text-[10px] text-slate-500">Enterprise resource & inventory management</div>
                      </Link>
                      <Link
                        href="/products/guardx-security"
                        className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors block"
                      >
                        <div className="text-sm font-semibold">GuardX Cyber Sentinel</div>
                        <div className="text-[10px] text-slate-500">Real-time endpoint antivirus agent</div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/reviews"
              className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                pathname === '/reviews' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-300'
              }`}
            >
              Clients & Reviews
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-medium hover:text-blue-500 transition-colors ${
                pathname === '/contact' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-300'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <Link
              href="/quote"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-200"
            >
              Get a Quote
            </Link>
            {/* Quick Admin panel link */}
            <Link
              href="/admin"
              className="text-xs text-slate-400 hover:text-blue-500 transition-colors border-l pl-4 border-slate-300 dark:border-slate-800"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              <Link
                href="/"
                className="block px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-base font-semibold"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-base font-semibold"
              >
                About Us
              </Link>
              
              <div className="border-t border-slate-200/30 dark:border-slate-800/30 my-2 pt-2">
                <span className="block px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Services</span>
                <Link
                  href="/services/cloud-migration"
                  className="block px-6 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-sm"
                >
                  Cloud Migration
                </Link>
                <Link
                  href="/services/custom-software"
                  className="block px-6 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-sm"
                >
                  Custom Software Dev
                </Link>
                <Link
                  href="/services/cybersecurity"
                  className="block px-6 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-sm"
                >
                  Cyber Defense & Security
                </Link>
              </div>

              <div className="border-t border-slate-200/30 dark:border-slate-800/30 my-2 pt-2">
                <span className="block px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Products</span>
                <Link
                  href="/products/servixo-erp"
                  className="block px-6 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-sm"
                >
                  Servixo CoreERP
                </Link>
                <Link
                  href="/products/guardx-security"
                  className="block px-6 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-sm"
                >
                  GuardX Sentinel
                </Link>
              </div>

              <Link
                href="/reviews"
                className="block px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-base font-semibold"
              >
                Reviews
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-base font-semibold"
              >
                Contact Us
              </Link>

              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/quote"
                  className="w-full text-center py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/admin"
                  className="w-full text-center py-2 text-xs text-slate-400 font-semibold border border-dashed rounded-xl"
                >
                  Go to Admin Panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
