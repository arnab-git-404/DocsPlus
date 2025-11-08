

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Mail,
  Download,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Building2,
  User,
  Calendar,
  CreditCard,
  Receipt,
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from '@/components/templates/Invoice';
import { toast } from 'react-hot-toast';

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientPincode: string;
  clientPhone: string;
  clientEmail: string;
  clientGSTIN: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyGSTIN: string;
  items: Array<{
    item: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  discount: number;
  discountType: string;
  discountAmount: number;
  cgst: number;
  sgst: number;
  cgstAmount: number;
  sgstAmount: number;
  total: number;
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  notes: string;
  terms: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
}

export default function ViewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);

      // Try to get from localStorage first
      const cachedData = localStorage.getItem(`invoice_${id}`);
      if (cachedData) {
        const cached = JSON.parse(cachedData);
        // Check if cache is less than 5 minutes old
        if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
          console.log('📦 Using cached invoice data');
          setInvoice(cached.data);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      console.log('🌐 Fetching invoice from API');
      const response = await fetch(`/api/invoice/${id}`);
      const data = await response.json();

      if (response.ok) {
        setInvoice(data.invoice);
        // Cache the data
        localStorage.setItem(
          `invoice_${id}`,
          JSON.stringify({
            data: data.invoice,
            timestamp: Date.now(),
          })
        );
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch invoice' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch invoice' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;

      const toastId = toast.loading("Downloading Invoice ...");


    try {
      setDownloadLoading(true);
      console.log('📥 Generating PDF...');

      // Generate PDF blob
      const blob = await pdf(<InvoiceDocument data={invoice} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'PDF downloaded successfully!' });
      toast.success("Invoice Downloaded Successfully !", { id: toastId });
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: 'Failed to download PDF' });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!confirm('Are you sure you want to send this invoice?')) return;

    const toastId = toast.loading(`Sending Invoice ...`);
    try {
      setActionLoading(true);
      const response = await fetch(`/api/invoice/${id}/email`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Invoice sent successfully!' });
        // Refresh data
        localStorage.removeItem(`invoice_${id}`);
        fetchInvoice();
        toast.success("Invoice Sent Successfully !", { id: toastId });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send invoice' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send invoice' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;

    const toastId = toast.loading("Deleting Invoice ...");

    try {
      setActionLoading(true);
      const response = await fetch(`/api/invoice/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Invoice deleted successfully' });
        localStorage.removeItem(`invoice_${id}`);
        setTimeout(() => {
          router.push('/dashboard/admin/invoices');
        }, 2000);
        toast.success("Invoice Deleted Successfully !", { id: toastId });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete invoice' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete invoice' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      SENT: { color: 'bg-blue-100 text-blue-800', icon: Mail },
      PAID: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const variant = variants[status] || variants.DRAFT;
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.color} flex items-center gap-1 text-base px-4 py-2`}>
        <Icon className="h-4 w-4" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Invoice Not Found</h3>
            <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()}>
              Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/dashboard/admin/invoices')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Invoice</h1>
              <p className="mt-1 font-mono">{invoice.invoiceNumber}</p>
            </div>
          </div>
          {getStatusBadge(invoice.status)}
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className={message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => window.open(`/preview?type=invoice&id=${id}`, '_blank')}
            variant="default"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/admin/invoices/edit/${id}`)}
            variant="outline"
            disabled={actionLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={actionLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Send Email
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            disabled={actionLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
                <p className="font-semibold text-lg">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Invoice Date</p>
                <p className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {new Date(invoice.invoiceDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                {getStatusBadge(invoice.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company & Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                From (Company)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">{invoice.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-medium">
                    {invoice.companyAddress}<br />
                    {invoice.companyCity}, {invoice.companyState} - {invoice.companyPincode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact</p>
                  <p className="font-medium">{invoice.companyPhone}</p>
                  <p className="font-medium">{invoice.companyEmail}</p>
                  {invoice.companyWebsite && <p className="font-medium">{invoice.companyWebsite}</p>}
                </div>
                {invoice.companyGSTIN && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">GSTIN</p>
                    <p className="font-semibold">{invoice.companyGSTIN}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Bill To (Client)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">{invoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-medium">
                    {invoice.clientAddress}<br />
                    {invoice.clientCity}, {invoice.clientState} - {invoice.clientPincode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact</p>
                  <p className="font-medium">{invoice.clientPhone}</p>
                  {invoice.clientEmail && <p className="font-medium">{invoice.clientEmail}</p>}
                </div>
                {invoice.clientGSTIN && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">GSTIN</p>
                    <p className="font-semibold">{invoice.clientGSTIN}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-sm">#</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">Item</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">Description</th>
                    <th className="text-center py-3 px-2 font-semibold text-sm">Qty</th>
                    <th className="text-right py-3 px-2 font-semibold text-sm">Rate</th>
                    <th className="text-right py-3 px-2 font-semibold text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b ">
                      <td className="py-3 px-2 text-sm">{index + 1}</td>
                      <td className="py-3 px-2 text-sm font-medium">{item.item}</td>
                      <td className="py-3 px-2 text-sm text-gray-600">{item.description}</td>
                      <td className="py-3 px-2 text-sm text-center">{item.quantity}</td>
                      <td className="py-3 px-2 text-sm text-right">₹{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-2 text-sm text-right font-medium">₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full md:w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{invoice.subtotal.toFixed(2)}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount ({invoice.discountType === 'PERCENTAGE' ? `${invoice.discount}%` : 'Fixed'}):
                    </span>
                    <span className="font-semibold text-red-600">-₹{invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CGST ({invoice.cgst}%):</span>
                  <span className="font-semibold">₹{invoice.cgstAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGST ({invoice.sgst}%):</span>
                  <span className="font-semibold">₹{invoice.sgstAmount.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold  px-4 py-3 rounded">
                  <span>Total:</span>
                  <span className="text-green-400">₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {invoice.paymentMethod && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold">{invoice.paymentMethod}</p>
                </div>
                {invoice.bankName && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                      <p className="font-semibold">{invoice.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Account Number</p>
                      <p className="font-semibold">{invoice.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">IFSC Code</p>
                      <p className="font-semibold">{invoice.ifscCode}</p>
                    </div>
                  </>
                )}
                {invoice.upiId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">UPI ID</p>
                    <p className="font-semibold">{invoice.upiId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes & Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoice.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Notes:</p>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {invoice.terms && (
              <>
                {invoice.notes && <Separator />}
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Terms & Conditions:</p>
                  <p className="whitespace-pre-wrap">{invoice.terms}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created on</p>
                <p className="font-semibold">
                  {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {invoice.sentAt && (
                <div>
                  <p className="text-gray-600">Sent on</p>
                  <p className="font-semibold">
                    {new Date(invoice.sentAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              {invoice.paidAt && (
                <div>
                  <p className="text-gray-600">Paid on</p>
                  <p className="font-semibold">
                    {new Date(invoice.paidAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}