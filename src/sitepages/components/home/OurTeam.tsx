"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  image: string;
  bgColor: string;
  order: number;
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

      <div className="relative w-full max-w-[1200px] px-6 flex flex-col items-center z-10">
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
                  </div>
                  {/* Glossy overlay on card hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
