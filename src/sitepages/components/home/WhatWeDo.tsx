import React from "react";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db";
import CategoryModel from "@/models/manage-services/categories";
import { Sparkles } from "lucide-react";

const getCategoryDescription = (slug: string) => {
  const descriptions: Record<string, string> = {
    "software-solutions": "Creating tailored, high-quality software solutions that drive efficiency, growth, and long-term value.",
    "cloud-infrastructure": "Delivering secure, scalable, and reliable cloud-based IT systems that form the backbone of modern business operations.",
    "ai-machine-learning": "Leveraging intelligent algorithms and data models to automate operations, discover insights, and power future-ready systems.",
    "app-solutions": "Building native and cross-platform mobile applications with high-fidelity UI and seamless user experience.",
    "networking-and-secure-solutions": "Designing robust network architectures and advanced threat protection to keep corporate assets secure.",
    "digital-solutions-media": "Transforming your digital presence through premium web design, branding, and content creation."
  };
  return descriptions[slug] || "Professional tech services and engineered solutions tailored to your operational needs.";
};

export default async function WhatWeDo() {
  let categories: any[] = [];
  try {
    await dbConnect();
    categories = await CategoryModel.find({}).sort({ name: 1 });
  } catch (err) {
    console.error("Error loading categories for homepage:", err);
  }

  return (
    <section id="services" className="relative w-full py-10 flex flex-col items-center justify-center z-10 bg-black">
      {/* Header Content */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6 mb-16">
        <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/10 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-5">
          What We Do
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Your Premium Tech Partner
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
          Founded in 2025, enteropia delivers innovative, reliable, and scalable tech solutions, 
          specializing in software development, IT infrastructure, and digital transformation. We help 
          businesses build lasting value with sustainable, future-ready systems.
        </p>
      </div>

      {/* Grid Layout */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-w-lg mx-auto">
          <Sparkles className="w-12 h-12 text-purple-500/50 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-white mb-2">Services Coming Soon</h3>
          <p className="text-gray-400 text-xs md:text-sm">
            Our premium tech catalog is currently being updated. Please check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] w-full px-6">
          {categories.map((category) => {
            const description = getCategoryDescription(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/services/${category.slug}`}
                className="relative flex flex-col rounded-[20px] bg-[#0c0414]/80 border border-purple-950/40 hover:border-purple-500/30 overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(168,85,247,0.1)]"
              >
                {/* Illustration Area */}
                <div className="relative h-44 w-full bg-gradient-to-b from-purple-950/15 to-transparent overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-950/20 flex items-center justify-center text-purple-400/55 text-sm font-bold">
                      enteropia
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0414] to-transparent" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col p-6 pt-2 flex-1 w-full">
                  <h3 className="text-white text-lg md:text-xl font-semibold mb-2 group-hover:text-[#c455e3] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 flex-1">
                    {description}
                  </p>
                  <div className="text-purple-400 text-xs font-semibold flex items-center gap-1.5 group-hover:text-purple-300 transition-colors mt-auto">
                    Enquire Now
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
