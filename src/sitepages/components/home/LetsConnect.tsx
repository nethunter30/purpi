"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import FadeUp from "@/sitepages/components/layout/FadeUp";

export default function LetsConnect() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Get ordinal suffix (1st, 2nd, 3rd, 4th...)
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    setFormattedDate(`${month} ${day}${suffix} ${year}`);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center py-20 md:py-32 overflow-hidden z-10">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/letsconnect.png')" }}
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black/80"></div>

      {/* Content Container wrapped with scroll animation */}
      <FadeUp className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Top Tagline */}
        <p className="font-serif italic text-gray-200 text-lg md:text-xl tracking-wide mb-8">
          The Future is Now. Let&apos;s Connect.
        </p>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-center leading-tight mb-8 text-[#ca7ee8] drop-shadow-[0_0_15px_rgba(202,126,232,0.2)]">
          enteropia
        </h2>

        {/* Description */}
        <p className="text-gray-300 max-w-2xl text-sm md:text-base leading-relaxed mb-10 px-4">
          "A dedicated engineering partner for scaling businesses and bold ideas. We deliver production-grade software, cloud-native infrastructure, and enterprise security — turning your most complex technical challenges into reliable, future-ready systems."

        </p>

        {/* Badges/Pills */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          {/* Bengaluru Badge */}
          <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-purple-500/20 bg-purple-950/20 hover:border-purple-500/40 hover:bg-purple-900/30 transition-all duration-300 backdrop-blur-sm cursor-pointer group shadow-lg">
            <MapPin className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="text-gray-200 text-xs md:text-sm font-medium tracking-wide">
              Bengaluru, Karnataka
            </span>
          </div>

          {/* Date Badge */}
          <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-purple-500/20 bg-purple-950/20 hover:border-purple-500/40 hover:bg-purple-900/30 transition-all duration-300 backdrop-blur-sm cursor-pointer group shadow-lg">
            <Clock className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="text-gray-200 text-xs md:text-sm font-medium tracking-wide">
              {formattedDate || "May 14th 2025"}
            </span>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
