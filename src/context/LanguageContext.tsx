'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'HU';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.products': 'Products',
    'nav.reviews': 'Clients & Reviews',
    'nav.contact': 'Contact Us',
    'nav.quote': 'Get a Quote',
    'nav.all_services': 'All Services →',
    'nav.browse_services': 'Browse our full capability list',
    'nav.cloud': 'Cloud Migration',
    'nav.software': 'Custom Software',
    'nav.cybersecurity': 'Cybersecurity',
    'nav.environmental': 'Environmental Services',

    'hero.badge': 'Enterprise IT & Software Engineering',
    'hero.title_pre': 'Engineered for',
    'hero.title_highlight': 'High-Performance',
    'hero.title_post': 'Enterprises',
    'hero.description': 'Servixo Solutions KFT provides bespoke software engineering, enterprise cloud migration, cybersecurity audits, and sustainable IT solutions based in Budapest, Hungary.',
    'common.buy_now': 'Buy Now',
    'common.view_details': 'View Details',
    'common.starting_at': 'Starting at',
    'common.per_month': '/mo',
    'common.key_capabilities': 'Key Capabilities Included:',
    'common.request_demo': 'Request a Demo',
    'common.view_pricing': 'View Pricing',

    'checkout.summary_title': 'Order Summary',
    'checkout.tier': 'Plan / Tier',
    'checkout.payment_provider': 'Payment Provider',
    'checkout.currency': 'Currency',
    'checkout.gross_total': 'Gross Total (VAT incl.)',
    'checkout.ssl_badge': '256-bit SSL Encrypted Secure Checkout',
    'checkout.instant_badge': 'Instant Confirmation & Invoicing',
    'checkout.billing_title': 'Billing & Customer Details',
    'checkout.billing_subtitle': 'Please provide your invoice details before proceeding to payment.',
    'checkout.section_1': '1. Personal / Contact Details',
    'checkout.full_name': 'Full Name *',
    'checkout.email': 'Email Address (for access) *',
    'checkout.phone': 'Phone Number',
    'checkout.section_2': '2. Company Details',
    'checkout.company_name': 'Company Name',
    'checkout.tax_number': 'Tax / VAT Number',
    'checkout.section_3': '3. Billing Address',
    'checkout.address': 'Street Address',
    'checkout.zip': 'Postal Code / ZIP',
    'checkout.city': 'City',
    'checkout.country': 'Country',
    'checkout.declaration_title': 'Data Transfer Declaration',
    'checkout.declaration_text': 'I acknowledge that the personal data stored in the user database of servixosolutionskft.com by Servixo Solutions Kft. (1081 Budapest, Rákóczi út 63.) as data controller will be transferred to OTP Mobil Kft. (1143 Budapest, Hungária krt. 17-19.) as data processor.',
    'checkout.declaration_privacy_link': 'View SimplePay Privacy Policy',
    'checkout.declaration_consent': 'I expressly accept the Data Transfer Declaration and General Terms & Conditions. *',
    'checkout.submit_btn': 'Proceed to Secure SimplePay Checkout',
    'checkout.redirecting': 'Redirecting to SimplePay checkout…',
    'checkout.required_error': 'Please fill in all required fields!',
    'checkout.consent_error': 'You must accept the data transfer declaration to proceed.',

    'quote.title': 'Request a Project Quote',
    'quote.subtitle': 'Tell us about your project requirements and our engineering team will get back to you within 24 hours.',
    'quote.submit': 'Submit Quote Request',

    'footer.company_desc': 'Enterprise software engineering, cloud transformation, cybersecurity audits, and digital innovation headquartered in Budapest, Hungary.',
    'footer.quick_links': 'Quick Links',
    'footer.legal': 'Legal & Compliance',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.terms': 'Terms & Policies',
    'footer.all_rights': 'All rights reserved.',
  },
  HU: {
    'nav.home': 'Főoldal',
    'nav.about': 'Rólunk',
    'nav.services': 'Szolgáltatások',
    'nav.products': 'Termékek',
    'nav.reviews': 'Ügyfelek és Értékelések',
    'nav.contact': 'Kapcsolat',
    'nav.quote': 'Ajánlatkérés',
    'nav.all_services': 'Összes szolgáltatás →',
    'nav.browse_services': 'Fedezze fel szolgáltatásainkat',
    'nav.cloud': 'Felhő Migráció',
    'nav.software': 'Egyedi Szoftverfejlesztés',
    'nav.cybersecurity': 'Kiberbiztonság',
    'nav.environmental': 'Környezetvédelmi Szolgáltatások',

    'hero.badge': 'Vállalati Informatikai & Szoftvermérnöki Megoldások',
    'hero.title_pre': 'Tervezve a',
    'hero.title_highlight': 'Nagy Teljesítményű',
    'hero.title_post': 'Vállalkozásoknak',
    'hero.description': 'A Servixo Solutions KFT egyedi szoftverfejlesztést, vállalati felhőmigrációt, kiberbiztonsági auditokat és fenntartható IT megoldásokat nyújt Budapestről.',
    'common.buy_now': 'Megvásárlás',
    'common.view_details': 'Részletek megtekintése',
    'common.starting_at': 'Kezdő ár',
    'common.per_month': '/hó',
    'common.key_capabilities': 'Főbb funkciók és modulok:',
    'common.request_demo': 'Demó Kérése',
    'common.view_pricing': 'Árak megtekintése',

    'checkout.summary_title': 'Rendelés összegzése',
    'checkout.tier': 'Csomag / Tier',
    'checkout.payment_provider': 'Fizetési szolgáltató',
    'checkout.currency': 'Pénznem',
    'checkout.gross_total': 'Fizetendő összeg (ÁFA-val)',
    'checkout.ssl_badge': '256-bites SSL titkosítású biztonságos fizetés',
    'checkout.instant_badge': 'Azonnali visszaigazolás és számlázás',
    'checkout.billing_title': 'Számlázási és ügyféladatok',
    'checkout.billing_subtitle': 'Kérjük, adja meg a számla kiállításához szükséges adatait a fizetés megkezdése előtt.',
    'checkout.section_1': '1. Személyes / Kapcsolattartó adatok',
    'checkout.full_name': 'Teljes név *',
    'checkout.email': 'E-mail cím (hozzáféréshez) *',
    'checkout.phone': 'Telefonszám',
    'checkout.section_2': '2. Céges adatok',
    'checkout.company_name': 'Cégnév',
    'checkout.tax_number': 'Adószám',
    'checkout.section_3': '3. Számlázási cím',
    'checkout.address': 'Utca, házszám',
    'checkout.zip': 'Irányítószám',
    'checkout.city': 'Város',
    'checkout.country': 'Ország',
    'checkout.declaration_title': 'Adattovábbítási nyilatkozat',
    'checkout.declaration_text': 'Tudomásul veszem, hogy a Servixo Solutions Kft. (1081 Budapest, Rákóczi út 63.) adatkezelő által a(z) servixosolutionskft.com felhasználói adatbázisában tárolt alábbi személyes adataim átadásra kerülnek az OTP Mobil Kft. (1143 Budapest, Hungária krt. 17-19.), mint adatfeldolgozó részére.',
    'checkout.declaration_privacy_link': 'SimplePay Adatkezelési tájékoztató megtekintése',
    'checkout.declaration_consent': 'Kifejezetten elfogadom az Adattovábbítási nyilatkozatot és az Általános Szerződési Feltételeket. *',
    'checkout.submit_btn': 'Tovább a biztonságos SimplePay fizetéshez',
    'checkout.redirecting': 'Átirányítás a SimplePay felületére…',
    'checkout.required_error': 'Kérjük, töltse ki a kötelező mezőket!',
    'checkout.consent_error': 'A fizetéshez el kell fogadnia az adattovábbítási nyilatkozatot.',

    'quote.title': 'Kérjen Egyedi Ajánlatot',
    'quote.subtitle': 'Írja le projektje igényeit, és mérnökcsapatunk 24 órán belül felveszi Önnel a kapcsolatot.',
    'quote.submit': 'Ajánlatkérés elküldése',

    'footer.company_desc': 'Vállalati szoftvermérnöki megoldások, felhő transzformáció, kiberbiztonsági auditok és digitális innováció Budapest központtal.',
    'footer.quick_links': 'Gyorshivatkozások',
    'footer.legal': 'Jogi információk',
    'footer.privacy_policy': 'Adatvédelmi tájékoztató',
    'footer.terms': 'Általános Szerződési Feltételek',
    'footer.all_rights': 'Minden jog fenntartva.',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('servixo_lang') as Language;
    if (saved === 'EN' || saved === 'HU') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('servixo_lang', lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
