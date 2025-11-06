
'use client';

import { verify } from 'jsonwebtoken';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import SalarySlip from '@/models/SalarySlip';
import Invoice from '@/models/Invoice';
import OfferLetter from '@/models/OfferLetter';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Receipt, Mail, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  totalSalarySlips: number;
  totalInvoices: number;
  totalOfferLetters: number;
}

export default  function AdminDashboardPage() {
  const { user , refreshUser } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalSalarySlips: 0,
    totalInvoices: 0,
    totalOfferLetters: 0,
  });
 const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if( !user ){
      router.push('/login');
      return;
    }

    if ( user.role !== 'ADMIN' ) {
      router.push('/dashboard/employee');
      return;
    }
    
    fetchStats();
  }, [user, router]);


  const fetchStats = async () => {
    try{
      setLoading(true);
      const response =  await fetch('/api/admin/dashboard-stats');
      
      if( !response.ok ){
        throw new Error('Failed to fetch Dashboard stats');
      }
      
      const data = await response.json();
      setStats(data);
    }catch(error){
      console.error('Error fetching dashboard stats:', error);
    }finally{
      setLoading(false);
    }
  }
  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalUsers,
      description: `${stats.activeUsers} active, ${stats.pendingUsers} pending`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Salary Slips',
      value: stats.totalSalarySlips,
      description: 'Total generated this month',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Invoices',
      value: stats.totalInvoices,
      description: 'Total invoices created',
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Offer Letters',
      value: stats.totalOfferLetters,
      description: 'Sent this month',
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your organization efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard/admin/employees/new"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer group"
            >
              <Users className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-primary" />
              <span className="text-sm font-medium">Add New Employee</span>
            </Link>
            <Link
              href="/dashboard/admin/salary-slips/new"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer group"
            >
              <FileText className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-primary" />
              <span className="text-sm font-medium">Generate Salary Slip</span>
            </Link>
            <Link
              href="/dashboard/admin/invoices/new"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer group"
            >
              <Receipt className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-primary" />
              <span className="text-sm font-medium">Create Invoice</span>
            </Link>
            <Link
              href="/dashboard/admin/offer-letters/new"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer group"
            >
              <Mail className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-primary" />
              <span className="text-sm font-medium">Send Offer Letter</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New employee registered</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Salary slip generated</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Invoice created</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Monthly Overview
            </CardTitle>
            <CardDescription>Performance metrics for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Salary Slips Generated</span>
                <span className="text-sm font-bold">{stats.totalSalarySlips}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Invoices Created</span>
                <span className="text-sm font-bold">{stats.totalInvoices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Offer Letters Sent</span>
                <span className="text-sm font-bold">{stats.totalOfferLetters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Employees</span>
                <span className="text-sm font-bold">{stats.totalUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}