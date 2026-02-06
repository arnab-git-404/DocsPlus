// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useTheme } from 'next-themes';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Moon, Sun, User, Settings, LogOut, FileText, Receipt, Mail } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// interface NavbarProps {
//   user?: {
//     name: string;
//     email: string;
//     role: 'ADMIN' | 'EMPLOYEE';
//   };
// }

// const Navbar = ( ) => {

//   const { user } = useAuth();

//   const router = useRouter();
//   const { theme, setTheme } = useTheme();
//   const [loading, setLoading] = useState(false);

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/auth/logout', {
//         method: 'POST',
//       });

//       if (response.ok) {
//         router.push('/login');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <nav className="border-b ">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Left side - Logo */}
//           <div className="flex items-center space-x-4">
//             <Link href={user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/employee'} className="flex items-center space-x-2">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//                 {/* <Receipt className="h-6 w-6" /> */}
//                 <img src="/logo.jpeg" alt="Logo" className="h-10 w-10" />
//               </div>
//               <span className="text-xl font-bold hidden sm:inline-block">Hackence</span>
//             </Link>
//           </div>

//           {/* Right side - Navigation items */}
//           <div className="flex items-center space-x-4">
//             {user && (
//               <>
//                 {/* Navigation Links */}
//                 <div className="hidden md:flex items-center space-x-1">
//                   {user.role === 'ADMIN' ? (
//                     <>
//                       <Button variant="ghost" asChild>
//                         <Link href="/dashboard/admin">
//                           <Settings className="mr-2 h-4 w-4" />
//                           Dashboard
//                         </Link>
//                       </Button>
//                       <Button variant="ghost" asChild>
//                         <Link href="/dashboard/admin/employees">
//                           <User className="mr-2 h-4 w-4" />
//                           Employees
//                         </Link>
//                       </Button>
//                       <Button variant="ghost" asChild>
//                         <Link href="/dashboard/admin/salary-slips">
//                           <FileText className="mr-2 h-4 w-4" />
//                           Salary Slips
//                         </Link>
//                       </Button>
//                       <Button variant="ghost" asChild>
//                         <Link href="/dashboard/admin/invoices">
//                           <Receipt className="mr-2 h-4 w-4" />
//                           Invoices
//                         </Link>
//                       </Button>
//                       <Button variant="ghost" asChild>
//                         <Link href="/dashboard/admin/offer-letters">
//                           <FileText className="mr-2 h-4 w-4" />
//                           Offer Letters
//                         </Link>
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button variant="ghost" asChild>
//                         <Link href="/dashboard/employee">
//                           <User className="mr-2 h-4 w-4" />
//                           Dashboard
//                         </Link>
//                       </Button>
//                       <Button variant="ghost" asChild>
//                         <Link href="/dashboard/employee/salary-slips">
//                           <FileText className="mr-2 h-4 w-4" />
//                           My Salary Slips
//                         </Link>
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Dark Mode Toggle */}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//               className="h-9 w-9"
//             >
//               <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//               <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               <span className="sr-only">Toggle theme</span>
//             </Button>

//             {/* Profile Dropdown */}
//             {user && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                     <Avatar className="h-9 w-9">
//                       <AvatarImage src="" alt={user.name} />
//                       <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
//                     </Avatar>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-56" align="end" forceMount>
//                   <DropdownMenuLabel className="font-normal">
//                     <div className="flex flex-col space-y-1">
//                       <p className="text-sm font-medium leading-none">{user.name}</p>
//                       <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//                       <p className="text-xs leading-none text-muted-foreground mt-1">
//                         <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
//                           {user.role}
//                         </span>
//                       </p>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem asChild>
//                     <Link href="/dashboard/profile" className="cursor-pointer">
//                       <User className="mr-2 h-4 w-4" />
//                       <span>Profile</span>
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link href="/dashboard/settings" className="cursor-pointer">
//                       <Settings className="mr-2 h-4 w-4" />
//                       <span>Settings</span>
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     className="cursor-pointer text-red-600 focus:text-red-600"
//                     onClick={handleLogout}
//                     disabled={loading}
//                   >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>{loading ? 'Logging out...' : 'Log out'}</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut, 
  FileText, 
  Receipt, 
  Mail,
  Menu,
  X,
  Home,
  Users as UsersIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        localStorage.clear();
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const adminNavItems = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: Home },
    { href: '/dashboard/admin/employees', label: 'Employees', icon: UsersIcon },
    { href: '/dashboard/admin/salary-slips', label: 'Salary Slips', icon: FileText },
    { href: '/dashboard/admin/invoices', label: 'Invoices', icon: Receipt },
    { href: '/dashboard/admin/offer-letters', label: 'Offer Letters', icon: Mail },
  ];

  const employeeNavItems = [
    { href: '/dashboard/employee', label: 'Dashboard', icon: Home },
    // { href: '/dashboard/employee/salary-slips', label: 'My Salary Slips', icon: FileText },
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems : employeeNavItems;

  return (
    <nav className="border-b bg-background/95 backdrop-blur ">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              href={user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/employee'} 
              className="flex items-center space-x-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground overflow-hidden">
                <img src={process.env.NEXT_PUBLIC_APP_LOGO!} alt="Logo" className="h-10 w-10 object-cover" />
              </div>
              <span className="text-2xl font-bold hidden sm:inline-block">{process.env.NEXT_PUBLIC_COMPANY_NAME}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user && navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button key={item.href} variant="ghost" asChild>
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Right side - Desktop: Theme Toggle & Profile | Mobile: Theme Toggle & Hamburger */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 hover:cursor-pointer "
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Desktop Profile Dropdown */}
            {user && (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:cursor-pointer">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {user.role}
                          </span>
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{loading ? 'Logging out...' : 'Log out'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            {user && (
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">

                    {/* <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                      <SheetDescription>
                        Navigate through the application
                      </SheetDescription>
                    </SheetHeader> */}
                    
                    <div className="flex flex-col space-y-4 mt-6">
                      {/* User Profile Section */}
                      <div className="flex items-center space-x-4 rounded-lg border p-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      {/* Navigation Links */}
                      <nav className="flex flex-col space-y-1">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </nav>

                      <Separator />

                      {/* Profile & Settings */}
                      <div className="flex flex-col space-y-1">
                        <Link
                          href="/dashboard/profile"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <Settings className="h-5 w-5" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      <Separator />

                      {/* Logout Button */}
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={() => {
                          closeMobileMenu();
                          handleLogout();
                        }}
                        disabled={loading}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        {loading ? 'Logging out...' : 'Log out'}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;