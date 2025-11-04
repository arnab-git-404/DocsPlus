"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Download,
  Mail,
  Printer,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

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
}

export default function OfferLetterPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  const [offerLetter, setOfferLetter] = useState<OfferLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Try to get from localStorage first
    const storedData = localStorage.getItem('offerLetterPreview');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setOfferLetter(data);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        fetchOfferLetter();
      }
    } else {
      // Fallback: fetch from API
      fetchOfferLetter();
    }
  }, [id]);

  const fetchOfferLetter = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/offer-letter/${id}`);
      const data = await response.json();

      if (response.ok) {
        setOfferLetter(data.offerLetter);
        // Store in localStorage for future use
        localStorage.setItem('offerLetterPreview', JSON.stringify(data.offerLetter));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch offer letter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch offer letter' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.open(`/api/offer-letter/${id}/pdf`, '_blank');
  };

  const handleSendEmail = async () => {
    if (!confirm('Are you sure you want to send this offer letter?')) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/offer-letter/${id}/email`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        // Refresh data after sending
        fetchOfferLetter();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send offer letter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send offer letter' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading offer letter preview...</p>
        </div>
      </div>
    );
  }

  if (!offerLetter) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Offer Letter Not Found</h3>
          <Button onClick={() => router.push('/dashboard/offer-letter')}>
            Back to Offer Letters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Action Bar - Hidden in Print */}
      <div className="print:hidden sticky top-0 z-50 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  // Clear localStorage when going back
                  localStorage.removeItem('offerLetterPreview');
                  router.push(`/dashboard/offer-letter/${id}`);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Offer Letter Preview</h1>
                <p className="text-sm text-gray-600 font-mono">{offerLetter.offerNumber}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={actionLoading}
                size="sm"
                className=""
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Send Email
              </Button>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <Alert className={`mt-4 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
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
        </div>
      </div>

      {/* Offer Letter Preview - A4 Paper Style */}
      <div className="min-h-screen py-8 print:py-0 print:bg-white">
        <div 
          ref={printRef}
          className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-none"
          style={{
            minHeight: '297mm', // A4 height
            padding: '20mm', // A4 margins
          }}
        >
          {/* Company Header */}
          <div className="text-center border-b-4 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              {offerLetter.companyName}
            </h1>
            <p className="text-gray-700">{offerLetter.companyAddress}</p>
            <p className="text-gray-700">
              {offerLetter.companyCity}, {offerLetter.companyState} - {offerLetter.companyPincode}
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Phone:</span> {offerLetter.companyPhone} | 
              <span className="font-semibold ml-2">Email:</span> {offerLetter.companyEmail}
            </p>
            {offerLetter.companyWebsite && (
              <p className="text-gray-700">
                <span className="font-semibold">Website:</span> {offerLetter.companyWebsite}
              </p>
            )}
          </div>

          {/* Letter Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              OFFER OF EMPLOYMENT
            </h2>
            <div className="flex justify-between text-sm text-gray-600 max-w-md mx-auto">
              <div>
                <span className="font-semibold">Offer No:</span> {offerLetter.offerNumber}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {new Date(offerLetter.offerDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Candidate Address */}
          <div className="mb-8">
            <p className="font-semibold text-gray-900 text-lg">{offerLetter.candidateName}</p>
            <p className="text-gray-700">{offerLetter.candidateAddress}</p>
            <p className="text-gray-700">Email: {offerLetter.candidateEmail}</p>
            <p className="text-gray-700">Phone: {offerLetter.candidatePhone}</p>
          </div>

          {/* Opening Paragraph */}
          <div className="mb-8 space-y-4">
            <p className="text-gray-900">Dear <span className="font-semibold">{offerLetter.candidateName}</span>,</p>
            
            <p className="text-gray-800 leading-relaxed">
              We are pleased to offer you the position of <span className="font-semibold">{offerLetter.position}</span> in 
              the <span className="font-semibold">{offerLetter.department}</span> department at {offerLetter.companyName}. 
              We believe that your skills and experience will be a valuable asset to our team.
            </p>
          </div>

          {/* Position Details Table */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              POSITION DETAILS
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700 w-1/3">Position</td>
                  <td className="p-3 text-gray-900">{offerLetter.position}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700">Department</td>
                  <td className="p-3 text-gray-900">{offerLetter.department}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700">Date of Joining</td>
                  <td className="p-3 text-gray-900">
                    {new Date(offerLetter.joiningDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700">Annual CTC</td>
                  <td className="p-3 text-gray-900 font-bold">₹{offerLetter.salary.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700">Working Hours</td>
                  <td className="p-3 text-gray-900">{offerLetter.workingHours}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700">Probation Period</td>
                  <td className="p-3 text-gray-900">{offerLetter.probationPeriod}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700">Notice Period</td>
                  <td className="p-3 text-gray-900">{offerLetter.noticePeriod}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Benefits Section */}
          {offerLetter.benefits && offerLetter.benefits.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                BENEFITS & PERKS
              </h3>
              <ul className="space-y-2">
                {offerLetter.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-800">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities Section */}
          {offerLetter.responsibilities && offerLetter.responsibilities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                KEY RESPONSIBILITIES
              </h3>
              <ul className="space-y-2">
                {offerLetter.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-800">
                    <span className="text-purple-600 font-bold mt-1">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              TERMS & CONDITIONS
            </h3>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {offerLetter.terms}
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="font-semibold text-gray-900">
                This offer is valid until: {new Date(offerLetter.expiryDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Additional Notes */}
          {offerLetter.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                ADDITIONAL NOTES
              </h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {offerLetter.notes}
              </p>
            </div>
          )}

          {/* Closing */}
          <div className="mb-12 space-y-4">
            <p className="text-gray-800 leading-relaxed">
              We are excited about the possibility of you joining our team and look forward to your positive response.
            </p>
            <p className="text-gray-800">
              Please sign and return a copy of this letter to indicate your acceptance of this offer.
            </p>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <div className="border-t-2 border-gray-300 pt-2 mt-16">
                <p className="font-bold text-gray-900">{offerLetter.signerName}</p>
                <p className="text-gray-700">{offerLetter.signerDesignation}</p>
                <p className="text-gray-700">{offerLetter.companyName}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Date: {new Date(offerLetter.offerDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <div className="border-t-2 border-gray-300 pt-2 mt-16">
                <p className="font-bold text-gray-900">{offerLetter.candidateName}</p>
                <p className="text-gray-700">Candidate Signature</p>
                <p className="text-sm text-gray-600 mt-2">Date: _______________</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t-2 border-gray-300 pt-4">
            <p>This is a computer-generated offer letter and does not require a signature.</p>
            <p className="mt-2">
              {offerLetter.companyName} | {offerLetter.companyEmail} | {offerLetter.companyPhone}
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
        }
      `}</style>
    </>
  );
}