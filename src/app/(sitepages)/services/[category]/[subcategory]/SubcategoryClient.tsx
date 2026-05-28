"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Layers, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface SubcategoryClientProps {
  category: Category;
  subcategory: Subcategory;
  products: Product[];
}

export default function SubcategoryClient({ category, subcategory, products }: SubcategoryClientProps) {
  return (
    <div className="flex flex-col w-full font-sans">
      {/* Hero Section */}
      <section className="relative w-full bg-[#140620] pt-32 pb-20 overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="max-w-2xl space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-purple-500">
              <Link href="/" className="hover:text-purple-400 transition-colors">HOME</Link>
              <span>&gt;</span>
              <Link href="/services" className="hover:text-purple-400 transition-colors">SERVICES</Link>
              <span>&gt;</span>
              <Link href={`/services/${category.slug}`} className="hover:text-purple-400 transition-colors">{category.name.toUpperCase()}</Link>
              <span>&gt;</span>
              <span className="text-white">{subcategory.name.toUpperCase()}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 flex-shrink-0">
                <Tag className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              {subcategory.name}
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
              {subcategory.description}
            </p>
          </div>

          <div className="relative pr-6 pb-6 w-full lg:w-96 h-48 lg:h-56 flex-shrink-0">
            {/* Background offset block: same size as main image container, shifted down-right */}
            <div className="absolute top-5 left-5 right-6 bottom-0 bg-[#8b5cf6] rounded-sm z-0" />

            {/* Main Image Container */}
            <div className="relative w-full h-full right-6 rounded-sm overflow-hidden border border-purple-500/20 shadow-2xl bg-[#0f0418] transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1 z-10">
              {subcategory.image ? (
                <img
                  src={subcategory.image}
                  alt={subcategory.name}
                  className="object-cover w-full h-full opacity-65 hover:opacity-85 transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-950/10">
                  <Tag className="w-16 h-16 text-purple-500/25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0418] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="relative w-full bg-black py-20 min-h-[300px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500 mb-2">
              SERVICES & PRODUCTS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Select Your Ideal Solution
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-center space-y-4">
              <Layers className="w-12 h-12 opacity-20 text-purple-400" />
              <p className="text-sm font-light">No products or individual services are currently listed here.</p>
              <Link href={`/services/${category.slug}`} className="text-xs text-purple-400 hover:text-purple-300 font-bold underline">
                Back to {category.name}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative flex flex-col bg-[#0f0418]/45 backdrop-blur-md p-6 border border-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.06)] hover:-translate-y-1.5"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Product Cover Image inside card */}
                  {prod.image && (
                    <div className="w-full h-36 rounded-md overflow-hidden border border-white/5 mb-5 relative">
                      <img src={prod.image} alt={prod.name} className="object-cover w-full h-full opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0418] to-transparent pointer-events-none" />
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    <Link href={`/services/${category.slug}/${subcategory.slug}/${prod.slug}`}>
                      {prod.name}
                    </Link>
                  </h3>

                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 font-light flex-1">
                    {prod.description}
                  </p>

                  <div className="pt-4 border-t border-white/5 mt-auto">
                    <Link
                      href={`/services/${category.slug}/${subcategory.slug}/${prod.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors group/view"
                    >
                      View Details & Setup
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/view:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
