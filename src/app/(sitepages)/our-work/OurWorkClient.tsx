"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { CaseStudy } from "@/lib/caseStudiesData";

interface OurWorkClientProps {
  caseStudies: CaseStudy[];
}

export default function OurWorkClient({ caseStudies }: OurWorkClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter categories
  const categories = ["All", "Software Engineering", "Cloud & Security", "AI & Automation"];

  // Category filtering
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter(item => {
      return selectedCategory === "All" || item.category === selectedCategory;
    });
  }, [caseStudies, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10 overflow-x-hidden flex flex-col items-center">
      {/* Visual Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a38_1px,transparent_1px),linear-gradient(to_bottom,#1f0a38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-[8%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-purple-600/10 via-fuchsia-600/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] w-full px-6 relative z-20 mt-16 flex-1 flex flex-col">
        {/* ── SECTION 1: HERO HEADER ── */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#c455e3] tracking-tight leading-tight">
            Our Portfolio & Works
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-light">
            We collaborate with ambitious organizations to architect, scale, and optimize their business critical platforms. Explore our engineering milestones.
          </p>
        </div>

        {/* ── SECTION 2: STATS COUNTER BANNER ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-3xl bg-[#0c0414]/90 border border-purple-900/10 mb-20 shadow-2xl backdrop-blur-md">
          {[
            { value: "99.99%", label: "Uptime SLA", desc: "For all cloud deployments" },
            { value: "2.4x", label: "Process Speed", desc: "Average system speedup" },
            { value: "-55%", label: "Cost Reduction", desc: "In hosting & database waste" },
            { value: "12 Wks", label: "Guaranteed Launch", desc: "On standard enterprise builds" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center space-y-1 relative group" id={`stat-${idx}`}>
              <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 font-mono">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-[10px] text-gray-500 font-light hidden sm:block">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* ── SECTION 3: INTERACTIVE FILTER ── */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap justify-center items-center gap-1.5 p-2 bg-[#0c0414]/90 border border-purple-950/40 rounded-2xl backdrop-blur-md shadow-2xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-purple-950/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: SHOWCASE CARDS GRID ── */}
        {filteredCaseStudies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-purple-900/10 bg-[#12061f]/10 rounded-[32px] p-8">
            <Layers className="w-12 h-12 mb-4 text-purple-500/35 animate-pulse" />
            <h3 className="text-white text-lg font-bold">No projects listed</h3>
            <p className="text-sm text-gray-400 max-w-sm font-light mt-1">No matches found for the selected category. Check back soon for new case studies!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {filteredCaseStudies.map((study) => (
              <Link
                key={study.id}
                href={`/our-work/${study.id}`}
                className="group relative flex flex-col bg-[#0c0414]/90 border border-purple-900/10 hover:border-purple-500/20 rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1 shadow-2xl hover:shadow-purple-950/40 cursor-pointer overflow-hidden"
              >
                {/* Top Border Highlight */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Cover Image */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-purple-950/15 mb-6 shadow-md border border-purple-950/10">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />

                  {/* Category overlay tags */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest bg-black/80 text-purple-300 px-3 py-1 rounded-full border border-purple-800/30">
                      {study.category}
                    </span>
                  </div>

                  {/* Impact Stats inside Image */}
                  <div className="absolute bottom-4 left-5 z-20 space-y-0.5">
                    <div className="text-xl font-black text-white font-mono leading-none drop-shadow-md">
                      {study.impact}
                    </div>
                    <div className="text-[9px] uppercase font-mono tracking-wider text-gray-300 font-bold drop-shadow-sm">
                      {study.impactLabel}
                    </div>
                  </div>
                </div>

                {/* Info Content */}
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-purple-400">
                      {study.client}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                      {study.description}
                    </p>
                  </div>

                  {/* Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {study.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] px-2.5 py-1 bg-purple-900/10 text-purple-300 rounded-lg border border-purple-800/15"
                      >
                        {tech}
                      </span>
                    ))}
                    {study.techStack.length > 4 && (
                      <span className="text-[9px] px-2.5 py-1 bg-[#12061f] text-gray-500 rounded-lg border border-purple-950/20">
                        +{study.techStack.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Action Link Row */}
                  <div className="border-t border-purple-950/40 pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {study.subCategory}
                    </span>
                    <span className="text-xs font-bold text-[#c455e3] group-hover:text-purple-400 transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                      Review blueprint
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
