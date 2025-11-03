"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import InvoiceForm from '../../components/InvoiceForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoice/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setInitialData(data.invoice);
      } else {
        setError('Invoice not found');
      }
    } catch (error) {
      setError('Failed to load invoice');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (invoiceData: any) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`/api/invoice/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update invoice');
      }

      setSuccess('Invoice updated successfully!');
      
      setTimeout(() => {
        router.push('/dashboard/invoice');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Invoice not found</p>
        <Button onClick={() => router.push('/dashboard/invoice')}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Invoice</h1>
          <p className="text-muted-foreground mt-2">
            Invoice Number: {initialData.invoiceNumber}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <InvoiceForm 
        onSubmit={handleSubmit} 
        loading={loading}
        initialData={initialData}
      />
    </div>
  );
}