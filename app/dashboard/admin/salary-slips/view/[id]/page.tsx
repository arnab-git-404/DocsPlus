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
  FileText,
  Building2,
  User,
  Calendar,
  Wallet,
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { SalarySlipDocument } from '@/components/templates/SalarySlip';
import { toast } from 'react-hot-toast';

interface SalarySlipData {
  _id: string;
  employee: {
    userId: string;
    name: string;
    email: string;
    employeeId: string;
    designation: string;
  };
  company: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    website: string;
  };
  salary: {
    month: string;
    year: number;
    basicSalary: number;
    allowances: {
      hra: number;
      transport: number;
      medical: number;
      other: number;
    };
    deductions: {
      pf: number;
      tax: number;
      other: number;
    };
    grossSalary: number;
    netSalary: number;
  };
  signature: string;
  watermark: boolean;
  status: 'DRAFT' | 'GENERATED' | 'SENT';
  createdAt: string;
  sentAt?: string;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes


export default function ViewSalarySlipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [salarySlip, setSalarySlip] = useState<SalarySlipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSalarySlip();
  }, [id]);

  const fetchSalarySlip = async () => {
    try {
      setLoading(true);

      // Try localStorage first
      const cachedData = localStorage.getItem(`salary_slip_${id}`);
      if (cachedData) {
        const cached = JSON.parse(cachedData);
        if (Date.now() - cached.timestamp < 30 * 60 * 1000) {
          console.log('📦 Using cached salary slip data');
          setSalarySlip(cached.data);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      console.log('🌐 Fetching salary slip from API');
      const response = await fetch(`/api/salary-slip/${id}`);
      const data = await response.json();

      if (response.ok) {
        setSalarySlip(data.salarySlip);
        localStorage.setItem(
          `salary_slip_${id}`,
          JSON.stringify({
            data: data.salarySlip,
            timestamp: Date.now(),
          })
        );
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch salary slip' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch salary slip' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!salarySlip) return;

    const toastId = toast.loading("Generating PDF...");

    try {
      setDownloadLoading(true);
      console.log('📥 Generating PDF...');

      const blob = await pdf(<SalarySlipDocument data={salarySlip} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SalarySlip_${salarySlip.employee.employeeId}_${salarySlip.salary.month}_${salarySlip.salary.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'PDF downloaded successfully!' });
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: 'Failed to download PDF' });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!confirm('Send this salary slip via email?')) return;
    
    const toastId = toast.loading("Sending Salary Slip ...");

    try {
      setActionLoading(true);
      const response = await fetch(`/api/salary-slip/${id}/email`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Salary slip sent successfully!' });
        localStorage.removeItem(`salary_slip_${id}`);
        fetchSalarySlip();
        toast.success("Salary Slip Sent Successfully !", { id: toastId });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send salary slip' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this salary slip? This action cannot be undone.')) return;

    const toastId = toast.loading("Deleting Salary Slip ...");

    try {
      setActionLoading(true);
      const response = await fetch(`/api/salary-slip/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Salary slip deleted' });
        localStorage.removeItem(`salary_slip_${id}`);
        setTimeout(() => {
          router.push('/dashboard/admin/salary-slips');
        }, 2000);
        toast.success("Salary Slip Deleted Successfully !", { id: toastId });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      GENERATED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
      SENT: { color: 'bg-green-100 text-green-800', icon: Mail },
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
          <p className="text-gray-600">Loading salary slip...</p>
        </div>
      </div>
    );
  }

  if (!salarySlip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Salary Slip Not Found</h3>
            <p className="text-gray-600 mb-4">The salary slip you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/dashboard/admin/salary-slips')}>
              Back to Salary Slips
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAllowances = Object.values(salarySlip.salary.allowances).reduce((a, b) => a + b, 0);
  const totalDeductions = Object.values(salarySlip.salary.deductions).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/dashboard/admin/salary-slips')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Salary Slip</h1>
              <p className="mt-1 text-muted-foreground">
                {salarySlip.salary.month} {salarySlip.salary.year}
              </p>
            </div>
          </div>
          {getStatusBadge(salarySlip.status)}
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
            onClick={() => window.open(`/preview?type=salary-slip&id=${id}`, '_blank')}
            variant="default"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {/* <Button
            onClick={() => router.push(`/dashboard/admin/salary-slips/edit/${id}`)}
            variant="outline"
            disabled={actionLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button> */}
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

        {/* Employee & Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Employee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-semibold text-lg">{salarySlip.employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Employee ID</p>
                <p className="font-mono">{salarySlip.employee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Designation</p>
                <p className="font-medium">{salarySlip.employee.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium">{salarySlip.employee.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Company */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-lg">{salarySlip.company.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-medium">
                  {salarySlip.company.address}<br />
                  {salarySlip.company.city}, {salarySlip.company.state} - {salarySlip.company.pincode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Contact</p>
                <p className="font-medium">{salarySlip.company.phone}</p>
                <p className="font-medium">{salarySlip.company.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Salary Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Earnings */}
              <div>
                <h3 className="font-semibold mb-4 text-green-600">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Basic Salary</span>
                    <span className="font-medium">₹{salarySlip.salary.basicSalary.toLocaleString('en-IN')}</span>
                  </div>
                  {salarySlip.salary.allowances.hra > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">HRA</span>
                      <span className="font-medium">₹{salarySlip.salary.allowances.hra.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {salarySlip.salary.allowances.transport > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Transport</span>
                      <span className="font-medium">₹{salarySlip.salary.allowances.transport.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {salarySlip.salary.allowances.medical > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Medical</span>
                      <span className="font-medium">₹{salarySlip.salary.allowances.medical.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {salarySlip.salary.allowances.other > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Other Allowances</span>
                      <span className="font-medium">₹{salarySlip.salary.allowances.other.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Gross Salary</span>
                    <span className="text-green-600">₹{salarySlip.salary.grossSalary.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="font-semibold mb-4 text-red-600">Deductions</h3>
                <div className="space-y-2">
                  {salarySlip.salary.deductions.pf > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Provident Fund</span>
                      <span className="font-medium">₹{salarySlip.salary.deductions.pf.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {salarySlip.salary.deductions.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Tax</span>
                      <span className="font-medium">₹{salarySlip.salary.deductions.tax.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {salarySlip.salary.deductions.other > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Other Deductions</span>
                      <span className="font-medium">₹{salarySlip.salary.deductions.other.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">₹{totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Net Salary */}
            <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg">
              <span className="text-xl font-bold">Net Salary</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{salarySlip.salary.netSalary.toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Created On</p>
                <p className="font-semibold">
                  {new Date(salarySlip.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {salarySlip.sentAt && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sent On</p>
                  <p className="font-semibold">
                    {new Date(salarySlip.sentAt).toLocaleDateString('en-US', {
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