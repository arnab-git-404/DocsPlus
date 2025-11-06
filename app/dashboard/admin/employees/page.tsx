"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
import { Switch } from '@/components/ui/switch';
import {
  Loader2,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileText,
  Users,
  Download,
  RefreshCw,
  ChevronLeft,
  UserPlus,
  ChevronRight,
} from 'lucide-react';

interface Employee {
  _id: string;
  userId: string;
  name: string;
  email: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  hasMore: boolean;
}

const CACHE_KEY = 'employees_list';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const ITEMS_PER_PAGE = 10;

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalEmployees: 0,
    hasMore: false,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const fetchEmployees = async (forceRefresh = false) => {
    try {
      setLoading(true);

      // Check cache first (unless force refresh)
      if (!forceRefresh && currentPage === 1) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const cached = JSON.parse(cachedData);
          if (Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('📦 Using cached employees list');
            setEmployees(cached.data.employees);
            setPagination(cached.data.pagination);
            setLoading(false);
            return;
          }
        }
      }

      // Fetch from API
      console.log('🌐 Fetching employees from API');
      const response = await fetch(`/api/admin/employees?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
        setPagination(data.pagination);

        // Cache only the first page
        if (currentPage === 1) {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data,
              timestamp: Date.now(),
            })
          );
        }

        console.log('✅ Cached employees data');
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchEmployees(true);
  };

  const filterEmployees = () => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.employeeId.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
    );

    setFilteredEmployees(filtered);
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      setStatusUpdating(id);
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === id ? { ...emp, status: newStatus as 'ACTIVE' | 'INACTIVE' } : emp
          )
        );

        // Clear cache
        localStorage.removeItem(CACHE_KEY);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      const id = deleteId;
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees((prev) => prev.filter((emp) => emp._id !== deleteId));
        localStorage.removeItem(CACHE_KEY);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExportLoading(true);

      const response = await fetch('/api/admin/employees/csv');
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleGenerateSalarySlip = (employeeId: string) => {
    router.push(`/dashboard/admin/salary-slips/new?employeeId=${employeeId}`);
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    );
  };

  const stats = {
    total: pagination?.totalEmployees,
    active: employees.filter(e => e.status === 'ACTIVE').length,
    inactive: employees.filter(e => e.status === 'INACTIVE' || e.status === 'PENDING').length,
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's employees
          </p>
        </div>
        
        {/* <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export CSV
          </Button>
          <Button onClick={() => router.push('/dashboard/admin/users/new')}>
            <Users className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div> */}

<div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw className={`h-4 w-4 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Reload</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={exportLoading}
            className="flex-1 sm:flex-none"
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Export CSV</span>
             <span className="sm:hidden">Export</span>
          </Button>
          <Button 
            size="sm" 
            onClick={() => router.push('/dashboard/admin/employees/new')}
            className="flex-1 sm:flex-none"
          >
            <UserPlus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, employee ID, designation, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
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
                <TableHead>Department</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No employees match your search' : 'No employees found'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{employee.employeeId}</code>
                    </TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      {new Date(employee.joiningDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {/* ₹{employee.salary.toLocaleString('en-IN')} */}
                      ₹{employee?.salary ? employee.salary.toLocaleString('en-IN') : '0'}

                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(employee.status)}
                        <Switch
                          checked={employee.status === 'ACTIVE'}
                          onCheckedChange={() => handleStatusToggle(employee._id, employee.status)}
                          disabled={statusUpdating === employee._id}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/admin/users/view/${employee._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/admin/users/edit/${employee._id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleGenerateSalarySlip(employee._id)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Salary Slip
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(employee._id)}
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

          {/* Pagination */}
          {!searchTerm && pagination?.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalEmployees)} of{' '}
                {pagination.totalEmployees} employees
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          disabled={loading}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee and all associated data.
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






















// ui enhanced ==============
// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
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
// import { Switch } from '@/components/ui/switch';
// import {
//   Loader2,
//   Search,
//   MoreVertical,
//   Eye,
//   Edit,
//   Trash2,
//   FileText,
//   Users,
//   Download,
//   RefreshCw,
//   ChevronLeft,
//   ChevronRight,
//   UserPlus,
// } from 'lucide-react';

// interface Employee {
//   _id: string;
//   userId: string;
//   name: string;
//   email: string;
//   employeeId: string;
//   designation: string;
//   department: string;
//   joiningDate: string;
//   salary: number;
//   status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
//   createdAt: string;
// }

// interface PaginationData {
//   currentPage: number;
//   totalPages: number;
//   totalEmployees: number;
//   hasMore: boolean;
// }

// const CACHE_KEY = 'employees_list';
// const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
// const ITEMS_PER_PAGE = 10;

// export default function EmployeesPage() {
//   const router = useRouter();
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination] = useState<PaginationData>({
//     currentPage: 1,
//     totalPages: 1,
//     totalEmployees: 0,
//     hasMore: false,
//   });
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
//   const [exportLoading, setExportLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//   }, [currentPage]);

//   useEffect(() => {
//     filterEmployees();
//   }, [searchTerm, employees]);

//   const fetchEmployees = async (forceRefresh = false) => {
//     try {
//       setLoading(true);

//       // Check cache first (unless force refresh)
//       if (!forceRefresh && currentPage === 1) {
//         const cachedData = localStorage.getItem(CACHE_KEY);
//         if (cachedData) {
//           const cached = JSON.parse(cachedData);
//           if (Date.now() - cached.timestamp < CACHE_DURATION) {
//             console.log('📦 Using cached employees list');
//             setEmployees(cached.data.employees);
//             setPagination(cached.data.pagination);
//             setLoading(false);
//             return;
//           }
//         }
//       }

//       // Fetch from API
//       console.log('🌐 Fetching employees from API');
//       const response = await fetch(`/api/admin/employees?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      
//       if (response.ok) {
//         const data = await response.json();
//         setEmployees(data.employees);
//         setPagination(data.pagination);

//         // Cache only the first page
//         if (currentPage === 1) {
//           localStorage.setItem(
//             CACHE_KEY,
//             JSON.stringify({
//               data,
//               timestamp: Date.now(),
//             })
//           );
//         }

//         console.log('✅ Cached employees data');
//       }
//     } catch (error) {
//       console.error('Failed to fetch employees:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     setCurrentPage(1);
//     fetchEmployees(true);
//   };

//   const filterEmployees = () => {
//     if (!searchTerm) {
//       setFilteredEmployees(employees);
//       return;
//     }

//     const term = searchTerm.toLowerCase();
//     const filtered = employees.filter(
//       (emp) =>
//         emp.name.toLowerCase().includes(term) ||
//         emp.email.toLowerCase().includes(term) ||
//         emp.employeeId.toLowerCase().includes(term) ||
//         emp.designation.toLowerCase().includes(term) ||
//         emp.department.toLowerCase().includes(term)
//     );

//     setFilteredEmployees(filtered);
//   };

//   const handleStatusToggle = async (id: string, currentStatus: string) => {
//     try {
//       setStatusUpdating(id);
//       const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

//       const response = await fetch(`/api/admin/employees/${id}/status`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (response.ok) {
//         // Update local state
//         setEmployees((prev) =>
//           prev.map((emp) =>
//             emp._id === id ? { ...emp, status: newStatus as 'ACTIVE' | 'INACTIVE' } : emp
//           )
//         );

//         // Clear cache
//         localStorage.removeItem(CACHE_KEY);
//       }
//     } catch (error) {
//       console.error('Failed to update status:', error);
//     } finally {
//       setStatusUpdating(null);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;

//     try {
//       setDeleteLoading(true);
//       const response = await fetch(`/api/admin/employees/${deleteId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setEmployees((prev) => prev.filter((emp) => emp._id !== deleteId));
//         localStorage.removeItem(CACHE_KEY);
//         setDeleteId(null);
//       }
//     } catch (error) {
//       console.error('Failed to delete:', error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleExportCSV = async () => {
//     try {
//       setExportLoading(true);

//       const response = await fetch('/api/admin/employees/export');
//       const blob = await response.blob();
      
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error('Failed to export:', error);
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   const handleGenerateSalarySlip = (employeeId: string) => {
//     router.push(`/dashboard/admin/salary-slips/new?employeeId=${employeeId}`);
//   };

//   const getStatusBadge = (status: string) => {
//     return status === 'ACTIVE' ? (
//       <Badge className="bg-green-100 text-green-800">Active</Badge>
//     ) : (
//       <Badge className="bg-red-100 text-red-800">Inactive</Badge>
//     );
//   };

//   const stats = {
//     total: pagination?.totalEmployees || 0,
//     active: employees.filter(e => e.status === 'ACTIVE').length,
//     inactive: employees.filter(e => e.status === 'INACTIVE' || e.status === 'PENDING').length,
//   };

//   if (loading && currentPage === 1) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
//           <p className="text-sm text-muted-foreground">Loading employees...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 md:space-y-6 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
//           <p className="text-sm md:text-base text-muted-foreground mt-1">
//             Manage your organization's employees
//           </p>
//         </div>
        
//         {/* Action Buttons - Mobile Optimized */}
//         <div className="flex flex-wrap gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="flex-1 sm:flex-none"
//           >
//             <RefreshCw className={`h-4 w-4 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             <span className="hidden sm:inline">Refresh</span>
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleExportCSV}
//             disabled={exportLoading}
//             className="flex-1 sm:flex-none"
//           >
//             {exportLoading ? (
//               <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
//             ) : (
//               <Download className="h-4 w-4 sm:mr-2" />
//             )}
//             <span className="hidden sm:inline">Export CSV</span>
//           </Button>
//           <Button 
//             size="sm" 
//             onClick={() => router.push('/dashboard/admin/users/new')}
//             className="flex-1 sm:flex-none"
//           >
//             <UserPlus className="h-4 w-4 sm:mr-2" />
//             <span className="hidden sm:inline">Add Employee</span>
//             <span className="sm:hidden">Add</span>
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards - Mobile Optimized */}
//       <div className="grid grid-cols-3 gap-2 md:gap-4">
//         <Card>
//           <CardHeader className="pb-2 p-4 md:p-6">
//             <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
//               Total
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-4 md:p-6 pt-0">
//             <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2 p-4 md:p-6">
//             <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
//               Active
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-4 md:p-6 pt-0">
//             <div className="text-xl md:text-2xl font-bold text-green-600">{stats.active}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2 p-4 md:p-6">
//             <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
//               Inactive
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-4 md:p-6 pt-0">
//             <div className="text-xl md:text-2xl font-bold text-red-600">{stats.inactive}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search */}
//       <Card>
//         <CardContent className="p-4 md:pt-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search employees..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-9 text-sm"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Desktop Table View */}
//       <Card className="hidden lg:block">
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Employee</TableHead>
//                 <TableHead>Employee ID</TableHead>
//                 <TableHead>Designation</TableHead>
//                 <TableHead>Department</TableHead>
//                 <TableHead>Joining Date</TableHead>
//                 <TableHead className="text-right">Salary</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredEmployees.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center py-8">
//                     <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
//                     <p className="text-muted-foreground">
//                       {searchTerm ? 'No employees match your search' : 'No employees found'}
//                     </p>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredEmployees.map((employee) => (
//                   <TableRow key={employee._id}>
//                     <TableCell>
//                       <div>
//                         <p className="font-medium">{employee.name}</p>
//                         <p className="text-sm text-muted-foreground">{employee.email}</p>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <code className="text-sm">{employee.employeeId}</code>
//                     </TableCell>
//                     <TableCell>{employee.designation}</TableCell>
//                     <TableCell>{employee.department}</TableCell>
//                     <TableCell>
//                       {new Date(employee.joiningDate).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                       })}
//                     </TableCell>
//                     <TableCell className="text-right font-semibold">
//                       ₹{employee?.salary ? employee.salary.toLocaleString('en-IN') : '0'}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         {getStatusBadge(employee.status)}
//                         <Switch
//                           checked={employee.status === 'ACTIVE'}
//                           onCheckedChange={() => handleStatusToggle(employee._id, employee.status)}
//                           disabled={statusUpdating === employee._id}
//                         />
//                       </div>
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
//                             onClick={() => router.push(`/dashboard/admin/users/view/${employee._id}`)}
//                           >
//                             <Eye className="h-4 w-4 mr-2" />
//                             View Profile
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => router.push(`/dashboard/admin/users/edit/${employee._id}`)}
//                           >
//                             <Edit className="h-4 w-4 mr-2" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => handleGenerateSalarySlip(employee._id)}
//                           >
//                             <FileText className="h-4 w-4 mr-2" />
//                             Generate Salary Slip
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => setDeleteId(employee._id)}
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

//       {/* Mobile Card View */}
//       <div className="lg:hidden space-y-3">
//         {filteredEmployees.length === 0 ? (
//           <Card>
//             <CardContent className="text-center py-12">
//               <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
//               <p className="text-muted-foreground text-sm">
//                 {searchTerm ? 'No employees match your search' : 'No employees found'}
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           filteredEmployees.map((employee) => (
//             <Card key={employee._id}>
//               <CardContent className="p-4">
//                 <div className="space-y-3">
//                   {/* Header with Name and Actions */}
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-base truncate">{employee.name}</h3>
//                       <p className="text-xs text-muted-foreground truncate">{employee.email}</p>
//                     </div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={() => router.push(`/dashboard/admin/users/view/${employee._id}`)}
//                         >
//                           <Eye className="h-4 w-4 mr-2" />
//                           View Profile
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => router.push(`/dashboard/admin/users/edit/${employee._id}`)}
//                         >
//                           <Edit className="h-4 w-4 mr-2" />
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={() => handleGenerateSalarySlip(employee._id)}
//                         >
//                           <FileText className="h-4 w-4 mr-2" />
//                           Generate Salary Slip
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={() => setDeleteId(employee._id)}
//                           className="text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   {/* Details Grid */}
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Employee ID</p>
//                       <code className="text-xs">{employee.employeeId}</code>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Designation</p>
//                       <p className="text-xs font-medium truncate">{employee.designation}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Department</p>
//                       <p className="text-xs font-medium truncate">{employee.department}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Joining Date</p>
//                       <p className="text-xs font-medium">
//                         {new Date(employee.joiningDate).toLocaleDateString('en-US', {
//                           month: 'short',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Salary and Status */}
//                   <div className="flex items-center justify-between pt-2 border-t">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Salary</p>
//                       <p className="text-sm font-bold">
//                         ₹{employee?.salary ? employee.salary.toLocaleString('en-IN') : '0'}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {getStatusBadge(employee.status)}
//                       <Switch
//                         checked={employee.status === 'ACTIVE'}
//                         onCheckedChange={() => handleStatusToggle(employee._id, employee.status)}
//                         disabled={statusUpdating === employee._id}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>

//       {/* Pagination - Mobile Optimized */}
//       {!searchTerm && pagination?.totalPages > 1 && (
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
//                 Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
//                 {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalEmployees)} of{' '}
//                 {pagination.totalEmployees}
//               </div>
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1 || loading}
//                   className="h-8 px-2 sm:px-3"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   <span className="hidden sm:inline ml-1">Previous</span>
//                 </Button>
                
//                 {/* Page Numbers - Simplified for mobile */}
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (page) =>
//                         page === 1 ||
//                         page === pagination.totalPages ||
//                         Math.abs(page - currentPage) <= 1
//                     )
//                     .map((page, index, array) => (
//                       <React.Fragment key={page}>
//                         {index > 0 && array[index - 1] !== page - 1 && (
//                           <span className="px-1 text-xs">...</span>
//                         )}
//                         <Button
//                           variant={currentPage === page ? 'default' : 'outline'}
//                           size="sm"
//                           onClick={() => setCurrentPage(page)}
//                           disabled={loading}
//                           className="h-8 w-8 p-0 text-xs"
//                         >
//                           {page}
//                         </Button>
//                       </React.Fragment>
//                     ))}
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
//                   disabled={currentPage === pagination.totalPages || loading}
//                   className="h-8 px-2 sm:px-3"
//                 >
//                   <span className="hidden sm:inline mr-1">Next</span>
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription className="text-sm">
//               This action cannot be undone. This will permanently delete the employee and all associated data.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="flex-col sm:flex-row gap-2">
//             <AlertDialogCancel disabled={deleteLoading} className="w-full sm:w-auto">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={deleteLoading}
//               className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
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