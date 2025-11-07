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
import { toast } from "react-hot-toast";



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
    city: "",
    state: "",
    pincode: "",

    // Job Details
    department: "",
    designation: "",
    joinDate: new Date().toISOString().split("T")[0],
    employmentType: "Full-time",
    manager: user?.employeeId || "",

    // Salary Details
    basicSalary: "",
    hra: "",
    hraType: "percentage", // "percentage" or "fixed"
    transportAllowances: "",
    transportType: "fixed", // "percentage" or "fixed"
    medicalAllowances: "",
    medicalType: "fixed", // "percentage" or "fixed"



    // Deductions
    pf: "",
    pfType: "percentage", // "percentage" or "fixed"
    tax: "",
    taxType: "percentage", // "percentage" or "fixed"
    otherTitle: "",
    otherAmount: "",

    // Bank Details
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
    pfAccountNumber: "",

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

  // const calculateNetSalary = () => {
  //   const basic = parseFloat(formData.basicSalary) || 0;
  //   const hra = parseFloat(formData.hra) || 0;
  //   const transportAllowances = parseFloat(formData.transportAllowances) || 0;
  //   const medicalAllowances = parseFloat(formData.medicalAllowances) || 0;
  //   const pf = parseFloat(formData.pf) || 0;
  //   const tax = parseFloat(formData.tax) || 0;
  //   const other = parseFloat(formData.otherAmount) || 0;
  //   const bonus = parseFloat(formData.bonusAmount) || 0;

  //   const totalAllowances = transportAllowances + medicalAllowances + bonus;
  //   const totalDeductions = pf + tax + other;

  //   return basic + hra + totalAllowances - totalDeductions;
  // };


  const calculateNetSalary = () => {
    
    // Add salary calculation with percentage and fixed options
    const basic = parseFloat(formData.basicSalary) || 0;
    
    // Calculate HRA
    let hra = 0;
    if (formData.hraType === "percentage") {
      hra = (basic * (parseFloat(formData.hra) || 0)) / 100;
    } else {
      hra = parseFloat(formData.hra) || 0;
    }

    // Calculate Transport Allowance
    let transportAllowances = 0;
    if (formData.transportType === "percentage") {
      transportAllowances = (basic * (parseFloat(formData.transportAllowances) || 0)) / 100;
    } else {
      transportAllowances = parseFloat(formData.transportAllowances) || 0;
    }

    // Calculate Medical Allowance
    let medicalAllowances = 0;
    if (formData.medicalType === "percentage") {
      medicalAllowances = (basic * (parseFloat(formData.medicalAllowances) || 0)) / 100;
    } else {
      medicalAllowances = parseFloat(formData.medicalAllowances) || 0;
    }

    // Calculate PF Deduction
    let pf = 0;
    if (formData.pfType === "percentage") {
      pf = (basic * (parseFloat(formData.pf) || 0)) / 100;
    } else {
      pf = parseFloat(formData.pf) || 0;
    }

    // Calculate Tax Deduction
    let tax = 0;
    if (formData.taxType === "percentage") {
      tax = (basic * (parseFloat(formData.tax) || 0)) / 100;
    } else {
      tax = parseFloat(formData.tax) || 0;
    }

    const other = parseFloat(formData.otherAmount) || 0;

    const totalAllowances = hra + transportAllowances + medicalAllowances;
    const totalDeductions = pf + tax + other;

    return basic + totalAllowances - totalDeductions;
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");

  //   if (!validateBasicInfo() || !validateJobInfo() || !validateSalaryInfo()) {
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const payload = {
  //       employeeId: formData.employeeId,
  //       name: formData.name,
  //       email: formData.email,
  //       gender: formData.gender || undefined,
  //       dob: formData.dob || undefined,
  //       contact: {
  //         email: formData.email,
  //         phone: formData.phone || undefined,
  //         address: formData.address || undefined,
  //         city: formData.city || undefined,
  //         state: formData.state || undefined,
  //         pincode: formData.pincode || undefined,
  //       },
  //       job: {
  //         department: formData.department,
  //         designation: formData.designation,
  //         joinDate: formData.joinDate,
  //         employmentType: formData.employmentType,
  //         manager: formData.manager || undefined,
  //       },
  //       salary: {
  //         basic: parseFloat(formData.basicSalary),
  //         hra: parseFloat(formData.hra) || 0,
  //         transportAllowances: parseFloat(formData.transportAllowances) || 0,
  //         medicalAllowances: parseFloat(formData.medicalAllowances) || 0,
          

  //         deductions: {
  //           pf: parseFloat(formData.pf) || 0,
  //           tax: parseFloat(formData.tax) || 0,
  //           other: {
  //             title: formData.otherTitle || "Other",
  //             amount: parseFloat(formData.otherAmount) || 0,
  //           },
  //         },

  //         net: calculateNetSalary(),
  //       },
  //       bank: {
  //         name: formData.bankName || undefined,
  //         accountNumber: formData.accountNumber || undefined,
  //         ifsc: formData.ifsc || undefined,
  //         upi: formData.upi || undefined,
  //         pfAccountNumber: formData.pfAccountNumber || undefined,
  //       },
  //       documents: {
  //         pan: formData.pan || undefined,
  //         aadhar: formData.aadhar || undefined,
  //       },
  //       role: formData.role,
  //     };

  //     console.log("Payload:", payload);

  //     const response = await fetch("/api/auth/signup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || "Failed to create employee");
  //     }

  //     setSuccess("Employee created successfully! Activation email sent.");

  //     setTimeout(() => {
  //       router.push("/dashboard/admin/employees");
  //     }, 2000);
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


// ...existing code...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateBasicInfo() || !validateJobInfo() || !validateSalaryInfo()) {
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Creating employee...");

    try {
      const basic = parseFloat(formData.basicSalary);

      // Calculate actual amounts based on type
      const hraAmount = formData.hraType === "percentage"
        ? (basic * (parseFloat(formData.hra) || 0)) / 100
        : parseFloat(formData.hra) || 0;

      const transportAmount = formData.transportType === "percentage"
        ? (basic * (parseFloat(formData.transportAllowances) || 0)) / 100
        : parseFloat(formData.transportAllowances) || 0;

      const medicalAmount = formData.medicalType === "percentage"
        ? (basic * (parseFloat(formData.medicalAllowances) || 0)) / 100
        : parseFloat(formData.medicalAllowances) || 0;

      const pfAmount = formData.pfType === "percentage"
        ? (basic * (parseFloat(formData.pf) || 0)) / 100
        : parseFloat(formData.pf) || 0;

      const taxAmount = formData.taxType === "percentage"
        ? (basic * (parseFloat(formData.tax) || 0)) / 100
        : parseFloat(formData.tax) || 0;

      const payload = {
        employeeId: formData.employeeId,
        name: formData.name,
        email: formData.email,
        gender: formData.gender || undefined,
        dob: formData.dob || undefined,
        contact: {
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          pincode: formData.pincode || undefined,
        },
        job: {
          department: formData.department,
          designation: formData.designation,
          joinDate: formData.joinDate,
          employmentType: formData.employmentType,
          manager: formData.manager || undefined,
        },
        salary: {
          basic: basic,
          hra: hraAmount, // Calculated amount
          transportAllowances: transportAmount, // Calculated amount
          medicalAllowances: medicalAmount, // Calculated amount

          deductions: {
            pf: pfAmount, // Calculated amount
            tax: taxAmount, // Calculated amount
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
          pfAccountNumber: formData.pfAccountNumber || undefined,
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
      toast.success("Employee created successfully!", { id: toastId });
      setTimeout(() => {
        router.push("/dashboard/admin/employees");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
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
                  <TabsTrigger value="basic" className="text-xs md:text-sm hover:cursor-pointer">
                    <UserPlus className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>

                  <TabsTrigger value="job" className="text-xs md:text-sm hover:cursor-pointer">
                    <Briefcase className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Job</span>
                  </TabsTrigger>

                  <TabsTrigger value="salary" className="text-xs md:text-sm hover:cursor-pointer">
                    <DollarSign className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Salary</span>
                  </TabsTrigger>

                  <TabsTrigger value="bank" className="text-xs md:text-sm hover:cursor-pointer">
                    <CreditCard className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden sm:inline">Bank</span>
                  </TabsTrigger>

                  <TabsTrigger value="documents" className="text-xs md:text-sm hover:cursor-pointer">
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

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Complete address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={loading}
                        
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        placeholder="PIN Code"
                        value={formData.pincode}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>  
                
                  </div>

                  <div className="flex justify-end pt-4 hover:cursor-pointer">
                    <Button type="button" onClick={() => handleNext("job")} className="hover:cursor-pointer">
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
                {/* <TabsContent value="salary" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="basicSalary">Basic Salary *</Label>
                      <Input
                        id="basicSalary"
                        name="basicSalary"
                        type="number"
                        placeholder="Enter Basic Pay"
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otherAmount">Amount</Label>
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
                </TabsContent> */}

 <TabsContent value="salary" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="basicSalary">Basic Salary *</Label>
                      <Input
                        id="basicSalary"
                        name="basicSalary"
                        type="number"
                        placeholder="Enter Basic Pay"
                        value={formData.basicSalary}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* HRA with Type */}
                    <div className="space-y-2">
                      <Label htmlFor="hra">HRA</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hra"
                          name="hra"
                          type="number"
                          placeholder={formData.hraType === "percentage" ? "10" : "8000"}
                          value={formData.hra}
                          onChange={handleChange}
                          disabled={loading}
                          step="0.01"
                          className="flex-1"
                        />
                        <Select
                          value={formData.hraType}
                          onValueChange={(value) =>
                            handleSelectChange("hraType", value)
                          }
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.hra && formData.basicSalary && (
                        <p className="text-xs text-muted-foreground">
                          Amount: ₹
                          {formData.hraType === "percentage"
                            ? ((parseFloat(formData.basicSalary) * parseFloat(formData.hra)) / 100).toFixed(2)
                            : parseFloat(formData.hra).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Transport Allowances with Type */}
                    <div className="space-y-2">
                      <Label htmlFor="transportAllowances">
                        Transport Allowances
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="transportAllowances"
                          name="transportAllowances"
                          type="number"
                          placeholder={formData.transportType === "percentage" ? "5" : "3000"}
                          value={formData.transportAllowances}
                          onChange={handleChange}
                          disabled={loading}
                          min="0"
                          step="0.01"
                          className="flex-1"
                        />
                        <Select
                          value={formData.transportType}
                          onValueChange={(value) =>
                            handleSelectChange("transportType", value)
                          }
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.transportAllowances && formData.basicSalary && (
                        <p className="text-xs text-muted-foreground">
                          Amount: ₹
                          {formData.transportType === "percentage"
                            ? ((parseFloat(formData.basicSalary) * parseFloat(formData.transportAllowances)) / 100).toFixed(2)
                            : parseFloat(formData.transportAllowances).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Medical Allowances with Type */}
                    <div className="space-y-2">
                      <Label htmlFor="medicalAllowances">
                        Medical Allowances
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="medicalAllowances"
                          name="medicalAllowances"
                          type="number"
                          placeholder={formData.medicalType === "percentage" ? "5" : "3000"}
                          value={formData.medicalAllowances}
                          onChange={handleChange}
                          disabled={loading}
                          min="0"
                          step="0.01"
                          className="flex-1"
                        />
                        <Select
                          value={formData.medicalType}
                          onValueChange={(value) =>
                            handleSelectChange("medicalType", value)
                          }
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.medicalAllowances && formData.basicSalary && (
                        <p className="text-xs text-muted-foreground">
                          Amount: ₹
                          {formData.medicalType === "percentage"
                            ? ((parseFloat(formData.basicSalary) * parseFloat(formData.medicalAllowances)) / 100).toFixed(2)
                            : parseFloat(formData.medicalAllowances).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* PF with Type */}
                    <div className="space-y-2">
                      <Label htmlFor="pf">Provident Fund (PF)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="pf"
                          name="pf"
                          type="number"
                          placeholder={formData.pfType === "percentage" ? "12" : "1500"}
                          value={formData.pf}
                          onChange={handleChange}
                          disabled={loading}
                          min="0"
                          step="0.01"
                          className="flex-1"
                        />
                        <Select
                          value={formData.pfType}
                          onValueChange={(value) =>
                            handleSelectChange("pfType", value)
                          }
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.pf && formData.basicSalary && (
                        <p className="text-xs text-muted-foreground">
                          Amount: ₹
                          {formData.pfType === "percentage"
                            ? ((parseFloat(formData.basicSalary) * parseFloat(formData.pf)) / 100).toFixed(2)
                            : parseFloat(formData.pf).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Tax with Type */}
                    <div className="space-y-2">
                      <Label htmlFor="tax">Tax Deduction</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tax"
                          name="tax"
                          type="number"
                          placeholder={formData.taxType === "percentage" ? "10" : "1500"}
                          value={formData.tax}
                          onChange={handleChange}
                          disabled={loading}
                          min="0"
                          step="0.01"
                          className="flex-1"
                        />
                        <Select
                          value={formData.taxType}
                          onValueChange={(value) =>
                            handleSelectChange("taxType", value)
                          }
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.tax && formData.basicSalary && (
                        <p className="text-xs text-muted-foreground">
                          Amount: ₹
                          {formData.taxType === "percentage"
                            ? ((parseFloat(formData.basicSalary) * parseFloat(formData.tax)) / 100).toFixed(2)
                            : parseFloat(formData.tax).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Other Deductions */}
                    <div className="space-y-2">
                      <Label htmlFor="otherTitle">Other Deductions Title</Label>
                      <Input
                        id="otherTitle"
                        name="otherTitle"
                        type="text"
                        placeholder="Loan EMI"
                        value={formData.otherTitle}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otherAmount">Other Amount</Label>
                      <Input
                        id="otherAmount"
                        name="otherAmount"
                        type="number"
                        placeholder="500"
                        value={formData.otherAmount}
                        onChange={handleChange}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 pt-4 border-t">
                      <Label className="text-base">Net Salary (Auto-calculated)</Label>
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
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

                    
                    <div className="space-y-2">
                      <Label htmlFor="pfAccountNumber">PF Account No.</Label>
                      <Input
                        id="pfAccountNumber"
                        name="pfAccountNumber"
                        type="number"
                        placeholder="Enter PF Account"
                        value={formData.pfAccountNumber}
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
                      <Label htmlFor="pan">PAN Number *</Label>
                      <Input
                        id="pan"
                        name="pan"
                        placeholder="ABCDE1234F"
                        autoCapitalize="characters"
                        value={formData.pan}
                        onChange={handleChange}
                        disabled={loading}
                        maxLength={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhar Number *</Label>
                      <Input
                        id="aadhar"
                        name="aadhar"
                        type="number"
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
