// "use client";

// import { useEffect, useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Download, Printer } from 'lucide-react';
// import Image from 'next/image';

// interface PreviewData {
//   employeeMongoId: string;
//   employeeId: string;
//   employeeName: string;
//   employeeEmail: string;
//   designation: string;
//   companyName: string;
//   companyAddress: string;
//   companyCity: string;
//   companyState: string;
//   companyPincode: string;
//   companyPhone: string;
//   companyEmail: string;
//   companyWebsite: string;
//   month: string;
//   year: number;
//   basicSalary: number;
//   hra: number;
//   transport: number;
//   medical: number;
//   otherAllowances: number;
//   pf: number;
//   tax: number;
//   otherDeductions: number;
//   signature: string;
//   watermark: boolean;
//   grossSalary: number;
//   netSalary: number;
// }

// export default function SalarySlipPreviewPage() {
//   const router = useRouter();
//   const printRef = useRef<HTMLDivElement>(null);
//   const [previewData, setPreviewData] = useState<PreviewData | null>(null);
//   const [currentDate, setCurrentDate] = useState('');

//   useEffect(() => {
//     // Get data from localStorage
//     const data = localStorage.getItem('salarySlipPreview');
//     if (data) {
//       setPreviewData(JSON.parse(data));
//     }
    
//     // Set current date
//     const date = new Date();
//     setCurrentDate(date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }));
//   }, []);

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleDownload = () => {
//     // This will be implemented with PDF generation
//     alert('PDF download will be implemented');
//   };

//   if (!previewData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-muted-foreground mb-4">No preview data available</p>
//           <Button onClick={() => window.close()}>Close</Button>
//         </div>
//       </div>
//     );
//   }

//   const earnings = [
//     { description: 'Basic Salary', amount: previewData.basicSalary },
//     { description: 'HRA', amount: previewData.hra },
//     { description: 'Transport Allowance', amount: previewData.transport },
//     { description: 'Medical Allowance', amount: previewData.medical },
//     { description: 'Other Allowances', amount: previewData.otherAllowances },
//   ].filter(item => item.amount > 0);

//   const deductions = [
//     { description: 'Provident Fund', amount: previewData.pf },
//     { description: 'Tax Deduction', amount: previewData.tax },
//     { description: 'Other Deductions', amount: previewData.otherDeductions },
//   ].filter(item => item.amount > 0);

//   const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);
//   const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);

//   return (
//     <div className="min-h-screen bg-gray-100 print:bg-white">
//       {/* Action Buttons - Hidden on Print */}
//       <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <Button
//               variant="outline"
//               onClick={() => window.close()}
//               className="gap-2"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Close
//             </Button>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 onClick={handlePrint}
//                 className="gap-2"
//               >
//                 <Printer className="h-4 w-4" />
//                 Print
//               </Button>
//               <Button
//                 onClick={handleDownload}
//                 className="gap-2"
//               >
//                 <Download className="h-4 w-4" />
//                 Download PDF
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Salary Slip Preview */}
//       <div className="container mx-auto px-4 py-8 print:p-0">
//         <Card className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:border-0">
//           <div ref={printRef} className="relative overflow-hidden">
//             {/* Watermark */}
//             {previewData.watermark && (
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
//                 <div className="text-9xl font-bold rotate-[-45deg] text-gray-500 select-none">
//                   {previewData.companyName}
//                 </div>
//               </div>
//             )}

//             {/* Content */}
//             <div className="relative z-10 p-8 print:p-12">
//               {/* Header with Blue Gradient */}
//               <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white px-8 py-6 rounded-t-lg -mx-8 -mt-8 mb-8">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     {/* Logo */}
//                     <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
//                       <Image
//                         src="/logo.png"
//                         alt="Company Logo"
//                         width={50}
//                         height={50}
//                         className="object-contain"
//                       />
//                     </div>
//                     <div>
//                       <h1 className="text-2xl font-bold">{previewData.companyName}</h1>
//                       <p className="text-blue-100 text-sm">{previewData.companyWebsite}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Title */}
//               <div className="text-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-2">EMPLOYEE SALARY SLIP</h2>
//                 <div className="flex justify-between items-center max-w-2xl mx-auto mt-4">
//                   <div className="text-left">
//                     <p className="text-sm text-gray-600">Pay Period</p>
//                     <p className="font-semibold text-gray-800">
//                       {previewData.month} {previewData.year}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-600">Date</p>
//                     <p className="font-semibold text-gray-800">{currentDate}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Employee & Company Details */}
//               <div className="grid md:grid-cols-2 gap-8 mb-8">
//                 {/* Employee Details */}
//                 <div className="space-y-3">
//                   <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
//                     Employee Details
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex">
//                       <span className="text-gray-600 w-32">Name:</span>
//                       <span className="font-semibold text-gray-800">{previewData.employeeName}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="text-gray-600 w-32">Employee ID:</span>
//                       <span className="font-semibold text-gray-800">{previewData.employeeId}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="text-gray-600 w-32">Email:</span>
//                       <span className="font-semibold text-gray-800">{previewData.employeeEmail}</span>
//                     </div>
//                     <div className="flex">
//                       <span className="text-gray-600 w-32">Designation:</span>
//                       <span className="font-semibold text-gray-800">{previewData.designation}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Company Details */}
//                 <div className="space-y-3">
//                   <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
//                     Company Details
//                   </h3>
//                   <div className="space-y-2">
//                     <div>
//                       <p className="font-semibold text-gray-800">{previewData.companyName}</p>
//                       <p className="text-gray-600 text-sm">{previewData.companyAddress}</p>
//                       <p className="text-gray-600 text-sm">
//                         {previewData.companyCity}, {previewData.companyState} - {previewData.companyPincode}
//                       </p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-gray-600 text-sm">
//                         <span className="font-medium">Phone:</span> {previewData.companyPhone}
//                       </p>
//                       <p className="text-gray-600 text-sm">
//                         <span className="font-medium">Email:</span> {previewData.companyEmail}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Salary Breakdown Table */}
//               <div className="mb-8">
//                 <div className="border border-gray-300 rounded-lg overflow-hidden">
//                   {/* Table Header */}
//                   <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//                     <div className="grid grid-cols-4 font-semibold text-sm">
//                       <div className="px-4 py-3 border-r border-blue-400">EARNINGS</div>
//                       <div className="px-4 py-3 text-right border-r border-blue-400">AMOUNT</div>
//                       <div className="px-4 py-3 border-r border-blue-400">DEDUCTIONS</div>
//                       <div className="px-4 py-3 text-right">AMOUNT</div>
//                     </div>
//                   </div>

//                   {/* Table Body */}
//                   <div className="bg-white">
//                     {Array.from({ 
//                       length: Math.max(earnings.length, deductions.length) 
//                     }).map((_, index) => (
//                       <div 
//                         key={index}
//                         className="grid grid-cols-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
//                       >
//                         {/* Earnings */}
//                         <div className="px-4 py-3 border-r border-gray-200 text-gray-700">
//                           {earnings[index]?.description || ''}
//                         </div>
//                         <div className="px-4 py-3 text-right border-r border-gray-200 font-medium text-gray-800">
//                           {/* {earnings[index] ? `₹${earnings[index].amount.toFixed(2)}` : ''} */}
//                         {earnings[index]?.amount ? `₹${Number(earnings[index].amount).toFixed(2)}` : ''}

//                         </div>

//                         {/* Deductions */}
//                         <div className="px-4 py-3 border-r border-gray-200 text-gray-700">
//                           {deductions[index]?.description || ''}
//                         </div>
//                         <div className="px-4 py-3 text-right font-medium text-gray-800">
//                           {/* {deductions[index] ? `₹${deductions[index].amount.toFixed(2)}` : ''} */}
//                                                   {deductions[index]?.amount ? `₹${Number(deductions[index].amount).toFixed(2)}` : ''}

//                         </div>
//                       </div>
//                     ))}

//                     {/* Totals */}
//                     <div className="grid grid-cols-4 bg-gray-100 font-semibold">
//                       <div className="px-4 py-3 border-r border-gray-300 text-gray-800">
//                         GROSS EARNINGS
//                       </div>
//                       <div className="px-4 py-3 text-right border-r border-gray-300 text-green-600">
//                         ₹{totalEarnings.toFixed(2)}
//                       </div>
//                       <div className="px-4 py-3 border-r border-gray-300 text-gray-800">
//                         TOTAL DEDUCTIONS
//                       </div>
//                       <div className="px-4 py-3 text-right text-red-600">
//                         ₹{totalDeductions.toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Net Salary */}
//               <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg mb-8">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold">NET SALARY (Take Home)</span>
//                   <span className="text-2xl font-bold">₹{previewData.netSalary.toFixed(2)}</span>
//                 </div>
//                 <p className="text-green-100 text-sm mt-2">
//                   Amount in words: {numberToWords(previewData.netSalary)} Rupees Only
//                 </p>
//               </div>

//               {/* Signature */}
//               <div className="flex justify-end mt-12">
//                 <div className="text-center">
//                   {previewData.signature && (
//                     <div className="mb-4">
//                       <img
//                         src={previewData.signature}
//                         alt="Authorized Signature"
//                         className="h-16 mx-auto"
//                       />
//                     </div>
//                   )}
//                   <div className="border-t-2 border-gray-800 pt-2 px-8">
//                     <p className="font-semibold text-gray-800">Authorized Signatory</p>
//                     <p className="text-sm text-gray-600">{previewData.companyName}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="mt-8 pt-6 border-t border-gray-300">
//                 <p className="text-center text-xs text-gray-500">
//                   This is a computer-generated document. No signature is required.
//                 </p>
//                 <p className="text-center text-xs text-gray-500 mt-1">
//                   For queries, contact: {previewData.companyEmail} | {previewData.companyPhone}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           body {
//             print-color-adjust: exact;
//             -webkit-print-color-adjust: exact;
//           }
//           @page {
//             size: A4;
//             margin: 0;
//           }
//           .print\\:hidden {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// // Helper function to convert number to words
// function numberToWords(num: number): string {
//   const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

//   if (num === 0) return 'Zero';

//   const numStr = Math.floor(num).toString();
//   const len = numStr.length;

//   if (len > 9) return 'Number too large';

//   const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
//   if (!n) return '';

//   let str = '';
  
//   // Crores
//   str += (parseInt(n[1]) !== 0) ? (ones[parseInt(n[1][0])] + ' ' + tens[parseInt(n[1][1])]).trim() + ' Crore ' : '';
  
//   // Lakhs
//   str += (parseInt(n[2]) !== 0) ? (ones[parseInt(n[2][0])] + ' ' + tens[parseInt(n[2][1])]).trim() + ' Lakh ' : '';
  
//   // Thousands
//   str += (parseInt(n[3]) !== 0) ? (ones[parseInt(n[3][0])] + ' ' + tens[parseInt(n[3][1])]).trim() + ' Thousand ' : '';
  
//   // Hundreds
//   str += (parseInt(n[4]) !== 0) ? ones[parseInt(n[4])] + ' Hundred ' : '';
  
//   // Tens and ones
//   if (parseInt(n[5]) !== 0) {
//     if (parseInt(n[5]) < 10) {
//       str += ones[parseInt(n[5])];
//     } else if (parseInt(n[5]) < 20) {
//       str += teens[parseInt(n[5][1])];
//     } else {
//       str += tens[parseInt(n[5][0])] + ' ' + ones[parseInt(n[5][1])];
//     }
//   }

//   return str.trim();
// }





"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import Image from 'next/image';

interface PreviewData {
  employeeMongoId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  designation: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  transport: number;
  medical: number;
  otherAllowances: number;
  pf: number;
  tax: number;
  otherDeductions: number;
  signature: string;
  watermark: boolean;
  grossSalary: number;
  netSalary: number;
}

export default function SalarySlipPreviewPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Get data from localStorage
    const data = localStorage.getItem('salarySlipPreview');
    if (data) {
      setPreviewData(JSON.parse(data));
    }
    
    // Set current date
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // This will be implemented with PDF generation
    alert('PDF download will be implemented');
  };

  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No preview data available</p>
          <Button onClick={() => window.close()}>Close</Button>
        </div>
      </div>
    );
  }

  // Convert all values to numbers explicitly
  const earnings = [
    { description: 'Basic Salary', amount: Number(previewData.basicSalary) || 0 },
    { description: 'HRA', amount: Number(previewData.hra) || 0 },
    { description: 'Transport Allowance', amount: Number(previewData.transport) || 0 },
    { description: 'Medical Allowance', amount: Number(previewData.medical) || 0 },
    { description: 'Other Allowances', amount: Number(previewData.otherAllowances) || 0 },
  ].filter(item => item.amount > 0);

  const deductions = [
    { description: 'Provident Fund', amount: Number(previewData.pf) || 0 },
    { description: 'Tax Deduction', amount: Number(previewData.tax) || 0 },
    { description: 'Other Deductions', amount: Number(previewData.otherDeductions) || 0 },
  ].filter(item => item.amount > 0);

  const totalEarnings = Number(earnings.reduce((sum, item) => sum + Number(item.amount), 0));
  const totalDeductions = Number(deductions.reduce((sum, item) => sum + Number(item.amount), 0));

  return (
    <div className="min-h-screen  print:bg-white">
      {/* Action Buttons - Hidden on Print */}
      <div className="print:hidden sticky top-0 z-10 border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => window.close()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Close
            </Button>
            <div className="flex gap-2">
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

      {/* Salary Slip Preview */}
      <div id="printable-area" className="container mx-auto px-4 py-8 print:p-0">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:border-0">
          <div ref={printRef} className="relative overflow-hidden">
            {/* Watermark */}
            {previewData.watermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
                <div className="text-9xl font-bold rotate-[-45deg] text-gray-500 select-none">
                  {previewData.companyName}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-8 print:p-12">
              {/* Header with Blue Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white px-8 py-6 rounded-t-lg -mx-8 -mt-8 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                      <Image
                        src="/logo.jpeg"
                        alt="Company Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{previewData.companyName}</h1>
                      <p className="text-blue-100 text-sm">{previewData.companyWebsite}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">EMPLOYEE SALARY SLIP</h2>
                <div className="flex justify-between items-center max-w-2xl mx-auto mt-4">
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Pay Period</p>
                    <p className="font-semibold text-gray-800">
                      {previewData.month} {previewData.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-800">{currentDate}</p>
                  </div>
                </div>
              </div>

              {/* Employee & Company Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Employee Details */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
                    Employee Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-gray-600 w-32">Name:</span>
                      <span className="font-semibold text-gray-800">{previewData.employeeName}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Employee ID:</span>
                      <span className="font-semibold text-gray-800">{previewData.employeeId}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Email:</span>
                      <span className="font-semibold text-gray-800">{previewData.employeeEmail}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">Designation:</span>
                      <span className="font-semibold text-gray-800">{previewData.designation}</span>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
                    Company Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-gray-800">{previewData.companyName}</p>
                      <p className="text-gray-600 text-sm">{previewData.companyAddress}</p>
                      <p className="text-gray-600 text-sm">
                        {previewData.companyCity}, {previewData.companyState} - {previewData.companyPincode}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Phone:</span> {previewData.companyPhone}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Email:</span> {previewData.companyEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown Table */}
              <div className="mb-8">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="grid grid-cols-4 font-semibold text-sm">
                      <div className="px-4 py-3 border-r border-blue-400">EARNINGS</div>
                      <div className="px-4 py-3 text-right border-r border-blue-400">AMOUNT</div>
                      <div className="px-4 py-3 border-r border-blue-400">DEDUCTIONS</div>
                      <div className="px-4 py-3 text-right">AMOUNT</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="bg-white">
                    {Array.from({ 
                      length: Math.max(earnings.length, deductions.length) 
                    }).map((_, index) => (
                      <div 
                        key={index}
                        className="grid grid-cols-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                      >
                        {/* Earnings */}
                        <div className="px-4 py-3 border-r border-gray-200 text-gray-700">
                          {earnings[index]?.description || ''}
                        </div>
                        <div className="px-4 py-3 text-right border-r border-gray-200 font-medium text-gray-800">
                          {earnings[index]?.amount ? `₹${earnings[index].amount.toFixed(2)}` : ''}
                        </div>

                        {/* Deductions */}
                        <div className="px-4 py-3 border-r border-gray-200 text-gray-700">
                          {deductions[index]?.description || ''}
                        </div>
                        <div className="px-4 py-3 text-right font-medium text-gray-800">
                          {deductions[index]?.amount ? `₹${deductions[index].amount.toFixed(2)}` : ''}
                        </div>
                      </div>
                    ))}

                    {/* Totals */}
                    <div className="grid grid-cols-4 bg-gray-100 font-semibold">
                      <div className="px-4 py-3 border-r border-gray-300 text-gray-800">
                        GROSS EARNINGS
                      </div>
                      <div className="px-4 py-3 text-right border-r border-gray-300 text-green-600">
                        ₹{totalEarnings.toFixed(2)}
                      </div>
                      <div className="px-4 py-3 border-r border-gray-300 text-gray-800">
                        TOTAL DEDUCTIONS
                      </div>
                      <div className="px-4 py-3 text-right text-red-600">
                        ₹{totalDeductions.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">NET SALARY (Take Home)</span>
                  <span className="text-2xl font-bold">₹{Number(previewData.netSalary).toFixed(2)}</span>
                </div>
                <p className="text-green-100 text-sm mt-2">
                  Amount in words: {numberToWords(Number(previewData.netSalary))} Rupees Only
                </p>
              </div>

              {/* Signature */}
              <div className="flex justify-end mt-12">
                <div className="text-center">
                  {previewData.signature && (
                    <div className="mb-4">
                      <img
                        src={previewData.signature}
                        alt="Authorized Signature"
                        className="h-16 mx-auto"
                      />
                    </div>
                  )}
                  <div className="border-t-2 border-gray-800 pt-2 px-8">
                    <p className="font-semibold text-gray-800">Authorized Signatory</p>
                    <p className="text-sm text-gray-600">{previewData.companyName}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-center text-xs text-gray-500">
                  This is a computer-generated document. No signature is required.
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  For queries, contact: {previewData.companyEmail} | {previewData.companyPhone}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      {/* <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style> */}
    
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
          
          /* Hide everything */
          body * {
            visibility: hidden;
          }
          
          /* Show only printable area */
          #printable-area,
          #printable-area * {
            visibility: visible;
          }
          
          /* Position printable area at top */
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Remove card styling for print */
          #printable-area .max-w-4xl {
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
          }
          
          /* Remove rounded corners */
          #printable-area * {
            border-radius: 0 !important;
          }
          
          /* Hide print button area */
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    
    </div>
  );
}

// Helper function to convert number to words
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const numStr = Math.floor(num).toString();
  const len = numStr.length;

  if (len > 9) return 'Number too large';

  const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  let str = '';
  
  str += (parseInt(n[1]) !== 0) ? (ones[parseInt(n[1][0])] + ' ' + tens[parseInt(n[1][1])]).trim() + ' Crore ' : '';
  str += (parseInt(n[2]) !== 0) ? (ones[parseInt(n[2][0])] + ' ' + tens[parseInt(n[2][1])]).trim() + ' Lakh ' : '';
  str += (parseInt(n[3]) !== 0) ? (ones[parseInt(n[3][0])] + ' ' + tens[parseInt(n[3][1])]).trim() + ' Thousand ' : '';
  str += (parseInt(n[4]) !== 0) ? ones[parseInt(n[4])] + ' Hundred ' : '';
  
  if (parseInt(n[5]) !== 0) {
    if (parseInt(n[5]) < 10) {
      str += ones[parseInt(n[5])];
    } else if (parseInt(n[5]) < 20) {
      str += teens[parseInt(n[5][1])];
    } else {
      str += tens[parseInt(n[5][0])] + ' ' + ones[parseInt(n[5][1])];
    }
  }

  return str.trim();
}