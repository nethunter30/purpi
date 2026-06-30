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
            Precision. <span className="text-[#d946ef] bg-clip-text">Power. Progress.</span>
          </h1>

          <p className="text-gray-300 max-w-2xl text-base md:text-lg mb-10 leading-relaxed">

            Every system we build is engineered with precision and purpose.
            Backed by enterprise-grade infrastructure and real technical power —
            driving measurable progress for businesses ready to lead.
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

        {/* Trusted By Section */}
        <div className="w-full mt-12 md:mt-16 border-t border-purple-950/20 pt-8 flex flex-col items-center select-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-6">
            Trusted by engineers and teams at
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-40 hover:opacity-60 transition-opacity duration-300">
            {/* Stripe */}
            <div className="text-white font-bold text-xs tracking-widest flex items-center gap-1.5 grayscale hover:grayscale-0 hover:text-purple-400 transition-all duration-300 cursor-pointer">
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              STRIPE
            </div>
            {/* AWS */}
            <div className="text-white font-bold text-xs tracking-widest flex items-center gap-1.5 grayscale hover:grayscale-0 hover:text-purple-400 transition-all duration-300 cursor-pointer">
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              AWS
            </div>
            {/* VMware */}
            <div className="text-white font-bold text-xs tracking-widest flex items-center gap-1.5 grayscale hover:grayscale-0 hover:text-purple-400 transition-all duration-300 cursor-pointer">
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
              VMWARE
            </div>
            {/* Twilio */}
            <div className="text-white font-bold text-xs tracking-widest flex items-center gap-1.5 grayscale hover:grayscale-0 hover:text-purple-400 transition-all duration-300 cursor-pointer">
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              TWILIO
            </div>
            {/* GitLab */}
            <div className="text-white font-bold text-xs tracking-widest flex items-center gap-1.5 grayscale hover:grayscale-0 hover:text-purple-400 transition-all duration-300 cursor-pointer">
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 2 3.5 10H8.5L12 2z"/><path d="M12 2 8.5 12H2L12 2z"/><path d="M12 2 15.5 12H22L12 2z"/></svg>
              GITLAB
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
