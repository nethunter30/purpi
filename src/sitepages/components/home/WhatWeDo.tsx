"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const fallbackFeatures = [
  {
    title: "Digital Solutions & Media",
    description: "Crafting impactful websites with design, content, and marketing.",
    image: "/illustrations/digital-media.png",
    slug: "digital-solutions-media",
  },
  {
    title: "Software Solutions",
    description: "Building custom software to streamline business operations.",
    image: "/illustrations/software-solutions.png",
    slug: "software-solutions",
  },
  {
    title: "App solutions",
    description: "Creating intuitive mobile apps for iOS and Android.",
    image: "/illustrations/app-solutions.png",
    slug: "app-solutions",
  },
  {
    title: "Networking And Secure Solutions",
    description: "Providing robust IT networks and cybersecurity to protect your business.",
    image: "/illustrations/networking-security.png",
    slug: "networking-and-secure-solutions",
  },
  {
    title: "Cloud Infrastructure",
    description: "Scalable and secure cloud hosting solutions to power your applications globally.",
    image: "/illustrations/cloud-infrastructure.png",
    slug: "cloud-infrastructure",
  },
  {
    title: "AI & Machine Learning",
    description: "Integrate intelligent algorithms and automation to drive data-driven decision making.",
    image: "/illustrations/ai-machine-learning.png",
    slug: "ai-machine-learning",
  },
];

export default function WhatWeDo() {
  const [features, setFeatures] = useState(fallbackFeatures);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/services");
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          setFeatures(
            result.data.map((s: any) => ({
              title: s.title,
              description: s.description,
              image: s.image,
              slug: s.slug,
            }))
          );
        }
      } catch (e) {
        // fallback stays as is
      }
    };
    loadServices();
  }, []);

  return (
    <section className="relative w-full py-20 flex flex-col items-center justify-center z-10 bg-black">
      {/* Header Content */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6 mb-16">
        <div className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border border-gray-500/50 text-gray-200 font-serif text-base tracking-wide mb-5">
          What We Do
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-[#c455e3] mb-6 tracking-tight">
          Your Premium Tech Partner
        </h2>
        
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
          Founded in 2025. Hevit Yard Solutions delivers innovative, reliable, and scalable tech solutions, 
          specializing in software development, IT infrastructure, and digital transformation. We are a trusted 
          partner committed to quality and excellence, helping businesses build lasting value with sustainable, 
          future-ready solutions.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 max-w-[1200px] w-full px-6">
        {features.map((feature, index) => {
          const span = (index % 4 === 0 || index % 4 === 3) ? "md:col-span-3" : "md:col-span-2";
          return (
            <Link
              key={index}
              href={`/services/${feature.slug}`}
              className={`relative flex flex-col rounded-[20px] bg-[#12061f] overflow-hidden group transition-all hover:-translate-y-1 duration-300 min-h-[300px] md:min-h-[320px] border border-purple-950/10 hover:border-purple-500/30 shadow-lg hover:shadow-purple-500/10 ${span}`}
            >
              {/* Image as background with fade overlay */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#12061f] via-[#12061f]/70 to-transparent z-10" />
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text Content positioned at bottom left */}
              <div className="relative z-20 flex flex-col p-6 md:p-8 mt-auto">
                <h3 className="text-white text-xl md:text-2xl font-medium mb-2 tracking-tight group-hover:text-[#c455e3] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm">
                  {feature.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
