"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import FadeUp from "@/sitepages/components/layout/FadeUp";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: any;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  tags: string[];
}

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        const json = await res.json();
        if (json.success && json.data) {
          // Show all active blogs in the carousel
          setPosts(json.data);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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

  const maxIndex = Math.max(0, posts.length - visibleCards);

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
      <section className="relative w-full py-20 bg-black overflow-hidden z-10 flex flex-col items-center">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center w-full">
          <div className="h-6 w-32 bg-purple-900/20 rounded-sm mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-purple-900/20 rounded-sm mb-12 animate-pulse" />
          <div className="flex gap-6 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-[380px] bg-purple-950/10 border border-purple-900/10 rounded-sm animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-20 md:py-28 bg-black overflow-hidden border-b border-purple-950/10 z-10 flex flex-col items-center">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-fuchsia-900/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <FadeUp className="relative w-full max-w-[1200px] px-6 flex flex-col items-start z-10">
        <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6">
          <div className="flex flex-col items-start text-left max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-sm border border-purple-500/20 bg-purple-950/20 text-purple-300 text-[11px] font-semibold tracking-widest uppercase mb-4">
              Insights & Updates
            </div>

            {/* Section Heading */}
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Latest Engineering{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
                Insights
              </span>
            </h2>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
              Deep architectural deep-dives, systems engineering checklists, and security briefs directly from our tech leads.
            </p>
          </div>

          {/* View All Button on Top Right */}
          <div className="flex-shrink-0">
            <Link
              href="/blog"
              className="inline-block px-6 py-2.5 rounded-sm border border-purple-900/30 text-gray-300 hover:text-white hover:bg-purple-900/20 hover:border-purple-500/30 transition-all text-xs font-semibold tracking-wider uppercase cursor-pointer whitespace-nowrap"
            >
              View All Articles
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
            {posts.map((post) => {
              const categoryName = typeof post.category === "object" && post.category
                ? post.category.name
                : (post.category || "Uncategorized");

              return (
                <div
                  key={post.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 flex"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="group w-full relative flex flex-col bg-[#0c0414]/90 border border-purple-900/10 hover:border-purple-500/20 rounded-sm p-5 transition-all duration-300 hover:-translate-y-1 shadow-2xl hover:shadow-purple-950/40 cursor-pointer overflow-hidden"
                  >
                    {/* Top Border Highlight */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Cover Image */}
                    <div className="relative w-full h-48 rounded-sm overflow-hidden bg-purple-950/15 mb-5 border border-purple-950/10">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />

                      {/* Category badge overlay */}
                      <div className="absolute top-3 left-3 z-20">
                        <span className="text-[9px] uppercase font-bold tracking-widest bg-black/85 text-purple-300 px-2.5 py-0.5 rounded-sm border border-purple-800/30">
                          {categoryName}
                        </span>
                      </div>
                    </div>

                    {/* Post details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-purple-500/60" /> {post.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-purple-500/60" /> {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-xs leading-relaxed font-light line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Simplified Footer Row */}
                      <div className="border-t border-purple-950/40 pt-4 mt-6 flex items-center justify-end">
                        <span className="text-[10px] font-bold text-[#c455e3] group-hover:text-purple-400 transition-colors flex items-center gap-1 uppercase tracking-wider">
                          Read Article
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Carousel Pagination & Controls */}
        {maxIndex > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full">
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
