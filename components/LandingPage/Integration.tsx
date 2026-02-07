import { AnimatedBeamMultipleOutputDemo } from "./Multipurpose";

export default function Integration() {
  return (
    // <section className="relative min-h-screen bg-[#060010]  px-6">
    <section className="relative min-h-screen flex items-center justify-center bg-[#060010] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h2 className="lg:text-6xl font-bold text-white mb-6">
            Connect Everything You Use
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Seamlessly integrate with your favorite tools and platforms. Sync
            data across Google Drive, Docs, WhatsApp, Messenger, and more.
          </p>
        </div>

        {/* Animated Beam Component */}
        <AnimatedBeamMultipleOutputDemo/>
      </div>
    </section>
  );
}
