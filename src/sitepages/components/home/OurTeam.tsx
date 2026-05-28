"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import FadeUp from "@/sitepages/components/layout/FadeUp";

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  image: string;
  bgColor: string;
  order: number;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
}

const cardLayouts = [
  // Index 0: Front Center
  {
    mobile: { x: "0px", y: "0px", scale: 1.0, z: 30, opacity: 1.0 },
    tablet: { x: "0px", y: "0px", scale: 1.0, z: 30, opacity: 1.0 },
    desktop: { x: "0px", y: "0px", scale: 1.0, z: 30, opacity: 1.0 },
  },
  // Index 1: Middle Left
  {
    mobile: { x: "-60px", y: "-10px", scale: 0.88, z: 20, opacity: 0.9 },
    tablet: { x: "-100px", y: "-15px", scale: 0.9, z: 20, opacity: 0.9 },
    desktop: { x: "-170px", y: "-20px", scale: 0.9, z: 20, opacity: 0.9 },
  },
  // Index 2: Middle Right
  {
    mobile: { x: "60px", y: "-10px", scale: 0.88, z: 20, opacity: 0.9 },
    tablet: { x: "100px", y: "-15px", scale: 0.9, z: 20, opacity: 0.9 },
    desktop: { x: "170px", y: "-20px", scale: 0.9, z: 20, opacity: 0.9 },
  },
  // Index 3: Back Left
  {
    mobile: { x: "-110px", y: "-20px", scale: 0.78, z: 10, opacity: 0.75 },
    tablet: { x: "-190px", y: "-30px", scale: 0.8, z: 10, opacity: 0.75 },
    desktop: { x: "-320px", y: "-40px", scale: 0.8, z: 10, opacity: 0.75 },
  },
  // Index 4: Back Right
  {
    mobile: { x: "110px", y: "-20px", scale: 0.78, z: 10, opacity: 0.75 },
    tablet: { x: "190px", y: "-30px", scale: 0.8, z: 10, opacity: 0.75 },
    desktop: { x: "320px", y: "-40px", scale: 0.8, z: 10, opacity: 0.75 },
  },
  // Index 5: Hidden (off-screen / extra overflow card)
  {
    mobile: { x: "0px", y: "-30px", scale: 0.7, z: 1, opacity: 0 },
    tablet: { x: "0px", y: "-45px", scale: 0.72, z: 1, opacity: 0 },
    desktop: { x: "0px", y: "-60px", scale: 0.75, z: 1, opacity: 0 },
  },
];

export default function OurTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const isPaused = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team");
        const json = await res.json();
        if (json.success && json.data) {
          const sorted = [...json.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setMembers(sorted);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const handlePrev = useCallback(() => {
    if (members.length === 0) return;
    setCenterIndex((prev) => (prev - 1 + members.length) % members.length);
  }, [members.length]);

  const handleNext = useCallback(() => {
    if (members.length === 0) return;
    setCenterIndex((prev) => (prev + 1) % members.length);
  }, [members.length]);

  // Auto-slide: advance every 2 seconds, pause on hover (only if using the slider)
  useEffect(() => {
    if (members.length < 5) return;
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) {
        setCenterIndex((prev) => (prev + 1) % members.length);
      }
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [members.length]);

  const getCardStyle = (index: number) => {
    if (members.length === 0) return {};
    // Calculate difference relative to the centerIndex
    let diff = index - centerIndex;
    const len = members.length;

    // Normalize diff to the range [-half, half]
    const half = Math.floor(len / 2);
    while (diff < -half) diff += len;
    while (diff > half) diff -= len;

    // Map diff to index in cardLayouts:
    let layoutIndex = 5;
    if (diff === 0) layoutIndex = 0;
    else if (diff === -1) layoutIndex = 1;
    else if (diff === 1) layoutIndex = 2;
    else if (diff === -2) layoutIndex = 3;
    else if (diff === 2) layoutIndex = 4;

    const layout = cardLayouts[layoutIndex];
    const isHovered = hoveredIndex === index;
    const anyHovered = hoveredIndex !== null;

    // Apply adjustments based on hover focus
    const opacityAdjust = isHovered ? 1.0 : anyHovered ? 0.35 : 1.0;
    const scaleAdjust = isHovered ? 1.05 : anyHovered ? 0.95 : 1.0;
    const hoverYOffset = isHovered ? -12 : 0;

    return {
      backgroundColor: members[index].bgColor || "#8a35e5",
      "--mobile-x": layout.mobile.x,
      "--mobile-y": `${parseFloat(layout.mobile.y) + hoverYOffset}px`,
      "--mobile-scale": layout.mobile.scale * scaleAdjust,
      "--mobile-z": isHovered ? 50 : layout.mobile.z,
      "--mobile-opacity": layout.mobile.opacity * opacityAdjust,

      "--tablet-x": layout.tablet.x,
      "--tablet-y": `${parseFloat(layout.tablet.y) + hoverYOffset}px`,
      "--tablet-scale": layout.tablet.scale * scaleAdjust,
      "--tablet-z": isHovered ? 50 : layout.tablet.z,
      "--tablet-opacity": layout.tablet.opacity * opacityAdjust,

      "--desktop-x": layout.desktop.x,
      "--desktop-y": `${parseFloat(layout.desktop.y) + hoverYOffset}px`,
      "--desktop-scale": layout.desktop.scale * scaleAdjust,
      "--desktop-z": isHovered ? 50 : layout.desktop.z,
      "--desktop-opacity": layout.desktop.opacity * opacityAdjust,
    } as React.CSSProperties;
  };

  if (loading) {
    return (
      <section id="team" className="relative w-full py-10 flex flex-col items-center justify-center bg-black overflow-hidden z-10 animate-pulse">
        <div className="relative w-full max-w-[1200px] px-6 flex flex-col items-center z-10">
          <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-purple-500/10 bg-purple-950/5 text-transparent font-serif text-base tracking-wide mb-4 select-none">
            Our Team
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center bg-purple-900/20 text-transparent rounded mb-4 select-none w-64 h-12" />
          <div className="flex flex-wrap justify-center gap-6 mt-8 w-full max-w-[1000px]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-[20px] sm:rounded-[28px] overflow-hidden w-[120px] h-[180px] sm:w-[200px] sm:h-[300px] lg:w-[280px] lg:h-[420px] bg-purple-950/10 border border-purple-900/10"
              >
                <div className="p-2 sm:p-4 lg:p-6 flex flex-col h-full relative">
                  <div className="h-4 lg:h-6 w-3/4 bg-purple-900/20 rounded mb-2" />
                  <div className="h-3 lg:h-4 w-1/2 bg-purple-900/10 rounded mb-6" />
                  <div className="relative w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] lg:w-[220px] lg:h-[220px] rounded-full overflow-hidden mx-auto mt-auto mb-auto bg-purple-900/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return null;
  }

  const isSlider = members.length >= 3;

  return (
    <section id="team" className="relative w-full py-10 flex flex-col items-center justify-center bg-black overflow-hidden z-10">
      <style>{`
        .card-3d {
          position: absolute;
          left: 50%;
          transform: translateX(calc(-50% + var(--mobile-x))) translateY(var(--mobile-y)) scale(var(--mobile-scale));
          z-index: var(--mobile-z);
          opacity: var(--mobile-opacity);
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), 
                      z-index 0.6s ease, 
                      opacity 0.6s ease, 
                      box-shadow 0.6s ease,
                      border-color 0.6s ease;
        }
        @media (min-width: 640px) {
          .card-3d {
            transform: translateX(calc(-50% + var(--tablet-x))) translateY(var(--tablet-y)) scale(var(--tablet-scale));
            z-index: var(--tablet-z);
            opacity: var(--tablet-opacity);
          }
        }
        @media (min-width: 1024px) {
          .card-3d {
            transform: translateX(calc(-50% + var(--desktop-x))) translateY(var(--desktop-y)) scale(var(--desktop-scale));
            z-index: var(--desktop-z);
            opacity: var(--desktop-opacity);
          }
        }
      `}</style>

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <FadeUp className="relative w-full max-w-[1200px] px-6 flex flex-col items-center z-10">
        {/* Top Badge */}
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-purple-500/30 bg-purple-950/10 text-gray-200 font-serif text-base tracking-wide mb-4 backdrop-blur-md">
          Our Team
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center text-[#c455e3] mb-4">
          Greatest Team Ever
        </h2>

        {/* Descriptive Text */}
        <p className="text-gray-400 text-sm md:text-base leading-relaxed text-center max-w-3xl mb-4 tracking-wide">
          We are a passionate group of designers, developers, and strategists dedicated to building tools that
          empower teams to collaborate seamlessly and achieve greatness.
        </p>

        {isSlider ? (
          /* Overlapping 3D Cards Stack Container with Navigation Arrows */
          <div
            className="relative w-full max-w-[1000px] h-[240px] sm:h-[350px] lg:h-[500px] flex items-center justify-center mt-0 mb-4 px-10"
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
          >
            {/* Left Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-0 z-40 p-2 sm:p-3 rounded-full bg-[#0c0414]/80 backdrop-blur-md hover:bg-purple-900/40 text-white/80 hover:text-white transition-all shadow-[0_0_15px_rgba(138,53,229,0.15)] hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Previous Team Member"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            {/* Cards Wrapper */}
            <div className="relative w-full h-full flex items-center justify-center">
              {members.map((member, index) => {
                const isHovered = hoveredIndex === index;

                // Calculate diff to determine active click behavior
                let diff = index - centerIndex;
                const len = members.length;
                const half = Math.floor(len / 2);
                while (diff < -half) diff += len;
                while (diff > half) diff -= len;

                return (
                  <div
                    key={member._id || index}
                    onClick={() => setCenterIndex(index)}
                    className={`card-3d group flex flex-col rounded-[20px] sm:rounded-[28px] overflow-hidden cursor-pointer w-[120px] h-[180px] sm:w-[200px] sm:h-[300px] lg:w-[280px] lg:h-[420px] border ${isHovered
                        ? "shadow-[0_30px_60px_-15px_rgba(138,53,229,0.6)] border-white/40"
                        : "shadow-[0_15px_35px_rgba(0,0,0,0.6)] border-white/5"
                      }`}
                    style={getCardStyle(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Inner Card Content */}
                    <div className="p-2 sm:p-4 lg:p-6 flex flex-col h-full relative z-10 select-none">
                      {/* Role/Title */}
                      <h3 className="text-white text-[10px] sm:text-base lg:text-2xl font-semibold tracking-tight leading-tight mb-0.5 sm:mb-1">
                        {member.name}
                      </h3>
                      {/* Member Name */}
                      <p className="text-white/80 text-[8px] sm:text-xs lg:text-sm font-light tracking-wide">
                        {member.role}
                      </p>

                      {/* Round Image Container */}
                      <div className="relative w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] lg:w-[220px] lg:h-[220px] rounded-full overflow-hidden border border-white/10 mx-auto mt-auto mb-auto flex items-center justify-center bg-black/10">
                        {/* Subtle inner highlight glow under the image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={`${member.name} - ${member.role}`}
                            fill
                            sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 220px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              console.warn(`Image path not loaded: ${member.image}`);
                            }}
                          />
                        ) : (
                          // Aesthetic avatar skeleton if no image is defined
                          <div className="w-full h-full flex items-center justify-center text-white/20 bg-purple-950/20">
                            <svg className="w-6 h-6 sm:w-10 sm:h-10 lg:w-16 lg:h-16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Social Media Links */}
                      {(member.linkedin || member.github || member.twitter || member.instagram) && (
                        <div 
                          className="flex items-center justify-center gap-2 lg:gap-3.5 mt-2 lg:mt-4 z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/60 hover:text-[#a356db] hover:scale-110 transition-all p-1.5 sm:p-2 bg-green hover:bg-purple-500/10 rounded-full border border-white/5 hover:border-purple-500/20"
                            >
                              <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                            </a>
                          )}
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/60 hover:text-white hover:scale-110 transition-all p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/20"
                            >
                              <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                            </a>
                          )}
                          {member.twitter && (
                            <a
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/60 hover:text-[#1d9bf0] hover:scale-110 transition-all p-1.5 sm:p-2 bg-white/5 hover:bg-[#1d9bf0]/10 rounded-full border border-white/5 hover:border-[#1d9bf0]/20"
                            >
                              <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                            </a>
                          )}
                          {member.instagram && (
                            <a
                              href={member.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/60 hover:text-[#e1306c] hover:scale-110 transition-all p-1.5 sm:p-2 bg-white/5 hover:bg-[#e1306c]/10 rounded-full border border-white/5 hover:border-[#e1306c]/20"
                            >
                              <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Glossy overlay on card hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>
                );
              })}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-0 z-40 p-2 sm:p-3 rounded-full bg-[#0c0414]/80 backdrop-blur-md hover:bg-purple-900/40 text-white/80 hover:text-white transition-all shadow-[0_0_15px_rgba(138,53,229,0.15)] hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Next Team Member"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>
        ) : (
          /* Centered Responsive Grid for fewer members */
          <div className="flex flex-wrap justify-center gap-6 mt-8 w-full max-w-[1000px] z-10">
            {members.map((member, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={member._id || index}
                  className="group flex flex-col rounded-[20px] sm:rounded-[28px] overflow-hidden cursor-pointer w-[120px] h-[180px] sm:w-[200px] sm:h-[300px] lg:w-[280px] lg:h-[420px] border shadow-[0_15px_35px_rgba(0,0,0,0.6)] border-white/5 hover:border-white/40 hover:shadow-[0_30px_60px_-15px_rgba(138,53,229,0.6)] transition-all duration-500 hover:-translate-y-3 relative"
                  style={{ backgroundColor: member.bgColor || "#8a35e5" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Inner Card Content */}
                  <div className="p-2 sm:p-4 lg:p-6 flex flex-col h-full relative z-10 select-none">
                    {/* Role/Title */}
                    <h3 className="text-white text-[10px] sm:text-base lg:text-2xl font-semibold tracking-tight leading-tight mb-0.5 sm:mb-1">
                      {member.role}
                    </h3>
                    {/* Member Name */}
                    <p className="text-white/80 text-[8px] sm:text-xs lg:text-sm font-light tracking-wide">
                      {member.name}
                    </p>

                    {/* Round Image Container */}
                    <div className="relative w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] lg:w-[220px] lg:h-[220px] rounded-full overflow-hidden border border-white/10 mx-auto mt-auto mb-auto flex items-center justify-center bg-black/10">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={`${member.name} - ${member.role}`}
                          fill
                          sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 220px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            console.warn(`Image path not loaded: ${member.image}`);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 bg-purple-950/20">
                          <svg className="w-6 h-6 sm:w-10 sm:h-10 lg:w-16 lg:h-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Social Media Links */}
                    {(member.linkedin || member.github || member.twitter || member.instagram) && (
                      <div 
                        className="flex items-center justify-center gap-2 lg:gap-3.5 mt-2 lg:mt-4 z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-[#a356db] hover:scale-110 transition-all p-1.5 sm:p-2 bg-white/5 hover:bg-purple-500/10 rounded-full border border-white/5 hover:border-purple-500/20"
                          >
                            <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white hover:scale-110 transition-all p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/20"
                          >
                            <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-[#1d9bf0] hover:scale-110 transition-all p-1.5 sm:p-2 bg-white/5 hover:bg-[#1d9bf0]/10 rounded-full border border-white/5 hover:border-[#1d9bf0]/20"
                          >
                            <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                          </a>
                        )}
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-[#e1306c] hover:scale-110 transition-all p-1.5 sm:p-2 bg-white/5 hover:bg-[#e1306c]/10 rounded-full border border-white/5 hover:border-[#e1306c]/20"
                          >
                            <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Glossy overlay on card hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </FadeUp>
    </section>
  );
}
