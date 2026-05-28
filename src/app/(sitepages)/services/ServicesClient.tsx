"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Server, Shield, Code, Cpu, Cloud, Network,
  Layout, ArrowRight, Search, Briefcase, ChevronRight
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
}

interface ServicesClientProps {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
}

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("cloud")) return Cloud;
  if (s.includes("devops") || s.includes("infra")) return Server;
  if (s.includes("security") || s.includes("cyber")) return Shield;
  if (s.includes("code") || s.includes("dev") || s.includes("software")) return Code;
  if (s.includes("network") || s.includes("telecom")) return Network;
  if (s.includes("consult") || s.includes("advisor") || s.includes("manage")) return Briefcase;
  if (s.includes("hardware") || s.includes("iot")) return Cpu;
  return Layout;
};

export default function ServicesClient({ categories, subcategories, products }: ServicesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Group subcategories by category ID
  const subcategoriesByCat = categories.reduce<Record<string, Subcategory[]>>((acc, cat) => {
    acc[cat.id] = subcategories.filter((s) => s.category === cat.id);
    return acc;
  }, {});

  // Group products by subcategory ID
  const productsBySub = subcategories.reduce<Record<string, Product[]>>((acc, sub) => {
    acc[sub.id] = products.filter((p) => p.subcategory === sub.id);
    return acc;
  }, {});

  // Filter based on search query
  const isSearching = searchQuery.trim().length > 0;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubs = subcategories.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    products.some((p) => p.subcategory === s.id && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subcategoriesByCat[c.id]?.some((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productsBySub[s.id]?.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const getProductUrl = (prod: Product) => {
    const cat = categories.find((c) => c.id === prod.category);
    const sub = subcategories.find((s) => s.id === prod.subcategory);
    if (!cat || !sub) return "#";
    return `/services/${cat.slug}/${sub.slug}/${prod.slug}`;
  };

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Hero Section */}
      <section className="relative w-full bg-[#140620] pt-32 pb-20 overflow-hidden select-none">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest text-purple-500 mb-2">
            <Link href="/" className="hover:text-purple-400 transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-white">SERVICES</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Our Services & <span className="bg-gradient-to-r from-[#a855f7] to-[#c455e3] bg-clip-text text-transparent">Solutions</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            We provide robust, high-performance software engineering, cloud architecture, and security services tailored for your enterprise.
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-md mx-auto relative pt-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search services, products, or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0f0418]/80 border border-purple-500/20 hover:border-purple-500/35 focus:border-[#a855f7] rounded-full text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#a855f7] transition-all shadow-[0_0_15px_rgba(168,85,247,0.05)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="relative w-full bg-black py-20 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-6">
          {isSearching && (
            <div className="mb-8 text-sm text-gray-400 font-light">
              Showing search results for "<span className="text-purple-300 font-medium">{searchQuery}</span>" ({filteredCategories.length} categories, {filteredProducts.length} services found)
            </div>
          )}

          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center space-y-4">
              <Layout className="w-16 h-16 opacity-20 text-purple-400" />
              <p className="text-base font-light">No services found matching your search term.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-20 lg:space-y-32">
              {filteredCategories.map((cat, idx) => {
                const IconComponent = getCategoryIcon(cat.slug);
                const catSubs = subcategoriesByCat[cat.id] || [];
                // Filter subs if search is active
                const displaySubs = isSearching
                  ? catSubs.filter(s => filteredSubs.some(fs => fs.id === s.id))
                  : catSubs;

                const isOdd = idx % 2 === 1;

                return (
                  <div
                    key={cat.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center py-2 border-b border-purple-950/15 last:border-0"
                  >
                    {/* Left/Right Column: Content */}
                    <div className={`lg:col-span-6 space-y-6 order-2 ${isOdd ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                          {cat.name}
                        </h2>

                        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light">
                          {cat.description}
                        </p>
                      </div>

                      {/* Subcategories pills */}
                      {displaySubs.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-purple-400/80">Subcategories</p>
                          <div className="flex flex-wrap gap-2">
                            {displaySubs.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/services/${cat.slug}/${sub.slug}`}
                                className="text-xs px-3.5 py-1.5 rounded-md bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 border border-purple-900/35 hover:border-purple-600/35 hover:text-white transition-all"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Explore Button */}
                      <div className="pt-2">
                        <Link
                          href={`/services/${cat.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#a855f7] hover:text-purple-300 transition-colors group"
                        >
                          EXPLORE PROGRAM DETAILS
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Left/Right Column: Image with offset bg */}
                    <div className={`lg:col-span-6 order-1 ${isOdd ? "lg:order-1 lg:pr-8" : "lg:order-2 lg:pl-8"}`}>
                      {/* Wrapper container to offset-shift the background solid container */}
                      <div className={`relative pr-6 pb-6 max-w-[480px] mx-auto ${isOdd ? "lg:ml-0 lg:mr-auto" : "lg:mr-0 lg:ml-auto"}`}>
                        {/* Background offset block: same size as main image container, shifted down-right */}
                        <div className="absolute top-5 left-5 right-6 bottom-0 bg-[#8b5cf6] rounded-sm z-0" />

                        {/* Main Image Container */}
                        <div className="relative w-full aspect-[16/10] right-6 rounded-sm overflow-hidden border border-purple-500/20 shadow-2xl bg-[#0f0418] transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1 z-10">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="object-cover w-full h-full opacity-65 hover:opacity-85 transition-opacity duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-purple-950/10">
                              <IconComponent className="w-16 h-16 text-purple-500/25" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0418] via-transparent to-transparent pointer-events-none" />

                          {/* 1x SCALE IMPACT Overlay */}
                          <div className="absolute bottom-6 left-6 text-left">
                            <h4 className="text-3xl font-black text-white leading-none">
                              {idx + 1}x
                            </h4>
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200 mt-1">
                              {idx % 2 === 0 ? "SCALE IMPACT" : "ENTERPRISE QUALITY"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
