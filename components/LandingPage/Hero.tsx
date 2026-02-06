"use client";

import LaserFlow from "@/components/LaserFlow";
import { useRef } from "react";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

{/* <section style={{position: 'relative',height: 500,overflow: 'hidden'}}>
  <div style={{ height: '100%',overflowY: 'auto',padding: '6rem 2rem' }}>
    <!-- Content Here - such as an image or text -->
  </div>

  
</section> */}


export default function Hero() {
  //   const revealRef = useRef<HTMLImageElement>(null);
  const revealImgRef = useRef<HTMLImageElement>(null);

  const updateMask = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    }
  };

  const resetMask = () => {
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty("--mx", "-9999px");
      el.style.setProperty("--my", "-9999px");
    }
  };

  return (
    <section
      onMouseMove={updateMask}
      onMouseLeave={resetMask}
      className="relative h-screen w-full overflow-hidden bg-[#060010]"
    >
      {/* FX BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <LaserFlow
          color="#CF9EFF"
          horizontalBeamOffset={0.18}
          verticalBeamOffset={-0.5}
          horizontalSizing={0.6}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.45}
          fogScale={0.3}
          fogFallSpeed={0.6}
          decay={1.1}
          falloffStart={1.2}
        />
      </div>

      {/* REVEAL IMAGE */}
      <img
        ref={revealImgRef}
        src="/image.png"
        alt="Hero glow reveal"
        className="absolute top-0 left-0 w-full h-full"
        style={
          {
            "--mx": "-9999px",
            "--my": "-9999px",
            zIndex: 5,
            mixBlendMode: "screen",
            transition: "all 200ms ease-out",
            opacity: 0.3,
            pointerEvents: "none",
            WebkitMaskImage: `
            circle at var(--mx) var(--my),
              rgba(0,0,0,1) 0px,
              rgba(0,0,0,.8) 180px,
              rgba(0    ,0,0,.3) 160px,
              rgba(0,0,0,0) 240px
            )
          `,
            maskImage: `
    radial-gradient(
            circle at var(--mx) var(--my),
              rgba(255,255,255,1) 0px,
              rgba(255,255,255,.8) 90px,
              rgba(255,255,255,.3) 160px,
              rgba(255,255,255,0) 240px
)


          `,

            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          } as React.CSSProperties
        }
      />


      {/* CONTENT */}
      {/* <div className="relative z-20 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl w-full rounded-2xl border border-pink-400/40 bg-black/60 backdrop-blur-xl p-12 text-center shadow-[0_0_40px_rgba(255,121,198,0.25)]">

          <h1 className="text-5xl font-bold text-white mb-6">
            Build Stunning Experiences
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            High-performance websites with cinematic visuals, smooth motion & modern UX.
          </p>

          <div className="flex justify-center gap-4">
            <button className="rounded-lg bg-pink-500 px-6 py-3 text-white font-medium hover:bg-pink-600 transition">
              Get Started
            </button>

            <button className="rounded-lg border border-white/30 px-6 py-3 text-white hover:bg-white/10 transition">
              Learn More
            </button>
          </div>
        </div>
      </div> */}
      <div className="relative z-20 flex h-full items-center justify-center px-6">
        <div className="max-w-7xl w-full">
          {/* Badge */}
          <div className="mb-6">
            <span className="inline-block rounded-full bg-blue-500/10 border border-blue-400/30 px-4 py-2 text-sm font-medium text-blue-400">
              NEW: AI-POWERED CONTRACT REVIEW
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            HR Automation for
            <br />
            Growing Teams
          </h1>

          {/* Subheading */}
          <p className="text-gray-400 text-xl mb-8 max-w-2xl">
            Streamline your offer letters, invoices, and payroll in one
            centralized platform. Focus on scaling your team, not the paperwork.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <InteractiveHoverButton className="hover:cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition">
              Get Started for Free
            </InteractiveHoverButton>

            <button className="hover:cursor-pointer rounded-lg border border-white/30 px-6 py-3 text-white hover:bg-white/10 transition flex items-center gap-2">
              <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-xs">
                ▶
              </span>
              Book a Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#060010]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#060010]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#060010]"></div>
            </div>
            <span>
              Join{" "}
              <span className="font-semibold text-white">500+ startups</span>{" "}
              managing HR today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
