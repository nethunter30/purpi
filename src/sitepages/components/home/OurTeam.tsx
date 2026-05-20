"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  image: string;
  bgColor: string;
  order: number;
}

const fallbackTeam: TeamMember[] = [
  {
    name: "Mike Hasselpuff",
    role: "CEO",
    image: "",
    bgColor: "#8a35e5", // Vibrant Purple
    order: 1,
  },
  {
    name: "Jenna Drawers",
    role: "Marketing Head",
    image: "",
    bgColor: "#a76fd2", // Lighter lavender/mauve
    order: 2,
  },
  {
    name: "Leo MacCallum",
    role: "Tech Lead",
    image: "",
    bgColor: "#8a35e5", // Vibrant Purple
    order: 3,
  },
];

export default function OurTeam() {
  const [members, setMembers] = useState<TeamMember[]>(fallbackTeam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setMembers(json.data);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section className="relative w-full py-24 flex flex-col items-center justify-center bg-black overflow-hidden z-10">
      {/* Decorative subtle background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative w-full max-w-[1200px] px-6 flex flex-col items-center z-10">

        {/* Top Badge */}
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-purple-500/30 bg-purple-950/10 text-gray-200 font-serif text-base tracking-wide mb-6 backdrop-blur-md">
          Our Team
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center text-[#c455e3] mb-6">
          Greatest Team Ever
        </h2>

        {/* Descriptive Text */}
        <p className="text-gray-400 text-sm md:text-base leading-relaxed text-center max-w-3xl mb-16 tracking-wide">
          We are a passionate group of designers, developers, and strategists dedicated to building tools that
          empower teams to collaborate seamlessly and achieve greatness.
        </p>

        {/* Grid Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {members.map((member, index) => (
            <div
              key={member._id || index}
              className="group relative flex flex-col rounded-[28px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(138,53,229,0.15)] h-[460px] md:h-[480px] cursor-pointer"
              style={{ backgroundColor: member.bgColor }}
            >
              {/* Inner Card Content */}
              <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
                {/* Role/Title */}
                <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                  {member.role}
                </h3>
                {/* Member Name */}
                <p className="text-white/80 text-sm md:text-base font-light tracking-wide">
                  {member.name}
                </p>

                {/* Portrait Image Container */}
                <div className="relative w-full h-[320px] mt-auto flex items-end justify-center overflow-hidden">
                  {/* Subtle inner highlight glow under the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback handling if local image path is not uploaded yet
                        console.warn(`Image path not loaded: ${member.image}`);
                      }}
                    />
                  ) : (
                    // Aesthetic avatar skeleton if no image is defined
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Glossy overlay on card hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
