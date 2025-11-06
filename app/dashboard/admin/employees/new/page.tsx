// "use client";

// import { useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { ArrowLeft, Loader2, UserPlus, Mail } from 'lucide-react';
// import Link from 'next/link';

// export default function CreateUserPage() {
//   const { user } = useAuth();

//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const [formData, setFormData] = useState({
//     employeeId: '',
//     name: '',
//     email: '',
//     role: 'EMPLOYEE',
//     // designation: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRoleChange = (value: string) => {
//     setFormData({ ...formData, role: value });
//   };

//   const generateEmployeeId = () => {
//     const prefix = 'EMP';
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     return `${prefix}${timestamp}${random}`;
//   };

//   const handleGenerateId = () => {
//     setFormData({ ...formData, employeeId: generateEmployeeId() });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!formData.employeeId || !formData.name || !formData.email) {
//       setError('All fields are required');
//       return;
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create user');
//       }

//       setSuccess('User created successfully! Activation email sent.');

//       setTimeout(() => {
//         router.push('/dashboard/admin');
//       }, 2000);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (user?.role !== 'ADMIN') {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="mx-auto flex items-center gap-4">
//         <Link href="/dashboard/admin">
//           <Button variant="outline" size="icon">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-3xl font-bold">Create New User</h1>
//           <p className="text-muted-foreground mt-2">
//             Add a new employee to the system
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="max-w-2xl">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <UserPlus className="h-5 w-5" />
//               User Information
//             </CardTitle>
//             <CardDescription>
//               Enter employee details. An activation email will be sent automatically.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               {success && (
//                 <Alert className="border-green-200 bg-green-50">
//                   <Mail className="h-4 w-4 text-green-600" />
//                   <AlertDescription className="text-green-800">
//                     {success}
//                   </AlertDescription>
//                 </Alert>
//               )}

//               {/* Employee ID */}
//               <div className="space-y-2">
//                 <Label htmlFor="employeeId">
//                   Employee ID *
//                   <span className="text-xs text-muted-foreground ml-2">
//                     (Must be unique)
//                   </span>
//                 </Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="employeeId"
//                     name="employeeId"
//                     placeholder="EMP001"
//                     value={formData.employeeId}
//                     onChange={handleChange}
//                     required
//                     disabled={loading}
//                     className="flex-1"
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleGenerateId}
//                     disabled={loading}
//                   >
//                     Generate
//                   </Button>
//                 </div>
//               </div>

//               {/* Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name *</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   placeholder="John Doe"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address *</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="john.doe@hackence.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   disabled={loading}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   An activation link will be sent to this email
//                 </p>
//               </div>

//               {/* Role */}
//               <div className="space-y-2">
//                 <Label htmlFor="role">Role</Label>
//                 <Select
//                   value={formData.role}
//                   onValueChange={handleRoleChange}
//                   disabled={loading}
//                 >
//                   <SelectTrigger id="role">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="EMPLOYEE">Employee</SelectItem>
//                     <SelectItem value="ADMIN">Admin</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex gap-4 pt-4">
//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1"
//                 >
//                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   {loading ? 'Creating User...' : 'Create User'}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push('/dashboard/admin')}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Info Card */}
//         <Card className="mt-6 border-blue-200 bg-blue-50">
//           <CardContent className="pt-6">
//             <div className="flex gap-3">
//               <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
//               <div className="space-y-1">
//                 <p className="text-sm font-medium text-blue-900">
//                   Activation Process
//                 </p>
//                 <p className="text-xs text-blue-700">
//                   The new user will receive an email with an activation link. They must:
//                 </p>
//                 <ul className="text-xs text-blue-700 list-disc list-inside space-y-1 mt-2">
//                   <li>Click the activation link within 24 hours</li>
//                   <li>Set their password</li>
//                   <li>Account status will change to ACTIVE</li>
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Loader2,
  UserPlus,
  Mail,
  Briefcase,
  DollarSign,
  CreditCard,
  FileText,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function CreateEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    // Basic Info
    employeeId: "",
    name: "",
    gender: "",
    dob: "",
    role: "EMPLOYEE",

    // Contact Info
    email: "",
    phone: "",
    address: "",

    // Job Details
    department: "",
    designation: "",
    joinDate: new Date().toISOString().split("T")[0],
    employmentType: "Full-time",
    manager: "",

    // Salary Details
    basicSalary: "",
    hra: "",
    transportAllowances: "",
    medicalAllowances: "",

    // bonus
    bonusTitle: "",
    bonusAmount: "",

    // Deductions
    pf: "",
    tax: "",
    otherTitle: "",
    otherAmount: "",

    // Bank Details
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upi: "",

    // Documents
    pan: "",
    aadhar: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const generateEmployeeId = () => {
    const prefix = "EMP";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  };

  const handleGenerateId = () => {
    setFormData({ ...formData, employeeId: generateEmployeeId() });
  };

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const transportAllowances = parseFloat(formData.transportAllowances) || 0;
    const medicalAllowances = parseFloat(formData.medicalAllowances) || 0;
    const pf = parseFloat(formData.pf) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const other = parseFloat(formData.otherAmount) || 0;
    const bonus = parseFloat(formData.bonusAmount) || 0;

    const totalAllowances = transportAllowances + medicalAllowances + bonus;
    const totalDeductions = pf + tax + other;

    return basic + hra + totalAllowances - totalDeductions;
  };

  const validateBasicInfo = () => {
    if (!formData.employeeId || !formData.name || !formData.email) {
      setError("Employee ID, Name, and Email are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validateJobInfo = () => {
    if (!formData.department || !formData.designation || !formData.joinDate) {
      setError("Department, Designation, and Join Date are required");
      return false;
    }
    return true;
  };

  const validateSalaryInfo = () => {
    if (!formData.basicSalary || parseFloat(formData.basicSalary) <= 0) {
      setError("Basic salary is required and must be greater than 0");
      return false;
    }
    return true;
  };

  const handleNext = (nextTab: string) => {
    setError("");

    if (activeTab === "basic" && !validateBasicInfo()) return;
    if (activeTab === "job" && !validateJobInfo()) return;
    if (activeTab === "salary" && !validateSalaryInfo()) return;

    setActiveTab(nextTab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateBasicInfo() || !validateJobInfo() || !validateSalaryInfo()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        employeeId: formData.employeeId,
        name: formData.name,
        gender: formData.gender || undefined,
        dob: formData.dob || undefined,
        contact: {
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
        },
        job: {
          department: formData.department,
          designation: formData.designation,
          joinDate: formData.joinDate,
          employmentType: formData.employmentType,
          manager: formData.manager || undefined,
        },
        salary: {
          basic: parseFloat(formData.basicSalary),
          hra: parseFloat(formData.hra) || 0,
          transportAllowances: parseFloat(formData.transportAllowances) || 0,
          medicalAllowances: parseFloat(formData.medicalAllowances) || 0,
          bonus: {
            title: formData.bonusTitle || "Bonus",
            amount: parseFloat(formData.bonusAmount) || 0,
          },

          deductions: {
            pf: parseFloat(formData.pf) || 0,
            tax: parseFloat(formData.tax) || 0,
            other: {
              title: formData.otherTitle || "Other",
              amount: parseFloat(formData.otherAmount) || 0,
            },
          },

          net: calculateNetSalary(),
        },
        bank: {
          name: formData.bankName || undefined,
          accountNumber: formData.accountNumber || undefined,
          ifsc: formData.ifsc || undefined,
          upi: formData.upi || undefined,
        },
        documents: {
          pan: formData.pan || undefined,
          aadhar: formData.aadhar || undefined,
        },
        role: formData.role,
      };

      console.log("Payload:", payload);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create employee");
      }

      setSuccess("Employee created successfully! Activation email sent.");

      setTimeout(() => {
        router.push("/dashboard/admin/employees");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/employees">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Create New Employee
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Add a new employee to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Employee Information
            </CardTitle>
            <CardDescription>
              Fill in the employee details. An activation email will be sent
              automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid h-24 md:h-10 w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
                  <TabsTrigger value="basic" className="text-xs md:text-sm">
                    <UserPlus className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>

                  <TabsTrigger value="job" className="text-xs md:text-sm">
                    <Briefcase className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Job</span>
                  </TabsTrigger>

                  <TabsTrigger value="salary" className="text-xs md:text-sm">
                    <DollarSign className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Salary</span>
                  </TabsTrigger>

                  <TabsTrigger value="bank" className="text-xs md:text-sm">
                    <CreditCard className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Bank</span>
                  </TabsTrigger>

                  <TabsTrigger value="documents" className="text-xs md:text-sm">
                    <FileText className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Docs</span>
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information */}
                <TabsContent value="basic" className="space-y-4 mt-4 sm:">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="employeeId"
                          name="employeeId"
                          placeholder="EMP001"
                          value={formData.employeeId}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateId}
                          disabled={loading}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                        disabled={loading}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleSelectChange("role", value)
                        }
                        disabled={loading}
                      >
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMPLOYEE">Employee</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Complete address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={loading}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={() => handleNext("job")}>
                      Next: Job Details
                    </Button>
                  </div>
                </TabsContent>

                {/* Job Details */}
                <TabsContent value="job" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        name="department"
                        placeholder="IT"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation *</Label>
                      <Input
                        id="designation"
                        name="designation"
                        placeholder="Software Engineer"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date *</Label>
                      <Input
                        id="joinDate"
                        name="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(value) =>
                          handleSelectChange("employmentType", value)
                        }
                        disabled={loading}
                      >
                        <SelectTrigger id="employmentType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="manager">Manager (Employee ID)</Label>
                      <Input
                        id="manager"
                        name="manager"
                        placeholder="EMP010"
                        value={formData.manager}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                    >
                      Previous
                    </Button>
                    <Button type="button" onClick={() => handleNext("salary")}>
                      Next: Salary Details
                    </Button>
                  </div>
                </TabsContent>

                {/* Salary Details */}
                <TabsContent value="salary" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="basicSalary">Basic Salary *</Label>
                      <Input
                        id="basicSalary"
                        name="basicSalary"
                        type="number"
                        placeholder="40000"
                        value={formData.basicSalary}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hra">HRA</Label>
                      <Input
                        id="hra"
                        name="hra"
                        type="number"
                        placeholder="8000"
                        value={formData.hra}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transportAllowances">
                        Transport Allowances
                      </Label>
                      <Input
                        id="transportAllowances"
                        name="transportAllowances"
                        type="number"
                        placeholder="3000"
                        value={formData.transportAllowances}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalAllowances">
                        Medical Allowances
                      </Label>
                      <Input
                        id="medicalAllowances"
                        name="medicalAllowances"
                        type="number"
                        placeholder="3000"
                        value={formData.medicalAllowances}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>
<div className="space-y-2">
                      <Label htmlFor="bonusTitle">Bonus (if any)</Label>
                      <Input
                        id="bonusTitle"
                        name="bonusTitle"
                        type="text"
                        placeholder="Title"
                        value={formData.bonusTitle}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bonusAmount">Bonus Amount</Label>
                      <Input
                        id="bonusAmount"
                        name="bonusAmount"
                        type="number"
                        placeholder="1500"
                        value={formData.bonusAmount}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pf">Provident Fund (PF) *</Label>
                      <Input
                        id="pf"
                        name="pf"
                        type="number"
                        placeholder="1500"
                        value={formData.pf}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax">Tax Deduction</Label>
                      <Input
                        id="tax"
                        name="tax"
                        type="number"
                        placeholder="1500"
                        value={formData.tax}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="other">Other Deductions</Label>
                      <Input
                        id="otherTitle"
                        name="otherTitle"
                        type="text"
                        placeholder="Title"
                        value={formData.otherTitle}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                      <Input
                        id="otherAmount"
                        name="otherAmount"
                        type="number"
                        placeholder="1500"
                        value={formData.otherAmount}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    

                    <div className="space-y-2 md:col-span-2">
                      <Label>Net Salary (Auto-calculated)</Label>
                      <div className="text-2xl font-bold text-primary">
                        ₹{calculateNetSalary().toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("job")}
                    >
                      Previous
                    </Button>
                    <Button type="button" onClick={() => handleNext("bank")}>
                      Next: Bank Details
                    </Button>
                  </div>
                </TabsContent>

                {/* Bank Details */}
                <TabsContent value="bank" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        placeholder="HDFC Bank"
                        value={formData.bankName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="XXXXXXXXXX"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        name="ifsc"
                        placeholder="HDFC0001234"
                        value={formData.ifsc}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="upi">UPI ID</Label>
                      <Input
                        id="upi"
                        name="upi"
                        placeholder="john@hdfcbank"
                        value={formData.upi}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("salary")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleNext("documents")}
                    >
                      Next: Documents
                    </Button>
                  </div>
                </TabsContent>

                {/* Documents */}
                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input
                        id="pan"
                        name="pan"
                        placeholder="ABCDE1234F"
                        value={formData.pan}
                        onChange={handleChange}
                        disabled={loading}
                        maxLength={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhar Number</Label>
                      <Input
                        id="aadhar"
                        name="aadhar"
                        placeholder="1234 5678 9012"
                        value={formData.aadhar}
                        onChange={handleChange}
                        disabled={loading}
                        maxLength={12}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("bank")}
                    >
                      Previous
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {loading ? "Creating Employee..." : "Create Employee"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium ">Activation Process</p>
                <ul className="text-xs text-blue-500 list-disc list-inside space-y-1">
                  <li>Activation email will be sent to the employee</li>
                  <li>Employee must activate within 24 hours</li>
                  <li>They will set their password during activation</li>
                  <li>Status will change to ACTIVE after completion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
