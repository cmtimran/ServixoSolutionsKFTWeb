'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  productName: string;
  planTier: string;
  price: string | number;
  currency?: string;
  featured?: boolean;
  className?: string;
  interval?: 'month' | 'year';
  children?: React.ReactNode;
  autoTrigger?: boolean;
}

export default function CheckoutButton({ 
  productName, 
  planTier, 
  price, 
  currency = 'USD',
  featured,
  className = '',
  interval = 'month',
  children,
  autoTrigger
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const hasTriggered = useRef(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (price === 'Custom') {
      window.location.href = '/quote';
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        productName,
        planTier,
        price: price.toString(),
        currency,
        interval
      });
      router.push(`/checkout/simplepay-pay?${params.toString()}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'An error occurred during checkout.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoTrigger && !hasTriggered.current) {
      hasTriggered.current = true;
      handleCheckout();
    }
  }, [autoTrigger]);

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${className || ''} ${loading ? 'opacity-70 cursor-not-allowed' : ''} flex items-center justify-center gap-2`}
      style={featured && !className?.includes('style-override') ? { color: 'var(--brand-indigo)' } : {}}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children || 'Buy Now'}
    </button>
  );
}
