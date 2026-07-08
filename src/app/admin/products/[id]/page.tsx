'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ProductForm from '../ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setProduct(json.data);
        } else {
          setError(json.error || 'Product not found');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Network error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 bg-red-400/10 px-6 py-4 rounded-xl font-medium border border-red-500/20">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return <ProductForm initialData={product} />;
}
