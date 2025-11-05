// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//   Loader2,
//   Plus,
//   Search,
//   MoreVertical,
//   Eye,
//   Edit,
//   Download,
//   Trash2,
//   FileText,
//   Filter,
// } from 'lucide-react';

// interface SalarySlip {
//   _id: string;
//   employee: {
//     userId: string;
//     name: string;
//     email: string;
//     employeeId: string;
//     designation: string;
//   };
//   salary: {
//     month: string;
//     year: number;
//     basicSalary: number;
//     grossSalary: number;
//     netSalary: number;
//   };
//   status: 'DRAFT' | 'GENERATED' | 'SENT';
//   createdAt: string;
// }

// export default function SalarySlipsDashboard() {
//   const router = useRouter();
//   const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
//   const [filteredSlips, setFilteredSlips] = useState<SalarySlip[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('ALL');
//   const [monthFilter, setMonthFilter] = useState<string>('ALL');
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   useEffect(() => {
//     fetchSalarySlips();
//   }, []);

//   useEffect(() => {
//     filterSlips();
//   }, [searchTerm, statusFilter, monthFilter, salarySlips]);

//   const fetchSalarySlips = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/salary-slip');
      
//       if (response.ok) {
//         const data = await response.json();
//         setSalarySlips(data.salarySlips || []);
//       }
//     } catch (error) {
//       console.error('Failed to fetch salary slips:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterSlips = () => {
//     let filtered = [...salarySlips];

//     // Search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (slip) =>
//           slip.employee.name.toLowerCase().includes(term) ||
//           slip.employee.email.toLowerCase().includes(term) ||
//           slip.employee.employeeId.toLowerCase().includes(term)
//       );
//     }

//     // Status filter
//     if (statusFilter !== 'ALL') {
//       filtered = filtered.filter((slip) => slip.status === statusFilter);
//     }

//     // Month filter
//     if (monthFilter !== 'ALL') {
//       filtered = filtered.filter((slip) => slip.salary.month === monthFilter);
//     }

//     setFilteredSlips(filtered);
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;

//     try {
//       setDeleteLoading(true);
//       const response = await fetch(`/api/salary-slip/${deleteId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setSalarySlips((prev) => prev.filter((slip) => slip._id !== deleteId));
//         setDeleteId(null);
//       }
//     } catch (error) {
//       console.error('Failed to delete:', error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleDownload = async (id: string) => {
//     try {
//       // Open preview in new tab (user can download from there)
//       window.open(`/preview?type=salary-slip&id=${id}`, '_blank');
//     } catch (error) {
//       console.error('Failed to download:', error);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, string> = {
//       DRAFT: 'bg-gray-100 text-gray-800',
//       GENERATED: 'bg-blue-100 text-blue-800',
//       SENT: 'bg-green-100 text-green-800',
//     };

//     return (
//       <Badge className={variants[status] || variants.DRAFT}>
//         {status}
//       </Badge>
//     );
//   };

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const stats = {
//     total: salarySlips.length,
//     draft: salarySlips.filter(s => s.status === 'DRAFT').length,
//     generated: salarySlips.filter(s => s.status === 'GENERATED').length,
//     sent: salarySlips.filter(s => s.status === 'SENT').length,
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Salary Slips</h1>
//           <p className="text-muted-foreground mt-1">
//             Manage employee salary slips
//           </p>
//         </div>
//         <Button onClick={() => router.push('/dashboard/admin/salary-slips/new')}>
//           <Plus className="h-4 w-4 mr-2" />
//           Generate New
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Total Slips</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.total}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Draft</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Generated</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">{stats.generated}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Sent</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Search & Filter</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 md:grid-cols-4">
//             <div className="md:col-span-2 relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by name, email, or employee ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9"
//               />
//             </div>

//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All Status</SelectItem>
//                 <SelectItem value="DRAFT">Draft</SelectItem>
//                 <SelectItem value="GENERATED">Generated</SelectItem>
//                 <SelectItem value="SENT">Sent</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={monthFilter} onValueChange={setMonthFilter}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by month" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All Months</SelectItem>
//                 {months.map((month) => (
//                   <SelectItem key={month} value={month}>
//                     {month}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Table */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Employee</TableHead>
//                 <TableHead>Employee ID</TableHead>
//                 <TableHead>Designation</TableHead>
//                 <TableHead>Period</TableHead>
//                 <TableHead className="text-right">Net Salary</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Created</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredSlips.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center py-8">
//                     <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
//                     <p className="text-muted-foreground">
//                       {searchTerm || statusFilter !== 'ALL' || monthFilter !== 'ALL'
//                         ? 'No salary slips match your filters'
//                         : 'No salary slips generated yet'}
//                     </p>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredSlips.map((slip) => (
//                   <TableRow key={slip._id}>
//                     <TableCell>
//                       <div>
//                         <p className="font-medium">{slip.employee.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {slip.employee.email}
//                         </p>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <code className="text-sm">{slip.employee.employeeId}</code>
//                     </TableCell>
//                     <TableCell>{slip.employee.designation}</TableCell>
//                     <TableCell>
//                       {slip.salary.month} {slip.salary.year}
//                     </TableCell>
//                     <TableCell className="text-right font-semibold">
//                       ₹{slip.salary.netSalary.toLocaleString('en-IN')}
//                     </TableCell>
//                     <TableCell>{getStatusBadge(slip.status)}</TableCell>
//                     <TableCell>
//                       {new Date(slip.createdAt).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                       })}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => router.push(`/dashboard/admin/salary-slips/view/${slip._id}`)}
//                           >
//                             <Eye className="h-4 w-4 mr-2" />
//                             View Details
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => router.push(`/dashboard/admin/salary-slips/edit/${slip._id}`)}
//                           >
//                             <Edit className="h-4 w-4 mr-2" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => handleDownload(slip._id)}>
//                             <Download className="h-4 w-4 mr-2" />
//                             Download PDF
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setDeleteId(slip._id)}
//                             className="text-red-600"
//                           >
//                             <Trash2 className="h-4 w-4 mr-2" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the salary slip.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={deleteLoading}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               {deleteLoading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 'Delete'
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }






"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Loader2,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Download,
  Trash2,
  FileText,
  RefreshCw,
} from 'lucide-react';

interface SalarySlip {
  _id: string;
  employee: {
    userId: string;
    name: string;
    email: string;
    employeeId: string;
    designation: string;
  };
  salary: {
    month: string;
    year: number;
    basicSalary: number;
    grossSalary: number;
    netSalary: number;
  };
  status: 'DRAFT' | 'GENERATED' | 'SENT';
  createdAt: string;
}

const CACHE_KEY = 'salary_slips_list';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function SalarySlipsDashboard() {
  const router = useRouter();
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
  const [filteredSlips, setFilteredSlips] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSalarySlips();
  }, []);

  useEffect(() => {
    filterSlips();
  }, [searchTerm, statusFilter, monthFilter, salarySlips]);

  const fetchSalarySlips = async (forceRefresh = false) => {
    try {
      setLoading(true);

      // Check localStorage first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const cached = JSON.parse(cachedData);
          // Check if cache is still valid (less than 5 minutes old)
          if (Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('📦 Using cached salary slips list');
            setSalarySlips(cached.data);
            setLoading(false);
            return;
          }
        }
      }

      // Fetch from API
      console.log('🌐 Fetching salary slips from API');
      const response = await fetch('/api/salary-slip');
      
      if (response.ok) {
        const data = await response.json();
        const slips = data.salarySlips || [];
        setSalarySlips(slips);

        // Cache the list
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: slips,
            timestamp: Date.now(),
          })
        );

        // Also cache individual slip basic data for faster detail page loading
        slips.forEach((slip: SalarySlip) => {
          const slipCacheKey = `salary_slip_basic_${slip._id}`;
          localStorage.setItem(
            slipCacheKey,
            JSON.stringify({
              data: slip,
              timestamp: Date.now(),
            })
          );
        });

        console.log('✅ Cached', slips.length, 'salary slips');
      }
    } catch (error) {
      console.error('Failed to fetch salary slips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSalarySlips(true);
  };

  const filterSlips = () => {
    let filtered = [...salarySlips];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (slip) =>
          slip.employee.name.toLowerCase().includes(term) ||
          slip.employee.email.toLowerCase().includes(term) ||
          slip.employee.employeeId.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((slip) => slip.status === statusFilter);
    }

    // Month filter
    if (monthFilter !== 'ALL') {
      filtered = filtered.filter((slip) => slip.salary.month === monthFilter);
    }

    setFilteredSlips(filtered);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/salary-slip/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from state
        setSalarySlips((prev) => prev.filter((slip) => slip._id !== deleteId));
        
        // Clear cache
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(`salary_slip_${deleteId}`);
        localStorage.removeItem(`salary_slip_basic_${deleteId}`);
        
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      window.open(`/preview?type=salary-slip&id=${id}`, '_blank');
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const handleViewDetails = (id: string) => {
    // Pre-cache the basic data for faster loading
    const slip = salarySlips.find(s => s._id === id);
    if (slip) {
      localStorage.setItem(
        `salary_slip_basic_${id}`,
        JSON.stringify({
          data: slip,
          timestamp: Date.now(),
        })
      );
    }
    router.push(`/dashboard/admin/salary-slips/view/${id}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      GENERATED: 'bg-blue-100 text-blue-800',
      SENT: 'bg-green-100 text-green-800',
    };

    return (
      <Badge className={variants[status] || variants.DRAFT}>
        {status}
      </Badge>
    );
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const stats = {
    total: salarySlips.length,
    draft: salarySlips.filter(s => s.status === 'DRAFT').length,
    generated: salarySlips.filter(s => s.status === 'GENERATED').length,
    sent: salarySlips.filter(s => s.status === 'SENT').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading salary slips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Salary Slips</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee salary slips
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => router.push('/dashboard/admin/salary-slips/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Slips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Draft</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.generated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            
            <div className="md:col-span-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="GENERATED">Generated</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'ALL' || monthFilter !== 'ALL'
                        ? 'No salary slips match your filters'
                        : 'No salary slips generated yet'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSlips.map((slip) => (
                  <TableRow key={slip._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{slip.employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {slip.employee.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{slip.employee.employeeId}</code>
                    </TableCell>
                    <TableCell>{slip.employee.designation}</TableCell>
                    <TableCell>
                      {slip.salary.month} {slip.salary.year}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{slip.salary.netSalary.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>{getStatusBadge(slip.status)}</TableCell>
                    <TableCell>
                      {new Date(slip.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(slip._id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/admin/salary-slips/edit/${slip._id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(slip._id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(slip._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the salary slip.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}