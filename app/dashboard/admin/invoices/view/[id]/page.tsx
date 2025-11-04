"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Printer, Mail, Edit, Loader2 } from 'lucide-react';
import Image from 'next/image';

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
  status: string;
}

export default function ViewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoice/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.invoice);
      } else {
        setError('Invoice not found');
      }
    } catch (error) {
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.open(`/api/invoice/${params.id}/download`, '_blank');
  };

  const handleEmail = async () => {
    try {
      const response = await fetch(`/api/invoice/${params.id}/email`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Invoice sent successfully!');
      } else {
        alert('Failed to send invoice');
      }
    } catch (error) {
      alert('Failed to send invoice');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error || 'Invoice not found'}</p>
        <Button onClick={() => router.push('/dashboard/invoices')}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Action Buttons - Hidden on Print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/invoices')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/invoices/edit/${params.id}`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                 window.open(`/preview?type=invoice&id=${params.id}`, '_blank');
                }}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Preview
              </Button>

              <Button
                variant="outline"
                onClick={handleEmail}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="container mx-auto px-4 py-8 print:p-0" id="printable-area">
        <Card className="max-w-5xl mx-auto bg-white shadow-lg print:shadow-none print:border-0">
          <div ref={printRef} className="p-12 print:p-12">
            {/* Header with Company Logo and Details */}
            <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-blue-600">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">HS</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-600">{invoice.companyName}</h1>
                  <p className="text-sm text-gray-600 mt-1">{invoice.companyWebsite}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
                <p className="text-sm text-gray-600">Invoice No: <span className="font-semibold">{invoice.invoiceNumber}</span></p>
                <p className="text-sm text-gray-600">Date: <span className="font-semibold">{new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}</span></p>
                <Badge className={`mt-2 ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </Badge>
              </div>
            </div>

            {/* Bill From and Bill To */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Company Details */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3 uppercase tracking-wide">
                  {invoice.companyName}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{invoice.companyAddress}</p>
                  <p>{invoice.companyCity}, {invoice.companyState} - {invoice.companyPincode}</p>
                  <p className="mt-2">Phone: {invoice.companyPhone}</p>
                  <p>Email: {invoice.companyEmail}</p>
                  {invoice.companyGSTIN && (
                    <p className="mt-2">GSTIN: <span className="font-semibold">{invoice.companyGSTIN}</span></p>
                  )}
                </div>
              </div>

              {/* Client Details */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-3 uppercase tracking-wide">
                  Bill To:
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-bold text-gray-800 text-base">{invoice.clientName}</p>
                  <p>{invoice.clientAddress}</p>
                  <p>{invoice.clientCity}, {invoice.clientState} - {invoice.clientPincode}</p>
                  <p className="mt-2">Phone: {invoice.clientPhone}</p>
                  {invoice.clientEmail && <p>Email: {invoice.clientEmail}</p>}
                  {invoice.clientGSTIN && (
                    <p className="mt-2">GSTIN: <span className="font-semibold">{invoice.clientGSTIN}</span></p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-blue-700 px-4 py-3 text-left text-sm font-semibold">#</th>
                    <th className="border border-blue-700 px-4 py-3 text-left text-sm font-semibold">ITEM</th>
                    <th className="border border-blue-700 px-4 py-3 text-left text-sm font-semibold">DESCRIPTION</th>
                    <th className="border border-blue-700 px-4 py-3 text-center text-sm font-semibold">QTY</th>
                    <th className="border border-blue-700 px-4 py-3 text-right text-sm font-semibold">RATE</th>
                    <th className="border border-blue-700 px-4 py-3 text-right text-sm font-semibold">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.item}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.description}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-right">₹{item.rate.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-right font-medium">₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{invoice.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="text-gray-600">
                        Discount ({invoice.discountType === 'PERCENTAGE' ? `${invoice.discount}%` : 'Fixed'}):
                      </span>
                      <span className="font-semibold text-red-600">-₹{invoice.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">CGST ({invoice.cgst}%):</span>
                    <span className="font-semibold">₹{invoice.cgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">SGST ({invoice.sgst}%):</span>
                    <span className="font-semibold">₹{invoice.sgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold pt-2 bg-blue-50 px-4 py-3 rounded">
                    <span>Total:</span>
                    <span className="text-blue-600">₹{invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {invoice.paymentMethod && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800 mb-3">PAYMENT METHOD:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Method: <span className="font-semibold text-gray-800">{invoice.paymentMethod}</span></p>
                    {invoice.bankName && (
                      <>
                        <p className="text-gray-600 mt-2">Bank: <span className="font-semibold text-gray-800">{invoice.bankName}</span></p>
                        <p className="text-gray-600">Account No: <span className="font-semibold text-gray-800">{invoice.accountNumber}</span></p>
                        <p className="text-gray-600">IFSC Code: <span className="font-semibold text-gray-800">{invoice.ifscCode}</span></p>
                      </>
                    )}
                  </div>
                  {invoice.upiId && (
                    <div>
                      <p className="text-gray-600">UPI ID: <span className="font-semibold text-gray-800">{invoice.upiId}</span></p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes and Terms */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {invoice.notes && (
                <div>
                  <h4 className="font-bold text-sm text-gray-800 mb-2">Notes:</h4>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="font-bold text-sm text-gray-800 mb-2">Terms & Conditions:</h4>
                  <p className="text-sm text-gray-600">{invoice.terms}</p>
                </div>
              )}
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-12 border-t">
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2 px-8">
                  <p className="font-semibold text-sm">Mr.Pratyush Kumar Jha</p>
                  <p className="text-xs text-gray-600">AUTHORIZED SIGNATORY</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2 px-8">
                  <p className="font-semibold text-sm">Mr.Pratyush Kumar Jha</p>
                  <p className="text-xs text-gray-600">PAYMENT COLLECTOR SIGNATURE</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center">
              <p className="text-xs text-gray-500">
                This is a computer-generated invoice. No signature is required.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                For queries, contact: {invoice.companyEmail} | {invoice.companyPhone}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body * {
            visibility: hidden;
          }
          
          #printable-area,
          #printable-area * {
            visibility: visible;
          }
          
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          #printable-area .max-w-5xl {
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}