import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  TrendingUp,
  FileCheck,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Shield,
  Database,
  Mail,
  Save,
  Monitor,
  Box,
  Server,
  Code2,
  Globe,
  Leaf,
  Rocket,
  Building2
} from "lucide-react";
import dbConnect from "@/lib/db";
import ProductModel from "@/models/manage-services/products";

interface RouteParams {
  params: Promise<{ services: string; subservices: string; slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  try {
    await dbConnect();
    const product = await ProductModel.findOne({
      $or: [
        { slug: slug },
        { subcategorySlug: slug }
      ]
    });
    if (!product) {
      return {
        title: "Details Coming Soon | enteropia",
      };
    }

    return {
      title: `${product.seoTitle || product.name} | enteropia Services`,
      description: product.seoDescription || product.description,
      alternates: {
        canonical: `/services/${slug}`,
      },
    };
  } catch (err) {
    return { title: "Services | enteropia" };
  }
}

const getToolIcon = (toolName: string) => {
  const name = toolName.toLowerCase();
  if (name.includes("database") || name.includes("sql") || name.includes("postgres") || name.includes("mongo") || name.includes("redis")) return Database;
  if (name.includes("mail") || name.includes("email") || name.includes("smtp")) return Mail;
  if (name.includes("backup") || name.includes("disaster") || name.includes("restore") || name.includes("recovery")) return Save;
  if (name.includes("active directory") || name.includes("directory") || name.includes("iam") || name.includes("auth") || name.includes("ldap") || name.includes("security") || name.includes("key")) return Shield;
  if (name.includes("virtual") || name.includes("vm") || name.includes("hypervisor") || name.includes("proxmox") || name.includes("esxi") || name.includes("docker") || name.includes("kubernetes")) return Monitor;
  if (name.includes("storage") || name.includes("nas") || name.includes("san") || name.includes("s3") || name.includes("nfs") || name.includes("volume")) return Box;
  if (name.includes("server") || name.includes("nginx") || name.includes("apache") || name.includes("hosting") || name.includes("infrastructure")) return Server;
  if (name.includes("api") || name.includes("rest") || name.includes("graphql") || name.includes("code") || name.includes("endpoint")) return Code2;
  if (name.includes("cloud") || name.includes("aws") || name.includes("azure") || name.includes("gcp") || name.includes("web") || name.includes("network")) return Globe;
  return Server;
};

const getPlanIcon = (planName: string) => {
  const name = planName.toLowerCase();
  if (name.includes("starter") || name.includes("basic")) return Leaf;
  if (name.includes("professional") || name.includes("pro") || name.includes("growth")) return Rocket;
  return Building2;
};

const getIconColor = (planName: string) => {
  const name = planName.toLowerCase();
  if (name.includes("starter") || name.includes("basic")) return "text-emerald-400";
  if (name.includes("professional") || name.includes("pro") || name.includes("growth")) return "text-rose-400";
  return "text-blue-400";
};

const isFeatureDisabled = (feat: string) => {
  return feat.startsWith("-") || feat.startsWith("x") || feat.startsWith("X") || feat.startsWith("✕") || feat.startsWith("✗");
};

const cleanFeatureText = (feat: string) => {
  return feat.replace(/^[-xX✕✗]\s*/, "");
};

export default async function SubServiceDetailPage({ params, searchParams }: RouteParams) {
  const { services, subservices, slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeTabIdx = typeof resolvedSearchParams.tab === "string" ? parseInt(resolvedSearchParams.tab) || 0 : 0;

  // Route security check to match /services path
  if (services !== "services") {
    notFound();
  }

  let product;
  try {
    await dbConnect();
    product = await ProductModel.findOne({
      $or: [
        { slug: slug },
        { subcategorySlug: slug }
      ]
    });
  } catch (err) {
    console.error("Error loading product detail from database:", err);
  }

  // If product is not found, render a premium Coming Soon screen
  if (!product) {
    return (
      <div className="w-full bg-black min-h-screen pt-32 pb-24 px-6 sm:px-12 md:px-20 lg:px-32 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none z-0" />

        <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
          <Sparkles className="w-16 h-16 text-purple-500/50 mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Details Coming Soon
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            The specifications, architectures, and program details for this service are currently being finalized by our engineering team.
          </p>
          <Link
            href={`/services/${subservices}`}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to {subservices.replace(/-/g, " ")}
          </Link>
        </div>
      </div>
    );
  }

  // Define tools-divided sections
  const sections = product.toolSections && product.toolSections.length > 0
    ? product.toolSections
    : [
        {
          id: "default",
          title: product.title || product.name,
          description: product.description,
          tools: product.tags || [],
          serverPlatforms: product.serverPlatforms || []
        }
      ];

  const activeIdx = activeTabIdx >= 0 && activeTabIdx < sections.length ? activeTabIdx : 0;
  const activeSection = sections[activeIdx];

  // Map colors for tags
  const colors = [
    "bg-white/10 text-white",
    "bg-green-500/10 text-green-400",
    "bg-blue-500/10 text-blue-400",
    "bg-indigo-500/10 text-indigo-400",
    "bg-sky-500/10 text-sky-400",
    "bg-cyan-500/10 text-cyan-400"
  ];
  const techStack = (activeSection.tools || []).map((tag: string, idx: number) => ({
    name: tag,
    color: colors[idx % colors.length]
  }));

  const activeBlock = product.serverPlatforms && product.serverPlatforms.length > 0
    ? (product.serverPlatforms.find((block: any) => {
        const tools = activeSection.tools || [];
        return tools.some((t: string) => 
          block.name.toLowerCase().includes(t.toLowerCase()) || 
          t.toLowerCase().includes(block.name.toLowerCase())
        );
      }) || product.serverPlatforms[activeIdx] || product.serverPlatforms[0])
    : null;

  return (
    <div className="w-full bg-black min-h-screen pt-32 pb-24 px-6 sm:px-12 md:px-20 lg:px-32 relative overflow-hidden flex flex-col">
      {/* Background glow overlay */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-5xl w-full mx-auto relative z-10 flex-1 flex flex-col">
        {/* Back Link */}
        <Link
          href={`/services/${subservices}`}
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Link>

        {/* Centered Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-[#c455e3] text-xs font-semibold tracking-wider uppercase mb-5">
            {subservices.replace(/-/g, " ")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
            {product.name}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl font-light">
            {product.description}
          </p>
        </div>

        {/* Dynamic Tool Tabs Switcher */}
        {sections.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {sections.map((sec: any, idx: number) => {
              const label = sec.tools && sec.tools.length > 0 ? sec.tools[0] : sec.title;
              const isActive = idx === activeIdx;
              const Icon = getToolIcon(label);
              return (
                <Link
                  key={sec.id || idx}
                  href={`?tab=${idx}`}
                  scroll={false}
                  className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-purple-950/40 border-[#00f2fe] text-white shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                      : "bg-[#0c0414]/80 border-purple-950/40 text-gray-400 hover:text-white hover:border-purple-500/30"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#00f2fe]" : "text-purple-400"}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Active Tab Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4 mb-20">
          {/* Left Side: Section Details and Checklist */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill */}
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#00f2fe]/30 bg-[#00f2fe]/5 text-[#00f2fe] text-[10px] font-bold tracking-wider uppercase">
              {activeSection.tools && activeSection.tools.length > 0 
                ? `${activeSection.tools.join(" & ").toUpperCase()} — HIGH AVAILABILITY` 
                : `${activeSection.title.toUpperCase()} — SPECIFICATION`}
            </span>

            {/* Section Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {activeSection.title || product.name}
            </h2>

            {/* Section Description */}
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-light">
              {activeSection.description || product.description}
            </p>

            {/* Features Checklist */}
            {activeBlock && activeBlock.features && activeBlock.features.length > 0 && (
              <ul className="space-y-3.5 pt-4 border-t border-purple-950/20">
                {activeBlock.features.map((feat: string, fIdx: number) => (
                  <li key={fIdx} className="flex items-start gap-3.5 text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Side: Code Snippet / Terminal Mockup */}
          <div className="lg:col-span-5 w-full">
            {activeBlock && activeBlock.configCode ? (
              <div className="w-full rounded-sm border border-purple-950/50 bg-[#06020c]/90 overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[#00f2fe]/5">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-[#090312] border-b border-purple-950/40 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                  </div>
                  <span className="text-purple-400/70 font-semibold uppercase tracking-wider font-mono">
                    {activeBlock.name || "Configuration File"}
                  </span>
                </div>
                {/* Terminal Code Body */}
                <div className="p-6 font-mono text-xs text-[#00f2fe] max-h-[380px] overflow-y-auto overflow-x-auto whitespace-pre leading-relaxed select-all scrollbar-thin scrollbar-thumb-purple-950 scrollbar-track-transparent">
                  <pre className="text-left font-light">{activeBlock.configCode}</pre>
                </div>
              </div>
            ) : (
              /* Fallback if no code snippet: show illustration image or ambient card */
              <div className="w-full rounded-sm border border-purple-950/40 bg-[#0c0414]/90 p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full blur-2xl pointer-events-none" />
                <Cpu className="w-12 h-12 text-purple-500/30 mb-4 animate-pulse" />
                <h3 className="text-white text-sm font-bold mb-2">Specifications Loaded</h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-light">
                  Detailed technical parameters and architectures are fully configured for this service stack.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* What We Do Section */}
        {product.whatWeDo && product.whatWeDo.length > 0 && (
          <div className="border-t border-purple-950/30 pt-20 mb-24">
            {/* Centered What We Do Header */}
            <div className="flex flex-col items-center justify-center text-center mb-16">
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-[#c455e3] text-xs font-semibold tracking-wider uppercase mb-5">
                What We Do
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 leading-tight">
                Complete {product.name.replace(/Solutions|Services/gi, "").trim()} Services
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl font-light">
                {`End-to-end ${product.name.toLowerCase()} including ${product.whatWeDo
                  .map((w: any) => w.title.replace(/Solutions|Hardening|Configuration|&|Management/gi, "").trim().toLowerCase())
                  .filter(Boolean)
                  .join(", ")}, and ongoing management.`}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {product.whatWeDo.map((section: any, idx: number) => {
                const Icon = getToolIcon(section.title);
                return (
                  <div 
                    key={idx} 
                    className="p-8 rounded-sm bg-[#0c0414]/90 border border-purple-950/40 hover:border-[#00f2fe]/40 hover:bg-[#0c0414]/95 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,242,254,0.06)] flex flex-col justify-start relative overflow-hidden group text-left"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00f2fe]/5 transition-all duration-500" />
                    
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-sm bg-purple-950/20 border border-purple-800/10 flex items-center justify-center text-purple-400 group-hover:bg-[#00f2fe]/20 group-hover:text-[#00f2fe] group-hover:border-[#00f2fe]/10 transition-all mb-6">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-4">
                      {/* Card Title */}
                      <h3 className="text-white text-base font-bold group-hover:text-[#00f2fe] transition-colors">
                        {section.title}
                      </h3>
                      
                      {/* Card Description */}
                      <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                        {section.description}
                      </p>
                      
                      {/* Plain Points List */}
                      {section.points && section.points.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-purple-950/20 group-hover:border-[#00f2fe]/10 transition-colors">
                          {section.points.map((point: string, pIdx: number) => (
                            <p key={pIdx} className="text-gray-400/80 text-xs font-light leading-normal">
                              {point}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Security Features */}
        {product.securityFeatures && product.securityFeatures.length > 0 && (
          <div className="border-t border-purple-950/20 pt-12 mb-16">
            {/* Centered Security Header */}
            <div className="flex flex-col items-center justify-center text-center mb-10">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-purple-500/20 bg-purple-950/10 text-[#c455e3] text-[10px] font-bold tracking-wider uppercase mb-3">
                {subservices.replace(/-/g, " ")} Security
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3">
                Enterprise-Grade {product.name.replace(/Solutions|Services/gi, "").trim()} Protection
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm max-w-2xl font-light">
                Every environment follows industry security standards for maximum reliability.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
              {/* Left Column: Security Features list */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                {product.securityFeatures.map((sec: any, idx: number) => {
                  const Icon = getToolIcon(sec.title);
                  return (
                    <div 
                      key={idx} 
                      className="py-2.5 px-4 sm:py-3 sm:px-5 rounded-sm bg-[#0c0414]/40 border border-purple-950/30 hover:border-[#00f2fe]/20 transition-all duration-300 flex items-start gap-4 text-left group w-full"
                    >
                      <div className="w-8 h-8 rounded-sm bg-purple-950/10 border border-purple-800/10 flex items-center justify-center text-purple-400 group-hover:text-[#00f2fe] transition-all flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-white text-xs sm:text-sm font-semibold group-hover:text-[#00f2fe] transition-colors">
                          {sec.title}
                        </h3>
                        <p className="text-gray-400 text-[11px] sm:text-xs font-light leading-relaxed mt-0.5">
                          {sec.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Rotating Logo */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-40 h-40 sm:w-48 sm:h-48 object-contain filter drop-shadow-[0_0_15px_rgba(0,242,254,0.35)] animate-logo-spin"
                />
              </div>
            </div>
          </div>
        )}

        {/* Our Process Section */}
        {product.processSteps && product.processSteps.length > 0 && (
          <div className="border-t border-purple-950/20 pt-16 mb-20">
            {/* Centered Process Header */}
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-sm border border-purple-500/30 bg-purple-950/20 text-[#c455e3] text-xs font-semibold tracking-wider uppercase mb-4">
                Our Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                How We Deliver {product.name.replace(/Solutions|Services/gi, "").trim()} Solutions
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm max-w-2xl font-light">
                A structured workflow to design, deploy, secure, and manage reliable enterprise infrastructure environments.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {product.processSteps.map((step: any, idx: number) => {
                const Icon = getToolIcon(step.title);
                const stepNum = step.step || idx + 1;
                return (
                  <div 
                    key={idx} 
                    className="p-6 rounded-sm bg-[#0c0414]/90 border border-purple-950/40 hover:border-[#00f2fe]/40 hover:bg-[#0c0414]/95 transition-all duration-300 flex flex-col justify-start relative overflow-hidden group text-left"
                  >
                    {/* Top Row: Number Badge */}
                    <div className="flex items-center justify-between w-full mb-6">
                      <span className="w-7 h-7 rounded-sm bg-gradient-to-br from-[#00f2fe] to-[#c455e3] text-black text-xs font-black flex items-center justify-center">
                        {stepNum}
                      </span>
                    </div>
                    {/* Title & Description */}
                    <h3 className="text-white text-sm sm:text-base font-bold mb-2 group-hover:text-[#00f2fe] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-xs font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}



        {/* Pricing Plans */}
        {product.pricingPlans && product.pricingPlans.length > 0 && (
          <div className="border-t border-purple-950/20 pt-16 mb-20">
            {/* Centered Pricing Header */}
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-sm border border-purple-500/30 bg-purple-950/20 text-[#c455e3] text-xs font-semibold tracking-wider uppercase mb-4">
                Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Flexible {product.name.replace(/Solutions|Services/gi, "").trim()} Packages
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm max-w-2xl font-light">
                Scalable solutions designed for startups, growing businesses, and enterprise environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.pricingPlans.map((plan: any, idx: number) => {
                const PlanIcon = getPlanIcon(plan.name);
                const iconColorClass = getIconColor(plan.name);
                const isHighlighted = plan.highlighted || idx === 1;

                return (
                  <div
                    key={plan.id || idx}
                    className={`p-8 rounded-sm transition-all duration-300 flex flex-col justify-between relative overflow-hidden group text-center ${
                      isHighlighted
                        ? "bg-[#0c0414]/95 border border-[#00f2fe] shadow-[0_0_30px_rgba(0,242,254,0.15)]"
                        : "bg-[#0c0414]/90 border border-purple-950/60 hover:border-purple-800/40"
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#00f2fe] to-[#c455e3] rounded-sm text-black text-[9px] font-black tracking-widest uppercase z-20">
                        Most Popular
                      </div>
                    )}

                    <div>
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <PlanIcon className={`w-8 h-8 ${iconColorClass}`} />
                      </div>

                      {/* Name & Short description */}
                      <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-xs text-gray-400 mb-6 font-light leading-relaxed">{plan.description}</p>
                      
                      {/* Price & Period */}
                      <div className="mb-6 flex flex-col items-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                        </div>
                        {plan.period && (
                          <p className="text-xs text-gray-500 mt-1.5 font-light">{plan.period}</p>
                        )}
                      </div>

                      <div className="w-full h-px bg-purple-950/30 my-6" />

                      {/* Features */}
                      <ul className="space-y-3.5 mb-8 text-left w-full">
                        {plan.features.map((feat: string, fIdx: number) => {
                          const disabled = isFeatureDisabled(feat);
                          const text = cleanFeatureText(feat);
                          return (
                            <li 
                              key={fIdx} 
                              className={`flex items-start gap-2.5 text-xs font-light leading-relaxed ${
                                disabled ? "text-gray-600" : "text-gray-300"
                              }`}
                            >
                              {disabled ? (
                                <X className="w-4 h-4 text-rose-500/70 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              )}
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isHighlighted ? (
                        <button className="w-full py-3 rounded-sm bg-gradient-to-r from-[#00f2fe] to-[#c455e3] text-black text-xs font-bold tracking-wider uppercase hover:opacity-90 transition-all cursor-pointer">
                          Get Started
                        </button>
                      ) : (
                        <button className="w-full py-3 rounded-sm border border-purple-950/60 hover:border-purple-500/40 bg-transparent text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer">
                          {plan.name.toLowerCase().includes("enterprise") ? "Contact Sales" : "Get Started"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQs */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="border-t border-purple-950/20 pt-16 mb-12">
            {/* Centered FAQ Header */}
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-sm border border-purple-500/30 bg-purple-950/20 text-[#c455e3] text-xs font-semibold tracking-wider uppercase mb-4">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm max-w-2xl font-light">
                Common questions about our enterprise infrastructure and server solutions.
              </p>
            </div>

            {/* Center Aligned Dropdowns */}
            <div className="max-w-3xl mx-auto space-y-3.5 w-full">
              {product.faqs.map((faq: any) => (
                <div 
                  key={faq.id} 
                  className="group p-5 rounded-sm bg-[#0c0414]/70 border border-purple-950/40 hover:border-[#00f2fe]/40 hover:bg-[#0c0414]/90 transition-all duration-300 text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-[#00f2fe] transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 group-hover:text-[#00f2fe] transition-all duration-300 flex-shrink-0" />
                  </div>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-96 group-hover:mt-3 transition-all duration-300 ease-in-out">
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
