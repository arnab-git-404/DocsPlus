// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Separator } from '@/components/ui/separator';
// import { Loader2, Upload, Eye, Save, Send, Image as ImageIcon } from 'lucide-react';

// interface Employee {
//   employeeId: string;
//   _id: string;
//   name: string;
//   email: string;
// }

// export default function GenerateSalarySlipPage() {
// //   const { user } = useAuth();
  
// const user: { name: string; email: string; role: "ADMIN" | "EMPLOYEE" } = {
//     name: "John Doe",
//     email: "example@gmail.com",
//     role: "ADMIN",
//   };
    

//   const router = useRouter();
//   const signatureInputRef = useRef<HTMLInputElement>(null);
  
//   const [loading, setLoading] = useState(false);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [signaturePreview, setSignaturePreview] = useState<string>('');

//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().toLocaleString('default', { month: 'long' });

//   const [formData, setFormData] = useState({
//     // Employee Details
//     employeeId: '',
//     employeeName: '',
//     employeeEmail: '',
//     designation: '',
//     employeeIdNumber: '',
    
//     // Company Details
//     companyName: 'HACKENCE SERVICES',
//     companyAddress: 'Balbhadrapur, Laheriasarai, Darbhanga',
//     companyCity: 'Bihar',
//     companyState: 'Bihar',
//     companyPincode: '84600',
//     companyPhone: '+91 9472948357',
//     companyEmail: 'hackence.services@gmail.com',
//     companyWebsite: 'www.hackence.com',
    
//     // Salary Details
//     month: currentMonth,
//     year: currentYear,
//     basicSalary: 0,
//     hra: 0,
//     transport: 0,
//     medical: 0,
//     otherAllowances: 0,
//     pf: 0,
//     tax: 0,
//     otherDeductions: 0,
    
//     // Signature
//     signature: '',
//     watermark: true,
//   });

//   useEffect(() => {
//     if (user?.role !== 'ADMIN') {
//       router.push('/dashboard/employee');
//     }
//     fetchEmployees();
//   }, [router]);





//  // Fetch employees only once on mount
//   // useEffect(() => {
//   //   let isMounted = true;

//   //   const fetchEmployees = async () => {
//   //     try {
//   //       setEmployeesLoading(true);
//   //       const response = await fetch('/api/admin/employees');
//   //       if (response.ok && isMounted) {
//   //         const data = await response.json();
//   //         setEmployees(data.employees || []);
//   //       }
//   //     } catch (error) {
//   //       console.error('Failed to fetch employees:', error);
//   //       if (isMounted) {
//   //         setError('Failed to load employees');
//   //       }
//   //     } finally {
//   //       if (isMounted) {
//   //         setEmployeesLoading(false);
//   //       }
//   //     }
//   //   };

//   //   fetchEmployees();

//   //   return () => {
//   //     isMounted = false;
//   //   };
//   // }, []); 




//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch('/api/admin/employees');
//       if (response.ok) {
//         const data = await response.json();
//         setEmployees(data.employees);
//       }
//     } catch (error) {
//       console.error('Failed to fetch employees:', error);
//     }
//   };

//   const handleEmployeeSelect = (employeeId: string) => {
//     const employee = employees.find(e => e._id === employeeId);
//     if (employee) {
//       setFormData(prev => ({
//         ...prev,
//         employeeId,
//         employeeName: employee.name,
//         employeeEmail: employee.email,
//       }));
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         setError('Signature file size should be less than 2MB');
//         return;
//       }
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result as string;
//         setSignaturePreview(base64String);
//         setFormData(prev => ({ ...prev, signature: base64String }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const calculateSalary = () => {
//     const basic = parseFloat(formData.basicSalary.toString()) || 0;
//     const hra = parseFloat(formData.hra.toString()) || 0;
//     const transport = parseFloat(formData.transport.toString()) || 0;
//     const medical = parseFloat(formData.medical.toString()) || 0;
//     const otherAllowances = parseFloat(formData.otherAllowances.toString()) || 0;
//     const pf = parseFloat(formData.pf.toString()) || 0;
//     const tax = parseFloat(formData.tax.toString()) || 0;
//     const otherDeductions = parseFloat(formData.otherDeductions.toString()) || 0;

//     const grossSalary = basic + hra + transport + medical + otherAllowances;
//     const totalDeductions = pf + tax + otherDeductions;
//     const netSalary = grossSalary - totalDeductions;

//     return { grossSalary, totalDeductions, netSalary };
//   };

//   const { grossSalary, totalDeductions, netSalary } = calculateSalary();

//   const handlePreview = () => {
//     // Open preview in new window
//     const previewData = {
//       ...formData,
//       grossSalary,
//       netSalary,
//     };
//     localStorage.setItem('salarySlipPreview', JSON.stringify(previewData));
//     window.open('/dashboard/admin/salary-slips/preview', '_blank');
//   };

//   const handleSave = async (status: 'DRAFT' | 'GENERATED') => {
//     setError('');
//     setSuccess('');

//     if (!formData.employeeId || !formData.designation) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch('/api/admin/salary-slips/save', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           employee: {
//             userId: formData.employeeId,
//             name: formData.employeeName,
//             email: formData.employeeEmail,
//             designation: formData.designation,
//             employeeId: formData.employeeIdNumber,
//           },
//           company: {
//             name: formData.companyName,
//             address: formData.companyAddress,
//             city: formData.companyCity,
//             state: formData.companyState,
//             pincode: formData.companyPincode,
//             phone: formData.companyPhone,
//             email: formData.companyEmail,
//             website: formData.companyWebsite,
//           },
//           salary: {
//             month: formData.month,
//             year: formData.year,
//             basicSalary: formData.basicSalary,
//             allowances: {
//               hra: formData.hra,
//               transport: formData.transport,
//               medical: formData.medical,
//               other: formData.otherAllowances,
//             },
//             deductions: {
//               pf: formData.pf,
//               tax: formData.tax,
//               other: formData.otherDeductions,
//             },
//             grossSalary,
//             netSalary,
//           },
//           signature: formData.signature,
//           watermark: formData.watermark,
//           status,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to save salary slip');
//       }

//       setSuccess(`Salary slip ${status === 'DRAFT' ? 'saved as draft' : 'generated'} successfully!`);
      
//       setTimeout(() => {
//         router.push('/dashboard/admin/salary-slips');
//       }, 2000);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Generate Salary Slip</h1>
//         <p className="text-muted-foreground mt-2">Create a new salary slip for an employee</p>
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {success && (
//         <Alert className="border-green-200 bg-green-50">
//           <AlertDescription className="text-green-800">{success}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Form Section */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Employee Details */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Employee Details</CardTitle>
//               <CardDescription>Select employee and enter designation</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="employee">Select Employee *</Label>
//                   <Select value={formData.employeeId} onValueChange={handleEmployeeSelect}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Choose employee" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {employees.map((emp) => (
//                         <SelectItem key={emp._id} value={emp._id}>
//                           {emp.name} ({emp.email})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="employeeIdNumber">Employee ID</Label>
//                   <Input
//                     id="employeeIdNumber"
//                     name="employeeIdNumber"
//                     placeholder="EMP001"
//                     value={formData.employeeIdNumber}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="designation">Designation *</Label>
//                   <Input
//                     id="designation"
//                     name="designation"
//                     placeholder="Software Engineer"
//                     value={formData.designation}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Salary Period */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Salary Period</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="month">Month</Label>
//                   <Select value={formData.month} onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {months.map((month) => (
//                         <SelectItem key={month} value={month}>{month}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="year">Year</Label>
//                   <Input
//                     id="year"
//                     name="year"
//                     type="number"
//                     value={formData.year}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Salary Components */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Earnings</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="basicSalary">Basic Salary *</Label>
//                   <Input
//                     id="basicSalary"
//                     name="basicSalary"
//                     type="number"
//                     placeholder="0"
//                     value={formData.basicSalary}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="hra">HRA</Label>
//                   <Input
//                     id="hra"
//                     name="hra"
//                     type="number"
//                     placeholder="0"
//                     value={formData.hra}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="transport">Transport Allowance</Label>
//                   <Input
//                     id="transport"
//                     name="transport"
//                     type="number"
//                     placeholder="0"
//                     value={formData.transport}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="medical">Medical Allowance</Label>
//                   <Input
//                     id="medical"
//                     name="medical"
//                     type="number"
//                     placeholder="0"
//                     value={formData.medical}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <Label htmlFor="otherAllowances">Other Allowances</Label>
//                   <Input
//                     id="otherAllowances"
//                     name="otherAllowances"
//                     type="number"
//                     placeholder="0"
//                     value={formData.otherAllowances}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Deductions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Deductions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="pf">Provident Fund (PF)</Label>
//                   <Input
//                     id="pf"
//                     name="pf"
//                     type="number"
//                     placeholder="0"
//                     value={formData.pf}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="tax">Tax Deduction</Label>
//                   <Input
//                     id="tax"
//                     name="tax"
//                     type="number"
//                     placeholder="0"
//                     value={formData.tax}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <Label htmlFor="otherDeductions">Other Deductions</Label>
//                   <Input
//                     id="otherDeductions"
//                     name="otherDeductions"
//                     type="number"
//                     placeholder="0"
//                     value={formData.otherDeductions}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Signature Upload */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Digital Signature</CardTitle>
//               <CardDescription>Upload authorized signatory signature</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <input
//                   ref={signatureInputRef}
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleSignatureUpload}
//                 />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => signatureInputRef.current?.click()}
//                   className="w-full"
//                 >
//                   <Upload className="mr-2 h-4 w-4" />
//                   Upload Signature
//                 </Button>
                
//                 {signaturePreview && (
//                   <div className="mt-4 p-4 border rounded-lg">
//                     <p className="text-sm font-medium mb-2">Signature Preview:</p>
//                     <img
//                       src={signaturePreview}
//                       alt="Signature"
//                       className="max-h-20 border p-2 bg-white"
//                     />
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Summary Section */}
//         <div className="space-y-6">
//           <Card className="sticky top-6">
//             <CardHeader>
//               <CardTitle>Salary Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Gross Salary</span>
//                   <span className="font-medium">₹{grossSalary.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Total Deductions</span>
//                   <span className="font-medium text-red-600">-₹{totalDeductions.toFixed(2)}</span>
//                 </div>
//                 <Separator />
//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Net Salary</span>
//                   <span className="text-green-600">₹{netSalary.toFixed(2)}</span>
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <Button
//                   onClick={handlePreview}
//                   variant="outline"
//                   className="w-full"
//                   disabled={!formData.employeeId || loading}
//                 >
//                   <Eye className="mr-2 h-4 w-4" />
//                   Preview
//                 </Button>

//                 <Button
//                   onClick={() => handleSave('DRAFT')}
//                   variant="outline"
//                   className="w-full"
//                   disabled={loading}
//                 >
//                   {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
//                   Save as Draft
//                 </Button>

//                 <Button
//                   onClick={() => handleSave('GENERATED')}
//                   className="w-full"
//                   disabled={loading}
//                 >
//                   {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
//                   Generate Slip
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }






// 2nd TRY
"use client";

import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, Eye, Save, Send } from 'lucide-react';

interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  designation: string;
}

export default function GenerateSalarySlipPage() {
  // const { user } = useAuth();
  
  const user: { name: string; email: string; role: "ADMIN" | "EMPLOYEE" } = {
    name: "John Doe",
    email: "example@gmail.com",
    role: "ADMIN",
  };

  const router = useRouter();
  const signatureInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [signaturePreview, setSignaturePreview] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const [formData, setFormData] = useState({
    // Employee Details
    employeeMongoId: '', // MongoDB _id
    employeeId: '', // Display ID like EMP001
    employeeName: '',
    employeeEmail: '',
    designation: '',
    
    // Company Details
    companyName: 'HACKENCE SERVICES',
    companyAddress: 'Balbhadrapur, Laheriasarai, Darbhanga',
    companyCity: 'Bihar',
    companyState: 'Bihar',
    companyPincode: '84600',
    companyPhone: '+91 9472948357',
    companyEmail: 'hackence.services@gmail.com',
    companyWebsite: 'www.hackence.com',
    
    // Salary Details
    month: currentMonth,
    year: currentYear,
    basicSalary: 0,
    hra: 0,
    transport: 0,
    medical: 0,
    otherAllowances: 0,
    pf: 0,
    tax: 0,
    otherDeductions: 0,
    
    // Signature
    signature: '',
    watermark: true,
  });

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard/employee');
    }
    fetchEmployees();
  }, [router]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/admin/employees');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched employees:', data.employees);
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setError('Failed to load employees');
    }
  };

  const handleEmployeeSelect = (selectedMongoId: string) => {
    console.log('Selected MongoDB ID:', selectedMongoId);
    const employee = employees.find(e => e._id === selectedMongoId);
    console.log('Found employee:', employee);
    
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employeeMongoId: selectedMongoId, // MongoDB _id for API
        employeeId: employee.employeeId, // Display ID like EMP843460928
        employeeName: employee.name,
        employeeEmail: employee.email,
        designation: employee.designation || '',
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Signature file size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSignaturePreview(base64String);
        setFormData(prev => ({ ...prev, signature: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateSalary = () => {
    const basic = parseFloat(formData.basicSalary.toString()) || 0;
    const hra = parseFloat(formData.hra.toString()) || 0;
    const transport = parseFloat(formData.transport.toString()) || 0;
    const medical = parseFloat(formData.medical.toString()) || 0;
    const otherAllowances = parseFloat(formData.otherAllowances.toString()) || 0;
    const pf = parseFloat(formData.pf.toString()) || 0;
    const tax = parseFloat(formData.tax.toString()) || 0;
    const otherDeductions = parseFloat(formData.otherDeductions.toString()) || 0;

    const grossSalary = basic + hra + transport + medical + otherAllowances;
    const totalDeductions = pf + tax + otherDeductions;
    const netSalary = grossSalary - totalDeductions;

    return { grossSalary, totalDeductions, netSalary };
  };

  const { grossSalary, totalDeductions, netSalary } = calculateSalary();

  const handlePreview = () => {
    if (!formData.employeeMongoId) {
      setError('Please select an employee first');
      return;
    }
     if (!formData.designation) {
    setError('Please enter designation');
    return;
  }
  
  if (formData.basicSalary <= 0) {
    setError('Please enter basic salary');
    return;
  }
    
    const previewData = {
      ...formData,
      grossSalary,
      netSalary,
    };
    localStorage.setItem('salarySlipPreview', JSON.stringify(previewData));
    window.open('/dashboard/salary-slip/preview', '_blank');
  };

  const handleSave = async (status: 'DRAFT' | 'GENERATED') => {
    setError('');
    setSuccess('');

    if (!formData.employeeMongoId || !formData.designation) {
      setError('Please select an employee and fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/dashboard/salary-slip/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee: {
            userId: formData.employeeMongoId, // MongoDB _id
            name: formData.employeeName,
            email: formData.employeeEmail,
            designation: formData.designation,
            employeeId: formData.employeeId, // Display ID
          },
          company: {
            name: formData.companyName,
            address: formData.companyAddress,
            city: formData.companyCity,
            state: formData.companyState,
            pincode: formData.companyPincode,
            phone: formData.companyPhone,
            email: formData.companyEmail,
            website: formData.companyWebsite,
          },
          salary: {
            month: formData.month,
            year: formData.year,
            basicSalary: formData.basicSalary,
            allowances: {
              hra: formData.hra,
              transport: formData.transport,
              medical: formData.medical,
              other: formData.otherAllowances,
            },
            deductions: {
              pf: formData.pf,
              tax: formData.tax,
              other: formData.otherDeductions,
            },
            grossSalary,
            netSalary,
          },
          signature: formData.signature,
          watermark: formData.watermark,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save salary slip');
      }

      setSuccess(`Salary slip ${status === 'DRAFT' ? 'saved as draft' : 'generated'} successfully!`);
      
      setTimeout(() => {
        router.push('/dashboard/admin/salary-slips');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Salary Slip</h1>
        <p className="text-muted-foreground mt-2">Create a new salary slip for an employee</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
              <CardDescription>Select employee and verify details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="employee">Select Employee *</Label>
                  <Select value={formData.employeeMongoId} onValueChange={handleEmployeeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp._id} value={emp._id}>
                          {emp.employeeId} - {emp.name} ({emp.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input
                    id="employeeName"
                    name="employeeName"
                    value={formData.employeeName}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeEmail">Email</Label>
                  <Input
                    id="employeeEmail"
                    name="employeeEmail"
                    value={formData.employeeEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    name="designation"
                    placeholder="Software Engineer"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Period */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select value={formData.month} onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Components */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basicSalary">Basic Salary *</Label>
                  <Input
                    id="basicSalary"
                    name="basicSalary"
                    type="number"
                    placeholder="0"
                    value={formData.basicSalary}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hra">HRA</Label>
                  <Input
                    id="hra"
                    name="hra"
                    type="number"
                    placeholder="0"
                    value={formData.hra}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transport">Transport Allowance</Label>
                  <Input
                    id="transport"
                    name="transport"
                    type="number"
                    placeholder="0"
                    value={formData.transport}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical">Medical Allowance</Label>
                  <Input
                    id="medical"
                    name="medical"
                    type="number"
                    placeholder="0"
                    value={formData.medical}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="otherAllowances">Other Allowances</Label>
                  <Input
                    id="otherAllowances"
                    name="otherAllowances"
                    type="number"
                    placeholder="0"
                    value={formData.otherAllowances}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card>
            <CardHeader>
              <CardTitle>Deductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pf">Provident Fund (PF)</Label>
                  <Input
                    id="pf"
                    name="pf"
                    type="number"
                    placeholder="0"
                    value={formData.pf}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Deduction</Label>
                  <Input
                    id="tax"
                    name="tax"
                    type="number"
                    placeholder="0"
                    value={formData.tax}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="otherDeductions">Other Deductions</Label>
                  <Input
                    id="otherDeductions"
                    name="otherDeductions"
                    type="number"
                    placeholder="0"
                    value={formData.otherDeductions}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Digital Signature</CardTitle>
              <CardDescription>Upload authorized signatory signature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSignatureUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => signatureInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Signature
                </Button>
                
                {signaturePreview && (
                  <div className="mt-4 p-4 border rounded-lg">
                    <p className="text-sm font-medium mb-2">Signature Preview:</p>
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="max-h-20 border p-2 bg-white"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Salary Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gross Salary</span>
                  <span className="font-medium">₹{grossSalary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Deductions</span>
                  <span className="font-medium text-red-600">-₹{totalDeductions.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Salary</span>
                  <span className="text-green-600">₹{netSalary.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full"
                  disabled={!formData.employeeMongoId || loading}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>

                <Button
                  onClick={() => handleSave('DRAFT')}
                  variant="outline"
                  className="w-full"
                  disabled={loading || !formData.employeeMongoId}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save as Draft
                </Button>

                <Button
                  onClick={() => handleSave('GENERATED')}
                  className="w-full"
                  disabled={loading || !formData.employeeMongoId}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Generate Slip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}