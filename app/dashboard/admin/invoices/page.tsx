"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import InvoiceTable from './components/InvoiceTable';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';
import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from '@/components/templates/Invoice';


export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [invoiceByID, setInvoiceByID] = useState<any>(null);
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

//   const handleDownload = async (id: string) => {
//     // window.open(`/api/invoice/${id}/download`, '_blank');

//  try {
//       setLoading(true);

//       // Try to get from localStorage first
//       const cachedData = localStorage.getItem(`invoice_${id}`);
//       if (cachedData) {
//         const cached = JSON.parse(cachedData);
//         // Check if cache is less than 5 minutes old
//         if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
//           console.log('📦 Using cached invoice data');
//           setInvoiceByID(cached.data);
//           setLoading(false);
//           return;
//         }
//       }

//       // Fetch from API
//       console.log('🌐 Fetching invoice from API');
//       const response = await fetch(`/api/invoice/${id}`);
//       const data = await response.json();

//       if (response.ok) {
//         setInvoiceByID(data.invoice);
//         // Cache the data
//         localStorage.setItem(
//           `invoice_${id}`,
//           JSON.stringify({
//             data: data.invoice,
//             timestamp: Date.now(),
//           })
//         );
//       } else {
//         // setMessage({ type: 'error', text: data.error || 'Failed to fetch invoice' });
//         toast.error(data.error || 'Failed to fetch invoice');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch invoice');
//     } finally {
//       setLoading(false);
//     }


//     if (!invoiceByID) return;

//       const toastId = toast.loading("Downloading Invoice ...");


//     try {
//       // setDownloadLoading(true);
//       console.log('📥 Generating PDF...');

//       // Generate PDF blob
//       const blob = await pdf(<InvoiceDocument data={invoiceByID} />).toBlob();

//       // Create download link
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `${invoiceByID.invoiceNumber}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       // setMessage({ type: 'success', text: 'PDF downloaded successfully!' });
//       toast.success("Invoice Downloaded Successfully !", { id: toastId });
//     } catch (error) {
//       console.error('Download error:', error);
//       toast.error('Failed to download PDF');
//     } finally {
//       // setDownloadLoading(false);
//     }
//   };


const handleDownload = async (id: string) => {
  const toastId = toast.loading("Preparing Invoice...");

  try {
    // setLoading(true);

    let invoiceData;
    const cachedData = localStorage.getItem(`invoice_${id}`);
    if (cachedData) {
      const cached = JSON.parse(cachedData);
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        console.log("📦 Using cached invoice data");
        invoiceData = cached.data;
      }
    }

    if (!invoiceData) {
      console.log("🌐 Fetching invoice from API");
      const response = await fetch(`/api/invoice/${id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch invoice");

      invoiceData = data.invoice;
      localStorage.setItem(
        `invoice_${id}`,
        JSON.stringify({ data: invoiceData, timestamp: Date.now() })
      );
    }

    setInvoiceByID(invoiceData);

    console.log("📥 Generating PDF...");
    const blob = await pdf(<InvoiceDocument data={invoiceData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceData.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Invoice Downloaded Successfully!", { id: toastId });
  } catch (error: any) {
    console.error("❌ Download error:", error);
    toast.error(error.message || "Failed to download invoice", { id: toastId });
  } finally {
    // setLoading(false);
  }
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
          <Button onClick={() => router.push('/dashboard/invoices/new')}>
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