"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InvoiceForm from '../components/InvoiceForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (invoiceData: any) => {
    setError('');
    setSuccess('');
    setLoading(true);
      const toastId = toast.loading("Creating Invoice ...");
    try {
      const response = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invoice');
      }

      localStorage.clear();
      setSuccess('Invoice created successfully!');
      toast.success("Invoice Created Successfully !", { id: toastId });
      setTimeout(() => {
        if (invoiceData.status === 'SENT') {
          router.push(`/dashboard/invoices/view/${data.invoice._id}`);
        } else {
          router.push('/dashboard/invoices');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Invoice</h1>
          <p className="text-muted-foreground mt-2">
            Generate a professional invoice for your client
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

      <InvoiceForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}