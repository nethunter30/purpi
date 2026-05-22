import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "../layout/AnimatedBackground";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center pt-24 pb-12 z-10 w-full">
      <AnimatedBackground />
      
      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center px-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center mt-12 md:mt-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-white tracking-tight mb-8 leading-tight">
          Innovating <span className="text-[#d946ef] bg-clip-text">Tomorrow, Today</span>
        </h1>

        <p className="text-gray-300 max-w-2xl text-base md:text-lg mb-10 leading-relaxed">
          Streamline your workflow, simplify your processes, and see a clearer
          picture of your business with our all-in-one platform.
        </p>

        <Link
          href="/services"
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full border border-purple-500/50 bg-[#3b1764]/50 hover:bg-[#3b1764]/80 transition-all text-white text-base font-medium backdrop-blur-sm"
        >
          Explore Solutions
          <div className="bg-[#a855f7] rounded-full p-1.5 group-hover:bg-[#c084fc] transition-colors">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </Link>
      </div>

      {/* Three Columns Bottom Section */}
      <div className="w-full mt-24 lg:mt-32 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-purple-900/40">

          {/* Column 1 */}
          <div className="flex flex-col items-center text-center px-4 md:px-6 pt-8 md:pt-0">
            <h3 className="text-[#c084fc] font-serif text-xl md:text-2xl mb-4 font-medium tracking-wide">
              IT Infrastructure
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Delivering secure, scalable, and reliable IT systems that form
              the backbone of modern businessoperations.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center text-center px-4 md:px-6 pt-8 md:pt-0">
            <h3 className="text-[#c084fc] font-serif text-xl md:text-2xl mb-4 font-medium tracking-wide">
              Digital Transformation
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering businesses to embrace innovation,
              streamline operations,
              and stay competitive in a rapidly
              evolving digital world.
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center text-center px-4 md:px-6 pt-8 md:pt-0">
            <h3 className="text-[#c084fc] font-serif text-xl md:text-2xl mb-4 font-medium tracking-wide">
              Software Development
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Creating tailored, high-quality
              software solutions that drive
              efficiency, growth, and
              long-term value.
            </p>
          </div>

        </div>
      </div>
    </div>
  </section>
  );
}
