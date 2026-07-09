'use client';

import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  productName: string;
  planTier: string;
  price: string | number;
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
  featured,
  className,
  interval = 'month',
  children,
  autoTrigger
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (autoTrigger && !hasTriggered.current) {
      hasTriggered.current = true;
      handleCheckout();
    }
  }, [autoTrigger]);

  const handleCheckout = async () => {
    if (price === 'Custom') {
      window.location.href = '/quote';
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          planTier,
          price,
          interval,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.mock && data.url) {
        window.location.href = data.url;
        return;
      }

      if (!data.publicKey) {
        alert('Stripe public key is missing.');
        return;
      }

      const stripe = await loadStripe(data.publicKey);
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await (stripe as any).redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        alert(error.message);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

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
