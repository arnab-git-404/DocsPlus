'use client';
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await getUser(); --  remove this later

  const { user, loading } = useAuth();
  const router = useRouter();
  
      useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }


  // const user: { name: string; email: string; role: "ADMIN" | "EMPLOYEE" } = {
  //   name: "John Doe",
  //   email: "example@gmail.com",
  //   role: "ADMIN",
  // };

  if (!user) {
    null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
