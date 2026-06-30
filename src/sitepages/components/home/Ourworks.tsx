"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Layers } from "lucide-react";
import FadeUp from "@/sitepages/components/layout/FadeUp";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  subCategory: string;
  description: string;
  impact: string;
  impactLabel: string;
  image: string;
  techStack: string[];
}

export default function Ourworks() {
  const [works, setWorks] = useState<CaseStudy[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const [loading, setLoading] = useState(true);

  // Fetch works from API
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch("/api/our-work");
        const json = await res.json();
        if (json.success && json.data) {
          // Limit to 5 cards as requested
          setWorks(json.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching works:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  // Handle responsive visible card counts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, works.length - visibleCards);

  // Auto-sliding interval
  useEffect(() => {
    if (maxIndex <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [maxIndex, isPaused, currentIndex]);

  if (loading) {
    return (
      <section className="relative w-full py-20 bg-black overflow-hidden z-10 animate-pulse">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center">
          <div className="h-6 w-32 bg-purple-900/20 rounded-sm mb-4" />
          <div className="h-10 w-64 bg-purple-900/20 rounded-sm mb-12" />
          <div className="flex gap-6 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-[400px] bg-purple-950/10 border border-purple-900/10 rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (works.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-5 md:py-28 bg-black overflow-hidden border-b border-purple-950/10 z-10 flex flex-col items-center">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-fuchsia-900/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <FadeUp className="relative w-full max-w-[1200px] px-6 flex flex-col items-start z-10">
        <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6">
          <div className="flex flex-col items-start text-left max-w-2xl">
            {/* Top Header Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-sm border border-purple-500/20 bg-purple-950/20 text-purple-300 text-[11px] font-semibold tracking-widest uppercase mb-4">
              Featured Works
            </div>

            {/* Section Heading */}
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Explore Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
                Case Studies
              </span>
            </h2>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
              A selection of our engineering milestones where we helped fast-growing scale-ups and enterprises build high-performance products.
            </p>
          </div>

          {/* View All Button on Top Right */}
          <div className="flex-shrink-0">
            <Link
              href="/our-work"
              className="inline-block px-6 py-2.5 rounded-sm border border-purple-900/30 text-gray-300 hover:text-white hover:bg-purple-900/20 hover:border-purple-500/30 transition-all text-xs font-semibold tracking-wider uppercase cursor-pointer whitespace-nowrap"
            >
              Explore All Works
            </Link>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div 
          className="w-full overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex -mx-3"
            animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {works.map((study) => (
              <div
                key={study.id}
                className="w-full md:w-80 lg:w-100 flex-shrink-0 px-3 flex"
              >
                <Link
                  href={`/our-work/${study.id}`}
                  className="group w-full relative flex flex-col bg-[#0c0414]/90 border border-purple-900/10 hover:border-purple-500/20 rounded-sm p-6 transition-all duration-300 hover:-translate-y-1 shadow-2xl hover:shadow-purple-950/40 cursor-pointer overflow-hidden"
                >
                  {/* Top Border Highlight */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Cover Image */}
                  <div className="relative w-full h-52 rounded-sm overflow-hidden bg-purple-950/15 mb-6 shadow-md border border-purple-950/10">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />

                    {/* Category overlay tags */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-widest bg-black/80 text-purple-300 px-3 py-1 rounded-sm border border-purple-800/30">
                        {study.category}
                      </span>
                    </div>

                    {/* Impact Stats inside Image */}
                    <div className="absolute bottom-4 left-5 z-20 space-y-0.5">
                      <div className="text-lg font-black text-white font-mono leading-none drop-shadow-md">
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
                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors line-clamp-1">
                        {study.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed font-light line-clamp-3">
                        {study.description}
                      </p>
                    </div>

                    {/* Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {study.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] px-2.5 py-1 bg-purple-900/10 text-purple-300 rounded-sm border border-purple-800/15"
                        >
                          {tech}
                        </span>
                      ))}
                      {study.techStack.length > 3 && (
                        <span className="text-[9px] px-2.5 py-1 bg-[#12061f] text-gray-500 rounded-sm border border-purple-950/20">
                          +{study.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Row */}
                    <div className="border-t border-purple-950/40 pt-4 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {study.subCategory}
                      </span>
                      <span className="text-[11px] font-bold text-[#c455e3] group-hover:text-purple-400 transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                        Read More
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Carousel Pagination & Controls */}
        {maxIndex > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
                className="px-3 py-1.5 rounded-sm border border-purple-900/30 text-gray-300 hover:bg-purple-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <div className="flex items-center gap-1.5 mx-2">
                {[...Array(maxIndex + 1)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-sm transition-all duration-300 cursor-pointer ${
                      currentIndex === i 
                        ? "bg-[#a356db] w-6" 
                        : "bg-purple-900/40 hover:bg-purple-700/60 w-2"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setCurrentIndex(prev => Math.min(prev + 1, maxIndex))}
                disabled={currentIndex === maxIndex}
                className="px-3 py-1.5 rounded-sm border border-purple-900/30 text-gray-300 hover:bg-purple-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </FadeUp>
    </section>
  );
}
