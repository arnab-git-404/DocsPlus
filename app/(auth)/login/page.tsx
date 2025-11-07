"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 , Eye, EyeOff} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'EMPLOYEE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

      const toastId = toast.loading("Logging in...");


    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      await refreshUser();

      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/employee');
      }
      
      router.refresh();
          toast.success(`Logged in successfully!`, { id: toastId });

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Login failed!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Login as</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}

              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem  className='hover:cursor-pointer' value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem className='hover:cursor-pointer' value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>

              <div className="relative">  
              <Input
                id="password"
                name="password"
                // type="password"
                 type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                </div> 

              <Label className='hover:cursor-pointer hover:text-red-400 '><Link href="/forgot-password">
                Forget Password?
              </Link>
              </Label>

            </div>
          </CardContent>

          <CardFooter className=" flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="hover:cursor-pointer w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;