"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FormData {
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAddress: string;
  position: string;
  department: string;
  joiningDate: string;
  salary: string;
  workingHours: string;
  probationPeriod: string;
  noticePeriod: string;
  benefits: string[];
  responsibilities: string[];
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite: string;
  offerDate: string;
  expiryDate: string;
  signerName: string;
  signerDesignation: string;
  terms: string;
  notes: string;
}

export default function EditOfferLetterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newBenefit, setNewBenefit] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');

  const [formData, setFormData] = useState<FormData>({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    candidateAddress: '',
    position: '',
    department: '',
    joiningDate: '',
    salary: '',
    workingHours: '',
    probationPeriod: '',
    noticePeriod: '',
    benefits: [],
    responsibilities: [],
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyPincode: '',
    companyEmail: '',
    companyPhone: '',
    companyWebsite: '',
    offerDate: '',
    expiryDate: '',
    signerName: '',
    signerDesignation: '',
    terms: '',
    notes: '',
  });

  useEffect(() => {
    fetchOfferLetter();
  }, [id]);

  const fetchOfferLetter = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/offer-letter/${id}`);
      const data = await response.json();

      if (response.ok) {
        const offer = data.offerLetter;
        setFormData({
          candidateName: offer.candidateName,
          candidateEmail: offer.candidateEmail,
          candidatePhone: offer.candidatePhone,
          candidateAddress: offer.candidateAddress,
          position: offer.position,
          department: offer.department,
          joiningDate: new Date(offer.joiningDate).toISOString().split('T')[0],
          salary: offer.salary.toString(),
          workingHours: offer.workingHours,
          probationPeriod: offer.probationPeriod,
          noticePeriod: offer.noticePeriod,
          benefits: offer.benefits || [],
          responsibilities: offer.responsibilities || [],
          companyName: offer.companyName,
          companyAddress: offer.companyAddress,
          companyCity: offer.companyCity,
          companyState: offer.companyState,
          companyPincode: offer.companyPincode,
          companyEmail: offer.companyEmail,
          companyPhone: offer.companyPhone,
          companyWebsite: offer.companyWebsite || '',
          offerDate: new Date(offer.offerDate).toISOString().split('T')[0],
          expiryDate: new Date(offer.expiryDate).toISOString().split('T')[0],
          signerName: offer.signerName,
          signerDesignation: offer.signerDesignation,
          terms: offer.terms,
          notes: offer.notes || '',
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch offer letter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch offer letter' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }));
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const toastId = toast.loading("Updating offer letter...");

      if (!formData.candidateName || !formData.candidateEmail || !formData.position) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        setSaving(false);
        return;
      }

      const payload = {
        ...formData,
        salary: parseFloat(formData.salary),
      };

      const response = await fetch(`/api/offer-letter/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Offer letter updated successfully!' });
        localStorage.clear();
        toast.success("Offer letter updated successfully!" , { id: toastId });

        setTimeout(() => {
          router.push(`/dashboard/admin/offer-letters`);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update offer letter' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading offer letter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()} 
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold ">Edit Offer Letter</h1>
            <p className="text-gray-600 mt-1">Update the offer letter details</p>
          </div>
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

        {/* Candidate Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 " />
              Candidate Information
            </CardTitle>
            <CardDescription>Basic details about the candidate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidateName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidateName"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateEmail">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidateEmail"
                  name="candidateEmail"
                  type="email"
                  value={formData.candidateEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidatePhone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidatePhone"
                  name="candidatePhone"
                  value={formData.candidatePhone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateAddress">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidateAddress"
                  name="candidateAddress"
                  value={formData.candidateAddress}
                  onChange={handleInputChange}
                  required
                />
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
            <CardDescription>Job role and compensation information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">
                  Position/Role <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningDate">
                  Joining Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">
                  Annual CTC (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input
                  id="workingHours"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="probationPeriod">Probation Period</Label>
                <Select
                  value={formData.probationPeriod}
                  onValueChange={(value) => handleSelectChange('probationPeriod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">No Probation</SelectItem>
                    <SelectItem value="1 month">1 Month</SelectItem>
                    <SelectItem value="2 months">2 Months</SelectItem>
                    <SelectItem value="3 months">3 Months</SelectItem>
                    <SelectItem value="6 months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="noticePeriod">Notice Period</Label>
                <Select
                  value={formData.noticePeriod}
                  onValueChange={(value) => handleSelectChange('noticePeriod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 days">15 Days</SelectItem>
                    <SelectItem value="30 days">30 Days</SelectItem>
                    <SelectItem value="60 days">60 Days</SelectItem>
                    <SelectItem value="90 days">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Benefits
            </CardTitle>
            <CardDescription>Add benefits and perks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="e.g., Health Insurance, Paid Time Off"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <Button onClick={addBenefit} type="button" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.benefits.length > 0 && (
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2  p-3 rounded-lg">
                    <span className="flex-1">{benefit}</span>
                    <Button
                      onClick={() => removeBenefit(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Key Responsibilities
            </CardTitle>
            <CardDescription>Define main job responsibilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                placeholder="e.g., Develop and maintain web applications"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
              />
              <Button onClick={addResponsibility} type="button" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.responsibilities.length > 0 && (
              <div className="space-y-2">
                {formData.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-center gap-2  p-3 rounded-lg">
                    <span className="flex-1">{responsibility}</span>
                    <Button
                      onClick={() => removeResponsibility(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Company Information
            </CardTitle>
            <CardDescription>Your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Website</Label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyCity">City</Label>
                <Input
                  id="companyCity"
                  name="companyCity"
                  value={formData.companyCity}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyState">State</Label>
                <Input
                  id="companyState"
                  name="companyState"
                  value={formData.companyState}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPincode">Pincode</Label>
                <Input
                  id="companyPincode"
                  name="companyPincode"
                  value={formData.companyPincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Letter Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Letter Details
            </CardTitle>
            <CardDescription>Offer letter configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offerDate">Offer Date</Label>
                <Input
                  id="offerDate"
                  name="offerDate"
                  type="date"
                  value={formData.offerDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Valid Until</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerName">Authorized Signatory Name</Label>
                <Input
                  id="signerName"
                  name="signerName"
                  value={formData.signerName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerDesignation">Signatory Designation</Label>
                <Input
                  id="signerDesignation"
                  name="signerDesignation"
                  value={formData.signerDesignation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push(`/dashboard/admin/offer-letters/${id}`)}
            disabled={saving}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 "
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}