'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
  <div className="text-center space-y-6">
    <h1 className="text-4xl font-bold">Welcome to Slip Generator</h1>
    <div className="flex justify-center">
      <Button 
        onClick={() => router.push('/login')}
        className=" hover:cursor-pointer px-8"
      >
        Login
      </Button>
    </div>
  </div> 
</div>
  );
}
