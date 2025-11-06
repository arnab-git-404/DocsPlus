"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import InvoiceTable from './components/InvoiceTable';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoice');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices);
      }
    } catch (error) {
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/admin/invoices/view/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/invoices/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const response = await fetch(`/api/invoice/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInvoices();
      }
    } catch (error) {
      setError('Failed to delete invoice');
    }
  };

  const handleDownload = (id: string) => {
    window.open(`/api/invoice/${id}/download`, '_blank');
  };

  const handleEmail = async (id: string) => {
    try {
      const response = await fetch(`/api/invoice/${id}/email`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Invoice sent successfully!');
      }
    } catch (error) {
      setError('Failed to send invoice');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Invoices
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage client invoices
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/invoices/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No invoices found</p>
          <Button onClick={() => router.push('/dashboard/invoice/new')}>
            Create Your First Invoice
          </Button>
        </div>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onEmail={handleEmail}
        />
      )}
    </div>
  );
}