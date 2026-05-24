"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface AccordionItem {
  title: string;
  content: string;
}

interface ServiceSection {
  id: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  imageSrc: string;
  statValue: string;
  statLabel: string;
  offsetDirection: "right" | "left";
  accordions?: AccordionItem[];
}

const getCategoryDescription = (slug: string) => {
  const descriptions: Record<string, string> = {
    "software-solutions": "Engineered for performance, reliability, and enterprise scale. We develop custom software designed to simplify complex workflows and drive long-term business value.",
    "cloud-infrastructure": "Deliver secure, scalable, and reliable cloud-native IT systems that form the backbone of modern enterprise business operations.",
    "ai-machine-learning": "Leverage intelligent algorithms and data models to automate operations, discover insights, and power future-ready applications.",
    "app-solutions": "Building high-performance native and cross-platform mobile applications with premium user experiences and robust offline capabilities.",
    "networking-and-secure-solutions": "Designing robust network architectures and advanced threat protection to keep corporate assets secure from vectors.",
    "digital-solutions-media": "Transforming your digital presence through premium creative design, modern branding architectures, and content strategies."
  };
  return descriptions[slug] || "Professional tech services and engineered solutions tailored to your operational needs.";
};

const getCategoryStats = (slug: string, index: number) => {
  const stats: Record<string, { value: string; label: string }> = {
    "software-solutions": { value: "2.4x", label: "PROCESS EFFICIENCY" },
    "cloud-infrastructure": { value: "10x", label: "DEPLOYMENT SPEED" },
    "ai-machine-learning": { value: "95%", label: "ACCURACY RATE" },
    "app-solutions": { value: "4.8★", label: "USER SATISFACTION" },
    "networking-and-secure-solutions": { value: "0%", label: "SECURITY BREACHES" },
    "digital-solutions-media": { value: "150%", label: "USER ENGAGEMENT" }
  };
  return stats[slug] || { value: `${index + 1}x`, label: "SCALE IMPACT" };
};

export default function ServicesLayout() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch("/api/manage-services/category"),
          fetch("/api/manage-services/subcat")
        ]);
        const catJson = await catRes.json();
        const subJson = await subRes.json();
        if (catJson.success) setCategories(catJson.data);
        if (subJson.success) setSubcategories(subJson.data);
      } catch (err) {
        console.error("Failed to load services on layout:", err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Build dynamic sections from Category & Subcategory DB data
  const sections: ServiceSection[] = categories.map((cat, index) => {
    const stats = getCategoryStats(cat.slug, index);
    const relatedSubs = subcategories.filter((sub) => sub.categorySlug === cat.slug);

    const accordions = relatedSubs.map((sub, sIdx) => {
      const contentPoints = sub.bulletList?.points && sub.bulletList.points.length > 0
        ? `Delivers: ${sub.bulletList.points.join(", ")}`
        : `Explore our custom ${sub.name} packages designed to optimize and scale operational value.`;
      
      return {
        title: sub.name,
        content: contentPoints
      };
    });

    return {
      id: cat.slug,
      title: cat.name,
      description: getCategoryDescription(cat.slug),
      linkText: "EXPLORE PROGRAM DETAILS",
      linkHref: `/services/${cat.slug}`,
      imageSrc: cat.image || "/illustrations/software-solutions.png",
      statValue: stats.value,
      statLabel: stats.label,
      offsetDirection: index % 2 === 0 ? "right" : "left",
      accordions: accordions.length > 0 ? accordions : undefined
    };
  });

  if (loading) {
    return (
      <div className="w-full bg-black min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
        <p className="text-sm font-semibold">Loading enteropia catalog...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black pt-32 pb-20 px-6 sm:px-12 md:px-20 lg:px-32 flex flex-col gap-20 overflow-hidden relative">
      {/* Background glow accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none" />

      {/* Services Hero Section */}
      <section className="relative w-full max-w-11xl mx-auto pt-10 pb-6 flex flex-col items-center justify-center text-center z-10">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6">
          Services & Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-none max-w-8xl">
          Powering Innovation <span className="bg-gradient-to-r gap-2 from-purple-400 via-fuchsia-400 to-[#c455e3] bg-clip-text text-transparent">Through Technology</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mt-2">
          Discover enteropia's range of tech solutions including Software Engineering, Cloud Infrastructure, Security, and AI & Machine Learning designed to power your corporate vision.
        </p>
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-[1200px] mx-auto h-px bg-gradient-to-r from-transparent via-purple-950/40 to-transparent mb-10" />

      {/* Service Blocks Section */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-lg mx-auto z-10">
          <Sparkles className="w-14 h-14 text-purple-500/50 mb-5 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-3">Tech Offerings Coming Soon</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We are currently updating our suite of enterprise engineering solutions. Please check back shortly for our updated catalog.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-32 md:gap-40 w-full relative z-10">
          {sections.map((section, index) => {
            const isRightOffset = section.offsetDirection === "right";
            const isEven = index % 2 === 0;

            return (
              <section
                key={section.id}
                id={section.id}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-16 lg:gap-24 max-w-[1200px] w-full mx-auto scroll-mt-28`}
              >
                {/* Text Column */}
                <div className="flex-1 flex flex-col items-start text-left w-full">
                  <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-tight">
                    {section.title}
                  </h2>
                  
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                    {section.description}
                  </p>

                  {/* Accordions (if present) */}
                  {section.accordions && section.accordions.length > 0 && (
                    <div className="w-full border-t border-purple-950/20 mb-8 divide-y divide-purple-950/20">
                      {section.accordions.map((acc, accIdx) => {
                        const accId = `${section.id}-${accIdx}`;
                        const isOpen = activeAccordion === accId;

                        return (
                          <div key={accIdx} className="py-4">
                            <button
                              onClick={() => toggleAccordion(accId)}
                              className="flex items-center justify-between w-full text-left text-white hover:text-purple-300 transition-colors py-2 focus:outline-none cursor-pointer"
                            >
                              <span className="font-semibold text-sm sm:text-base tracking-wide">
                                {acc.title}
                              </span>
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              )}
                            </button>
                            
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                isOpen ? "max-h-40 mt-3" : "max-h-0"
                              }`}
                            >
                              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-lg">
                                {acc.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* CTA Link */}
                  <Link
                    href={section.linkHref}
                    className="group flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors"
                  >
                    {section.linkText}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Image Column */}
                <div className="flex-1 w-full flex items-center justify-center">
                  <div className="relative w-full max-w-[500px] aspect-[16/11]">
                    {/* Colored Offset Background Layer */}
                    <div
                      className={`absolute inset-0 bg-[#8b5cf6] rounded-sm ${
                        isRightOffset
                          ? "translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6"
                          : "-translate-x-4 translate-y-4 sm:-translate-x-6 sm:translate-y-6"
                      } transition-transform duration-500 z-0`}
                    />

                    {/* Main Graphic Layer */}
                    <div className="absolute inset-0 bg-[#0d0417] border border-purple-500/20 rounded-sm overflow-hidden shadow-2xl z-10">
                      <div className="relative w-full h-full group/img overflow-hidden">
                        {section.imageSrc ? (
                          <Image
                            src={section.imageSrc}
                            alt={section.title}
                            fill
                            className="object-cover object-center transition-transform duration-700 hover:scale-105"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full bg-purple-950/20 flex items-center justify-center text-purple-400 text-lg font-extrabold">
                            enteropia
                          </div>
                        )}
                        
                        {/* Shadow overlay at bottom for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-15" />
                        
                        {/* Stat Overlay at bottom-left */}
                        <div className="absolute bottom-6 left-6 z-20 flex flex-col">
                          <span className="text-3xl sm:text-4xl font-extrabold text-white leading-none">
                            {section.statValue}
                          </span>
                          <span className="text-[10px] sm:text-xs font-semibold text-gray-300 tracking-wider mt-1 uppercase">
                            {section.statLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
