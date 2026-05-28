"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Copy, ChevronDown, HelpCircle, DollarSign, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ProductSections, CodeBlock } from "@/models/services/Product";

// Helper to render Lucide icon dynamically by name string
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}

interface Category {
  name: string;
  slug: string;
}

interface Subcategory {
  name: string;
  slug: string;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    sections: ProductSections;
  };
  category: Category;
  subcategory: Subcategory;
}

export default function ProductDetailClient({ product, category, subcategory }: ProductDetailClientProps) {
  const { sections } = product;
  const pd = sections.productDetails;
  
  // Code block copy & active block management
  const [activeCodeBlockIdx, setActiveCodeBlockIdx] = useState(0);
  const [copiedBlockIdx, setCopiedBlockIdx] = useState<number | null>(null);

  // FAQ Accordion management
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedBlockIdx(idx);
    setTimeout(() => setCopiedBlockIdx(null), 2000);
  };

  return (
    <div className="flex flex-col w-full font-sans bg-black text-white">
      {/* ── HERO / INTRO SECTION ────────────────────────────────────────── */}
      <section className="relative w-full bg-[#140620] pt-32 pb-24 overflow-hidden border-b border-purple-950/20">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-10">
          {/* Breadcrumbs and Title (Full Width) */}
          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-purple-500">
              <Link href="/" className="hover:text-purple-400 transition-colors">HOME</Link>
              <span>&gt;</span>
              <Link href="/services" className="hover:text-purple-400 transition-colors">SERVICES</Link>
              <span>&gt;</span>
              <Link href={`/services/${category.slug}`} className="hover:text-purple-400 transition-colors">{category.name}</Link>
              <span>&gt;</span>
              <Link href={`/services/${category.slug}/${subcategory.slug}`} className="hover:text-purple-400 transition-colors">{subcategory.name}</Link>
              <span>&gt;</span>
              <span className="text-white">{product.name}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              {pd.title || product.name}
            </h1>
          </div>

          {/* Description and Code Block row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column (Description, Points, CTAs) */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
                {pd.description || product.description}
              </p>

              {/* Bullet points */}
              {pd.points && pd.points.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {pd.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-slate-300 text-sm font-light">{pt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={`/#contact?service=${encodeURIComponent(product.name)}`}
                  className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] cursor-pointer flex items-center gap-1.5"
                >
                  Request Service
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#pricing"
                  className="px-6 py-3 rounded-full border border-purple-500/20 hover:border-purple-500/40 text-slate-300 hover:text-white text-sm font-bold transition-all bg-purple-950/10 cursor-pointer"
                >
                  View Pricing Plans
                </Link>
              </div>
            </div>

            {/* Right Column (Mock Code Terminal or Image) */}
            <div className="lg:col-span-6">
              {pd.codeBlocks && pd.codeBlocks.length > 0 ? (
                <div className="w-full bg-[#0b0312] border border-purple-900/40 rounded-xl overflow-hidden shadow-2xl">
                  {/* Window Tabs Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#11051c] border-b border-purple-950/40">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/60" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <span className="w-3 h-3 rounded-full bg-green-500/60" />
                      <span className="w-px h-4 bg-purple-950/50 mx-2" />
                      {/* Tab options if multiple code blocks */}
                      <div className="flex gap-2">
                        {pd.codeBlocks.map((cb, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveCodeBlockIdx(idx)}
                            className={`text-xs px-2.5 py-1 rounded transition-all cursor-pointer font-mono ${
                              activeCodeBlockIdx === idx
                                ? "bg-purple-950/60 text-purple-300 border border-purple-900/30"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                          >
                            {cb.filename || `${cb.language}.code`}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyCode(pd.codeBlocks![activeCodeBlockIdx].code, activeCodeBlockIdx)}
                      className="p-1.5 rounded hover:bg-purple-950/40 text-gray-500 hover:text-white transition-all cursor-pointer relative"
                      title="Copy code"
                    >
                      {copiedBlockIdx === activeCodeBlockIdx ? (
                        <Check className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-purple-400/80" />
                      )}
                    </button>
                  </div>
                  {/* Code Editor body */}
                  <div className="p-5 font-mono text-xs overflow-x-auto max-h-[320px] leading-relaxed text-purple-200">
                    <pre>{pd.codeBlocks[activeCodeBlockIdx].code}</pre>
                  </div>
                </div>
              ) : product.image ? (
                <div className="relative w-full aspect-video md:aspect-[4/3] max-w-lg mx-auto rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140620] via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] max-w-lg mx-auto rounded-xl border border-dashed border-purple-500/10 flex items-center justify-center bg-purple-950/5">
                  <ShieldCheck className="w-16 h-16 text-purple-500/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO SECTION ─────────────────────────────────────────── */}
      {sections.whatWeDo && sections.whatWeDo.cards.length > 0 && (
        <section className="relative w-full py-24 bg-black border-b border-purple-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500">
                WHAT WE DO
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {sections.whatWeDo.sectionHeading}
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-light">
                {sections.whatWeDo.sectionDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sections.whatWeDo.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="group relative bg-[#0f0418]/30 backdrop-blur-md p-7 border border-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/20 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.05)]"
                >
                  <div className="w-11 h-11 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                    <DynamicIcon name={card.icon} className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 font-light">
                    {card.description}
                  </p>
                  {card.points && card.points.length > 0 && (
                    <ul className="space-y-2 pt-2 border-t border-white/5">
                      {card.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-400 font-light">
                          <Check className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECURITY SECTION ───────────────────────────────────────────── */}
      {sections.security && sections.security.cards.length > 0 && (
        <section className="relative w-full py-24 bg-[#0d0414] border-b border-purple-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500">
                SECURITY & SAFETY
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {sections.security.sectionHeading}
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-light">
                {sections.security.sectionDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sections.security.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="group relative bg-[#0f0418]/50 p-6 md:p-8 border border-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/20 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                    <DynamicIcon name={card.icon} className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS TIMELINE SECTION ───────────────────────────────────── */}
      {sections.process && sections.process.cards.length > 0 && (
        <section className="relative w-full py-24 bg-black border-b border-purple-950/20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500">
                OUR METHODOLOGY
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {sections.process.sectionHeading}
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-light">
                {sections.process.sectionDescription}
              </p>
            </div>

            <div className="relative flex flex-col md:flex-row items-start justify-between gap-10 md:gap-0">
              {/* Connecting line for timeline */}
              <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-purple-500/40 via-purple-400/20 to-purple-500/40" />

              {sections.process.cards.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4 px-3 space-y-3">
                  <div className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    {step.step || idx + 1}
                  </div>
                  <h3 className="text-white font-bold text-base group-hover:text-purple-400 transition-colors">{step.title}</h3>
                  <p className="text-slate-400 text-[13px] leading-relaxed font-light">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING PLANS SECTION ──────────────────────────────────────── */}
      {sections.pricing && sections.pricing.cards.length > 0 && (
        <section id="pricing" className="relative w-full py-24 bg-[#0d0414] border-b border-purple-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500">
                PRICING PLANS
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {sections.pricing.sectionHeading}
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-light">
                {sections.pricing.sectionDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              {sections.pricing.cards.map((plan, idx) => {
                const isFeatured = plan.highlighted;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col relative rounded-xl p-8 border backdrop-blur-md transition-all duration-300 ${
                      isFeatured
                        ? "bg-[#160b24]/50 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.12)] scale-102 z-10"
                        : "bg-[#0f0418]/40 border-white/5 hover:border-purple-500/20"
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    )}

                    <div className="space-y-1 mb-6">
                      <h3 className="text-lg font-bold text-white">{plan.title}</h3>
                      <p className="text-xs text-slate-400 font-light">{plan.tagline}</p>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-3xl md:text-4xl font-black text-white">${plan.price}</span>
                      <span className="text-xs text-slate-400 font-light">{plan.billingCycle}</span>
                    </div>

                    {plan.priceTagline && (
                      <p className="text-[10px] text-purple-400 font-medium tracking-wide uppercase mb-6 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {plan.priceTagline}
                      </p>
                    )}

                    {/* Features list */}
                    <ul className="space-y-3.5 mb-8 flex-1 pt-6 border-t border-white/5">
                      {plan.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                          <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isFeatured ? "text-purple-400" : "text-purple-500"}`} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <Link
                      href={plan.ctaHref || `/#contact?service=${encodeURIComponent(product.name)}&plan=${encodeURIComponent(plan.title)}`}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                        isFeatured
                          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                          : "bg-purple-950/20 hover:bg-purple-950/45 text-purple-300 border border-purple-900/35 hover:text-white"
                      }`}
                    >
                      {plan.ctaLabel || "Get Started"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ACCORDION SECTION ──────────────────────────────────────── */}
      {sections.faq && sections.faq.items.length > 0 && (
        <section className="relative w-full py-24 bg-black">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {sections.faq.sectionHeading}
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-light">
                {sections.faq.sectionDescription}
              </p>
            </div>

            <div className="space-y-4">
              {sections.faq.items.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="border border-white/5 rounded-lg overflow-hidden bg-[#0f0418]/30 transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-sm md:text-base text-white hover:bg-purple-950/10 transition-colors cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-slate-400 text-xs md:text-sm font-light leading-relaxed border-t border-white/5 bg-black/10">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative w-full bg-[#140620] py-20 border-t border-purple-950/15">
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center text-center gap-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Ready to Upgrade Your Infrastructure?
          </h2>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] cursor-pointer"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
