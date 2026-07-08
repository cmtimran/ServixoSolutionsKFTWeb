'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ServiceForm from '../ServiceForm';

export default function EditServicePage() {
  const params = useParams();
  const id = params.id as string;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/services/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setService(json.data);
        } else {
          setError(json.error || 'Service not found');
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

  if (error || !service) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 bg-red-400/10 px-6 py-4 rounded-xl font-medium border border-red-500/20">
          {error || 'Service not found'}
        </div>
      </div>
    );
  }

  return <ServiceForm initialData={service} />;
}
