




//---------------------
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calculator, Hash } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvoiceItem {
  item: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  initialData?: any;
}

export default function InvoiceForm({ onSubmit, loading, initialData }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    clientCity: '',
    clientState: '',
    clientPincode: '',
    clientPhone: '',
    clientEmail: '',
    clientGSTIN: '',
    paymentMethod: '',
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '2646743739',
    ifscCode: 'KKBK0005664',
    upiId: '',
    discount: 0,
    discountType: 'FIXED' as 'PERCENTAGE' | 'FIXED',
    cgst: 9,
    sgst: 9,
    notes: '',
    terms: 'Payment is due within 15 days of invoice date.',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { item: '', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  // State for invoice number
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string>('');
  const [loadingInvoiceNumber, setLoadingInvoiceNumber] = useState(false);

  // Fetch next invoice number on mount (only for new invoices)
  useEffect(() => {
    if (!initialData) {
      fetchNextInvoiceNumber();
    }
  }, [initialData]);

  const fetchNextInvoiceNumber = async () => {
    try {
      setLoadingInvoiceNumber(true);
      const response = await fetch('/api/invoice/generate-number');
      if (response.ok) {
        const data = await response.json();
        setNextInvoiceNumber(data.nextInvoiceNumber);
      }
    } catch (error) {
      console.error('Failed to fetch invoice number:', error);
    } finally {
      setLoadingInvoiceNumber(false);
    }
  };

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        clientName: initialData.clientName || '',
        clientAddress: initialData.clientAddress || '',
        clientCity: initialData.clientCity || '',
        clientState: initialData.clientState || '',
        clientPincode: initialData.clientPincode || '',
        clientPhone: initialData.clientPhone || '',
        clientEmail: initialData.clientEmail || '',
        clientGSTIN: initialData.clientGSTIN || '',
        paymentMethod: initialData.paymentMethod || '',
        bankName: initialData.bankName || 'Kotak Mahindra Bank',
        accountNumber: initialData.accountNumber || '2646743739',
        ifscCode: initialData.ifscCode || 'KKBK0005664',
        upiId: initialData.upiId || '',
        discount: initialData.discount || 0,
        discountType: initialData.discountType || 'FIXED',
        cgst: initialData.cgst || 9,
        sgst: initialData.sgst || 9,
        notes: initialData.notes || '',
        terms: initialData.terms || 'Payment is due within 15 days of invoice date.',
      });

      if (initialData.items && initialData.items.length > 0) {
        setItems(initialData.items);
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { item: '', description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    let discountAmount = 0;
    if (formData.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(formData.discount)) / 100;
    } else {
      discountAmount = Number(formData.discount);
    }
    
    const afterDiscount = subtotal - discountAmount;
    const cgstAmount = (afterDiscount * Number(formData.cgst)) / 100;
    const sgstAmount = (afterDiscount * Number(formData.sgst)) / 100;
    const total = afterDiscount + cgstAmount + sgstAmount;
    
    return {
      subtotal,
      discountAmount,
      afterDiscount,
      cgstAmount,
      sgstAmount,
      total,
    };
  };

  const totals = calculateTotals();

  const handleSubmit = (status: 'DRAFT' | 'SENT') => {
    const invoiceData = {
      ...formData,
      invoiceNumber: nextInvoiceNumber, 
      items,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      cgstAmount: totals.cgstAmount,
      sgstAmount: totals.sgstAmount,
      total: totals.total,
      status,
    };
    onSubmit(invoiceData);
  };

  return (
    <div className="space-y-6">
      {/* Invoice Number Preview */}
      {!initialData && (
        <Alert className=" border-blue-200">
          <Hash className="h-4 w-4 text-blue-600" />
          <AlertDescription className="">
            {loadingInvoiceNumber ? (
              <span>Loading invoice number...</span>
            ) : nextInvoiceNumber ? (
              <span>
                Next Invoice Number: <strong className="font-bold">{nextInvoiceNumber}</strong>
              </span>
            ) : (
              <span>Invoice number will be generated</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {initialData?.invoiceNumber && (
        <Alert className="">
          <Hash className="h-4 w-4 " />
          <AlertDescription className="">
            Invoice Number: <strong className="font-bold">{initialData.invoiceNumber}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Client Details */}
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                name="clientName"
                placeholder="Cafe"
                value={formData.clientName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="clientAddress">Address *</Label>
              <Input
                id="clientAddress"
                name="clientAddress"
                placeholder="INFRONT OF MADONA ENGLISH SCHOOL"
                value={formData.clientAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientCity">City *</Label>
              <Input
                id="clientCity"
                name="clientCity"
                placeholder="Darbhanga"
                value={formData.clientCity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientState">State *</Label>
              <Input
                id="clientState"
                name="clientState"
                placeholder="Bihar"
                value={formData.clientState}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPincode">Pincode *</Label>
              <Input
                id="clientPincode"
                name="clientPincode"
                placeholder="846004"
                value={formData.clientPincode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Phone *</Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                placeholder="+91 9472948357"
                value={formData.clientPhone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                placeholder="client@example.com"
                value={formData.clientEmail}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientGSTIN">GSTIN</Label>
              <Input
                id="clientGSTIN"
                name="clientGSTIN"
                placeholder="22AAAAA0000A1Z5"
                value={formData.clientGSTIN}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button type="button" onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Item {index + 1}</h4>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2">
                  <Label>Item Name *</Label>
                  <Input
                    placeholder="Social Media"
                    value={item.item}
                    onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description *</Label>
                  <Input
                    placeholder="30 Posts on Instagram"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate (₹) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={item.amount.toFixed(2)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                placeholder="0"
                value={formData.discount}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: 'PERCENTAGE' | 'FIXED') =>
                  setFormData({ ...formData, discountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount Amount</Label>
              <Input
                value={`₹${totals.discountAmount.toFixed(2)}`}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cgst">CGST (%)</Label>
              <Input
                id="cgst"
                name="cgst"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.cgst}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sgst">SGST (%)</Label>
              <Input
                id="sgst"
                name="sgst"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.sgst}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span className="font-medium text-red-600">-₹{totals.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>After Discount:</span>
              <span className="font-medium">₹{totals.afterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>CGST ({formData.cgst}%):</span>
              <span className="font-medium">₹{totals.cgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>SGST ({formData.sgst}%):</span>
              <span className="font-medium">₹{totals.sgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span className="text-green-600">₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                name="paymentMethod"
                placeholder="Bank Transfer / UPI / Cash"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                name="upiId"
                placeholder="username@bank"
                value={formData.upiId}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional notes..."
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              name="terms"
              rows={3}
              value={formData.terms}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit('DRAFT')}
          disabled={loading}
          className="flex-1"
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('DRAFT')}
          disabled={loading}
          className="flex-1"
        >
          {initialData ? 'Update Invoice' : 'Generate Invoice'}
        </Button>
      </div>
    </div>
  );
}