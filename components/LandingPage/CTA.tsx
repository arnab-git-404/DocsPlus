"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="relative py-20 px-4 md:py-28 bg-[#060010] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to scale your team?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop wrestling with spreadsheets. Automate your HR operations today
          with {process.env.NEXT_PUBLIC_COMPANY_NAME} and focus on what matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="hover:cursor-pointer bg-white text-[#060010] hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
            onClick={() => router.push("/login")}
          >
            Start Your Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="hover:cursor-pointer border-2 border-white  text-[#060010] dark:text-white hover:bg-white hover:text-blue-400 font-semibold px-8 py-6 text-lg"
            onClick={() => window.location.href = "mailto:mukherjeearnab988@gmail.com?subject=Request for Sales Call&body=Hi, I would like to schedule a call to discuss DocsPlus."}
          >
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
