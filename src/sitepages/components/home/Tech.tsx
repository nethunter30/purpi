"use client";

import React from "react";
import FadeUp from "@/sitepages/components/layout/FadeUp";

interface Partner {
  name: string;
  logo: React.ReactNode;
}

// Built-in high-quality matching SVG icons for Relume and Webflow
const RelumeLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const WebflowLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300">
    <path d="M22 6.5h-3.8L15.6 15l-2.6-8.5H9.2L6.6 15 4 6.5H0l4.6 11h3.8l2.6-8.5 2.6 8.5h3.8z" />
  </svg>
);

const defaultPartners: Partner[] = [
  { name: "Figma", logo: <RelumeLogo /> },
  { name: "Framer", logo: <WebflowLogo /> },
  { name: "Notion", logo: <RelumeLogo /> },
  { name: "Whatsapp", logo: <WebflowLogo /> },
  { name: "Telegram", logo: <RelumeLogo /> },
  { name: "Framer", logo: <WebflowLogo /> },
  { name: "Figma", logo: <RelumeLogo /> },
  { name: "Whatsapp", logo: <WebflowLogo /> },
];

export default function Tech() {
  // Double the list for seamless infinite loop scroll
  const marqueeItems = [...defaultPartners, ...defaultPartners];

  return (
    <section className="relative w-full py-10 bg-black overflow-hidden border-y border-purple-950/10 z-10">
      
      {/* Premium linear-gradient edge fades */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* Marquee Wrapper */}
      <FadeUp className="flex overflow-hidden w-full select-none">
        
        {/* Animated Marquee row */}
        <div className="animate-marquee gap-16 py-2">
          {marqueeItems.map((partner, index) => (
            <div
              key={index}
              className="group flex items-center gap-3.5 cursor-pointer transition-all duration-300"
            >
              {/* Logo wrapper */}
              <div className="flex items-center justify-center p-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                {partner.logo}
              </div>

              {/* Partner Name/Title */}
              <span className="text-gray-500 font-sans text-xl md:text-2xl font-bold tracking-tight group-hover:text-white transition-colors duration-300">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

      </FadeUp>
    </section>
  );
}
