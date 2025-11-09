"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Beams from "@/components/Beams";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative">
      <div className="w-full h-screen relative">
        <Beams
          beamWidth={3}
          beamHeight={16}
          beamNumber={12}
          lightColor="#ffffff"
          speed={4}
          noiseIntensity={1.75}
          scale={0.3}
          rotation={30}
        />

        <div className="absolute inset-0">
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={180}
              height={180}
              loading="eager"
              priority
              className="mb-8 rounded-full object-cover"
            />
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4">
              Welcome to DocsPlus
            </h1>
            <p className="text-lg md:text-2xl text-white mb-8 max-w-2xl">
              Generate and manage salary slips with ease. Streamline your payroll process today!
            </p>
            <Button
              size="lg"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}