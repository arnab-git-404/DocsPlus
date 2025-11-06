"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { OfferLetterDocument } from '@/components/templates/OfferLetter';
import { pdf } from '@react-pdf/renderer';

import {
  ArrowLeft,
  Edit,
  Mail,
  Download,
  Trash2,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileEdit,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OfferLetter {
  _id: string;
  offerNumber: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAddress: string;
  position: string;
  department: string;
  joiningDate: string;
  salary: number;
  workingHours: string;
  probationPeriod: string;
  noticePeriod: string;
  benefits: string[];
  responsibilities: string[];
  terms: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  offerDate: string;
  expiryDate: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite?: string;
  signerName: string;
  signerDesignation: string;
  notes?: string;
  createdAt: string;
  sentAt?: string;
}

export default function ViewOfferLetterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [offerLetter, setOfferLetter] = useState<OfferLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchOfferLetter();
  }, [id]);

  const fetchOfferLetter = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/offer-letter/${id}`);
      const data = await response.json();

      if (response.ok) {
        setOfferLetter(data.offerLetter);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch offer letter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch offer letter' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!confirm('Are you sure you want to send this offer letter?')) return;

    const toastId = toast.loading("Sending Offer Letter ...");

    try {
      setActionLoading(true);
      const response = await fetch(`/api/offer-letter/${id}/email`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchOfferLetter();
        toast.success("Offer Letter Sent Successfully !", { id: toastId });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send offer letter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send offer letter' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this offer letter? This action cannot be undone.')) return;

    const toastId = toast.loading("Deleting Offer Letter ...");

    try {
      setActionLoading(true);
      const response = await fetch(`/api/offer-letter/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Offer letter deleted successfully' });
        setTimeout(() => {
          router.push('/dashboard/admin/offer-letters');
        }, 2000);
        toast.success("Offer Letter Deleted Successfully !", { id: toastId });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete offer letter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete offer letter' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileEdit },
      SENT: { color: 'bg-blue-100 text-blue-800', icon: Mail },
      ACCEPTED: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle },
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


  const handleDownloadPDF = async () => {

    if (!offerLetter) return;

    try {
      // setDownloadLoading(true);
      console.log('📥 Generating PDF...');
      const toastId = toast.loading('Downloading PDF...');

      // Generate PDF blob
      const blob = await pdf(<OfferLetterDocument data={offerLetter} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${offerLetter.offerNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'PDF downloaded successfully!' });
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: 'Failed to download PDF' });
    } finally {
      // setDownloadLoading(false);
    }
  };




  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin  mx-auto mb-4" />
          <p className="text-gray-600">Loading offer letter...</p>
        </div>
      </div>
    );
  }

  if (!offerLetter) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Offer Letter Not Found</h3>
            <p className="text-gray-600 mb-4">The offer letter you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/dashboard/admin/offer-letters')}>
              Back to Offer Letters
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
              onClick={() => router.push('/dashboard/admin/offer-letters')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold ">Offer Letter</h1>
              <p className=" mt-1 font-mono">Offer Letter Id: {offerLetter.offerNumber}</p>
            </div>
          </div>
          {getStatusBadge(offerLetter.status)}
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
              onClick={() => {
                // localStorage.setItem('offerLetterPreview', JSON.stringify(offerLetter));
                // window.open(`/preview/${id}`, '_blank');
                window.open(`/preview?type=offer-letter&id=${params.id}`, '_blank');
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          <Button
            onClick={() => router.push(`/dashboard/admin/offer-letters/edit/${id}`)}
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
            onClick={() => handleDownloadPDF()}
            variant="outline"
            disabled={actionLoading}
          >
            <Download className="h-4 w-4 mr-2" />
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

        {/* Candidate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Candidate Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-semibold text-lg">{offerLetter.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email Address</p>
                <p className="font-semibold">{offerLetter.candidateEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="font-semibold">{offerLetter.candidatePhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-semibold">{offerLetter.candidateAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Position Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Position</p>
                <p className="font-semibold text-lg">{offerLetter.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="font-semibold">{offerLetter.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Joining Date</p>
                <p className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {new Date(offerLetter.joiningDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Annual CTC</p>
                <p className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  ₹{offerLetter.salary.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Working Hours</p>
                <p className="font-semibold">{offerLetter.workingHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Probation Period</p>
                <p className="font-semibold">{offerLetter.probationPeriod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Notice Period</p>
                <p className="font-semibold">{offerLetter.noticePeriod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits & Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offerLetter.benefits && offerLetter.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {offerLetter.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {offerLetter.responsibilities && offerLetter.responsibilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Key Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {offerLetter.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                      </div>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Company Name</p>
                <p className="font-semibold">{offerLetter.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold">{offerLetter.companyEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-semibold">{offerLetter.companyPhone}</p>
              </div>
              {offerLetter.companyWebsite && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Website</p>
                  <p className="font-semibold">{offerLetter.companyWebsite}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-semibold">
                  {offerLetter.companyAddress}, {offerLetter.companyCity}, {offerLetter.companyState} - {offerLetter.companyPincode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Letter Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Letter Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Offer Date</p>
                <p className="font-semibold">
                  {new Date(offerLetter.offerDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                <p className="font-semibold">
                  {new Date(offerLetter.expiryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Authorized Signatory</p>
                <p className="font-semibold">{offerLetter.signerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Designation</p>
                <p className="font-semibold">{offerLetter.signerDesignation}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-600 mb-2">Terms & Conditions</p>
              <p className=" whitespace-pre-wrap">{offerLetter.terms}</p>
            </div>

            {offerLetter.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Additional Notes</p>
                  <p className=" whitespace-pre-wrap">{offerLetter.notes}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created on</p>
                <p className="font-semibold">
                  {new Date(offerLetter.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {offerLetter.sentAt && (
                <div>
                  <p className="text-gray-600">Sent on</p>
                  <p className="font-semibold">
                    {new Date(offerLetter.sentAt).toLocaleDateString('en-US', {
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