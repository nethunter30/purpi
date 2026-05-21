"use client";

import React from "react";
import { MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function LetsConnect() {
  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center py-20 md:py-32 overflow-hidden z-10">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/conference_bg.png')" }}
      />
      
      {/* Dark overlay with purple radial glow for premium aesthetic */}
      <div className="absolute bg-gradient-to-b from-[#140620]/90 via-[#0a0212]/95 to-[#140620]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_70%)]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Top Tagline */}
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif italic text-gray-200 text-lg md:text-xl tracking-wide mb-8"
        >
          The Future is Now. Let&apos;s Connect.
        </motion.p>

        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-center leading-tight mb-8 text-[#ca7ee8] drop-shadow-[0_0_15px_rgba(202,126,232,0.2)]"
        >
          enteropia
        </motion.h2>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-gray-300 max-w-2xl text-sm md:text-base leading-relaxed mb-10 px-4"
        >
          A forward-thinking event where industry leaders, innovators, and enthusiasts explore cutting-edge technology, its impact across sectors, and future trends. Focused on collaboration, connection, and shaping tomorrow&apos;s possibilities.
        </motion.p>

        {/* Badges/Pills */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          {/* Barcelona Badge */}
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
              May 14th 2025
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
