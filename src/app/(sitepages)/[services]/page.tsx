"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Code2,
  ShieldCheck,
  CloudLightning,
  Cpu,
  Layers,
  HelpCircle,
  Plus,
  Minus,
  Workflow,
  MousePointerClick,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface ISubService {
  _id: string;
  title: string;
  description: string;
  whatWeOffer: string[];
  benefits: string[];
  order: number;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  order: number;
  subservices?: ISubService[];
}



const roadmapSteps = [
  { step: "01", title: "Discovery & Strategy", description: "We align on your business objectives, perform user research, and define requirements scoping." },
  { step: "02", title: "Architecture Blueprint", description: "We map out interactive UX flows, data models, serverless environments, and technology selection." },
  { step: "03", title: "Agile Development", description: "We code using structured Next.js/TypeScript standards with regular staging environment feedback." },
  { step: "04", title: "Auditing & QA", description: "We carry out comprehensive integration runs, stress loads, accessibility reviews, and penetration audits." },
  { step: "05", title: "Scalable Deploy", description: "We orchestrate seamless, zero-downtime releases into auto-scaling high-availability cloud grids." },
];

const coreValues = [
  { icon: <Code2 className="w-8 h-8 text-purple-400" />, title: "Clean Architecture", description: "Future-proof codebase using strict TypeScript, reusable patterns, and robust type safety." },
  { icon: <CloudLightning className="w-8 h-8 text-fuchsia-400" />, title: "Cloud-Native Scale", description: "Designed for serverless auto-scaling, low latencies, and distributed global delivery." },
  { icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />, title: "Rigorous Security", description: "Encrypted transits, authorization frameworks, and proactive defense assessments." },
  { icon: <Cpu className="w-8 h-8 text-pink-400" />, title: "Cognitive Intelligence", description: "Infusing smart machine learning workflows, automation, and automated triggers." },
];

const faqData = [
  { q: "How do we kick-off a project with Purpi?", a: "Getting started is straightforward. Press the 'Schedule a Consultation' button, choose a time slot, and fill in brief details. Our systems architect will run a 30-minute discovery workshop to outline scope, feasibility, and a preliminary timeline blueprint." },
  { q: "Can you modernize and scale our existing application?", a: "Yes! We specialize in migrating legacy structures into high-performance architectures (e.g. Next.js, React, Node.js, Go) and scaling existing infrastructure using cloud clusters (AWS/GCP), container schedules (Kubernetes), and serverless endpoints." },
  { q: "What is your typical project timeline and milestones?", a: "Timeline depends on scope. Simple digital solutions deploy in 2–4 weeks. Complex custom enterprise software ranges between 6–12 weeks. We split delivery into sprints with concrete staging builds for client testing every fortnight." },
  { q: "Do you offer post-launch support and hosting maintenance?", a: "Absolutely. We provide dedicated, SLA-backed maintenance retainer structures. This includes 24/7 automated monitoring, system log monitoring, performance tuning, emergency bug fixes, and continuous software updates." },
];

const getServiceCategory = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("cloud") || s.includes("networking") || s.includes("secure") || s.includes("security")) return "infrastructure";
  if (s.includes("ai") || s.includes("machine") || s.includes("learning")) return "ai";
  return "development";
};

const getServiceExtraDetails = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("digital")) return { features: ["Strategic UI/UX Design", "Conversion Rate Optimization", "SEO & Content Architecture"], stat: "100%", statLabel: "Engagement Rate" };
  if (s.includes("software")) return { features: ["Custom API Integrations", "Database Normalization", "Automated Testing Frameworks"], stat: "2.4x", statLabel: "Process Efficiency" };
  if (s.includes("app")) return { features: ["Cross-Platform React Native", "Native Performance Tuning", "Offline-First Data Syncing"], stat: "4.8★", statLabel: "App Store Rating" };
  if (s.includes("networking") || s.includes("secure")) return { features: ["Zero-Trust Network Access", "24/7 Security Operations", "Incident Response Blueprinted"], stat: "< 1ms", statLabel: "Network Latency" };
  if (s.includes("cloud")) return { features: ["Infrastructure as Code (IaC)", "Multi-Region Auto-Scaling", "FinOps Budget Containment"], stat: "99.99%", statLabel: "SLA Uptime" };
  if (s.includes("ai") || s.includes("machine")) return { features: ["NLP Conversational Agents", "Predictive Analytics Models", "Automated Trigger Systems"], stat: "< 60s", statLabel: "Inference Latency" };
  return { features: ["Bespoke Architecture Design", "Dedicated Project Management", "Post-Launch Retainer SLA"], stat: "10x", statLabel: "Deployment Speed" };
};

const getServiceImages = (slug: string, primaryImage: string) => {
  const s = slug.toLowerCase();
  let secondary = primaryImage;
  if (s.includes("digital")) {
    secondary = "/illustrations/software-solutions.png";
  } else if (s.includes("software")) {
    secondary = "/illustrations/app-solutions.png";
  } else if (s.includes("app")) {
    secondary = "/illustrations/digital-media.png";
  } else if (s.includes("networking") || s.includes("secure")) {
    secondary = "/illustrations/cloud-infrastructure.png";
  } else if (s.includes("cloud")) {
    secondary = "/illustrations/networking-security.png";
  } else if (s.includes("ai") || s.includes("machine")) {
    secondary = "/illustrations/software-solutions.png";
  }
  return {
    primary: primaryImage,
    secondary: secondary
  };
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedSubs, setExpandedSubs] = useState<{ [serviceId: string]: string | null }>({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const result = await res.json();
        if (result.success && result.data && result.data.length > 0) {
          const servicesWithSubs = await Promise.all(
            result.data.map(async (service: Service) => {
              try {
                const subRes = await fetch(`/api/services/${service.slug}/subservices`);
                const subResult = await subRes.json();
                return {
                  ...service,
                  subservices: subResult.success ? subResult.data : [],
                };
              } catch {
                return { ...service, subservices: [] };
              }
            })
          );
          setServices(servicesWithSubs);
          
          // Default expand first subservice for each main service
          const initialExpanded: { [serviceId: string]: string | null } = {};
          servicesWithSubs.forEach((service) => {
            if (service.subservices && service.subservices.length > 0) {
              initialExpanded[service._id] = service.subservices[0]._id;
            } else {
              initialExpanded[service._id] = null;
            }
          });
          setExpandedSubs(initialExpanded);
        } else {
          setServices([]);
        }
      } catch {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const toggleSubService = (serviceId: string, subServiceId: string) => {
    setExpandedSubs((prev) => ({
      ...prev,
      [serviceId]: prev[serviceId] === subServiceId ? null : subServiceId,
    }));
  };

  const filteredServices = services.filter((s) => {
    if (activeCategory === "all") return true;
    return getServiceCategory(s.slug) === activeCategory;
  });

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10 flex flex-col items-center overflow-x-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a38_1px,transparent_1px),linear-gradient(to_bottom,#1f0a38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-purple-600/10 via-fuchsia-600/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none" />

      {/* ── SECTION 1: HERO ── */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6 mb-16 mt-20 relative z-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#c455e3] mb-6 tracking-tight">
          Services We Offer
        </h1>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl font-light">
          From cutting-edge digital experiences to scalable enterprise infrastructure, discover our range of tech solutions designed to power your corporate vision.
        </p>
      </div>

      {/* ── SECTION 2: FILTER & ALTERNATING LIST ── */}
      <div className="max-w-[1200px] w-full px-6 relative z-20 mb-28">
        {/* Filter Bar */}
        <div className="flex justify-center mb-20">
          <div className="inline-flex flex-wrap justify-center items-center gap-1.5 p-2 bg-[#0c0414]/90 border border-purple-950/40 rounded-2xl backdrop-blur-md shadow-2xl">
            {[
              { id: "all", label: "All Solutions" },
              { id: "development", label: "Software & Apps" },
              { id: "infrastructure", label: "Infrastructure & Security" },
              { id: "ai", label: "AI & Automation" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_4px_15px_rgba(147,51,234,0.35)]"
                    : "text-gray-400 hover:text-white hover:bg-purple-950/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
            <p className="text-sm">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 border border-purple-900/10 bg-[#12061f]/20 rounded-3xl p-8">
            <Layers className="w-12 h-12 mb-4 opacity-25 text-purple-400" />
            <h3 className="text-white text-lg font-bold mb-1">No matches found</h3>
            <p className="text-sm max-w-sm">No services listed under this specific category at the moment.</p>
          </div>
        ) : (
          <div className="space-y-40">
            {filteredServices.map((service, index) => {
              const isEven = index % 2 === 0;
              const details = getServiceExtraDetails(service.slug);
              const activeSubId = expandedSubs[service._id];

              return (
                <div
                  key={service._id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
                >
                  {/* ── Text & Accordion Column ── */}
                  <div className={`lg:col-span-5 space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight mb-3">
                        {service.title}
                      </h2>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-xl font-light">
                        {service.description}
                      </p>
                    </div>

                    {/* Accordion List */}
                    {service.subservices && service.subservices.length > 0 && (
                      <div className="border-t border-purple-950/20 pt-4 space-y-1">
                        {service.subservices.map((sub) => {
                          const isExpanded = activeSubId === sub._id;
                          return (
                            <div
                              key={sub._id}
                              className="border-b border-purple-950/25 last:border-b-0 py-3 transition-colors duration-300"
                            >
                              <button
                                onClick={() => toggleSubService(service._id, sub._id)}
                                className="w-full flex items-center justify-between py-2 text-left group/btn cursor-pointer"
                              >
                                <span
                                  className={`text-sm md:text-base font-medium tracking-tight transition-colors duration-300 ${
                                    isExpanded
                                      ? "text-[#c455e3] font-semibold"
                                      : "text-gray-300 hover:text-white"
                                  }`}
                                >
                                  {sub.title}
                                </span>
                                <span className="flex-shrink-0 ml-4 text-gray-400 group-hover/btn:text-white transition-colors">
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-[#c455e3]" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </span>
                              </button>

                              <div
                                className={`overflow-hidden transition-all duration-300 ${
                                  isExpanded ? "max-h-[300px] opacity-100 mt-2 pb-2" : "max-h-0 opacity-0"
                                }`}
                              >
                                <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light pl-1">
                                  {sub.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#c455e3] hover:text-purple-400 transition-colors tracking-wider uppercase group/link"
                      >
                        Explore program details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                  {/* ── Image Column ── */}
                  <div className={`lg:col-span-7 relative ${isEven ? "lg:order-2" : "lg:order-1"} px-4 pb-6`}>
                    {/* Rotated gradient background sheet */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-tr from-purple-600 to-[#c455e3] rounded-[2rem] shadow-lg pointer-events-none transform transition-transform duration-500 ${
                        isEven
                          ? "translate-x-4 translate-y-4 rotate-[3deg] group-hover:rotate-[1deg] group-hover:translate-x-2 group-hover:translate-y-2"
                          : "-translate-x-4 translate-y-4 -rotate-[3deg] group-hover:rotate-[-1deg] group-hover:-translate-x-2 group-hover:translate-y-2"
                      }`}
                    />

                    {/* Borderless foreground image */}
                    <div className="relative w-full h-[280px] sm:h-[380px] rounded-[2rem] overflow-hidden bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.01]">
                      {/* Gradient overlay for bottom text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />

                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover object-center transition-transform duration-[1000ms] group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#12061f] flex items-center justify-center text-purple-900">
                          <Layers className="w-20 h-20" />
                        </div>
                      )}

                      {/* Stats text inside image — bottom left */}
                      <div className="absolute bottom-6 left-7 z-20">
                        <div className="text-3xl font-extrabold text-white leading-none font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                          {details.stat}
                        </div>
                        <div className="text-[10px] uppercase font-mono tracking-widest text-gray-300 mt-1 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {details.statLabel}
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

      {/* ── SECTION 3: ROADMAP ── */}
      <div className="max-w-[1200px] w-full px-6 relative z-20 mb-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-500/20 bg-purple-950/15 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <Workflow className="w-3.5 h-3.5 text-purple-400" />
            Project Lifecycle
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            How We Deliver Excellence
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
            We follow a robust, structured workflow model engineered to minimize risk, maximize velocity, and ensure quality code execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          <div className="absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-purple-950/40 via-purple-500/20 to-purple-950/40 hidden md:block z-0" />
          {roadmapSteps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center md:items-start group">
              <div className="w-14 h-14 rounded-2xl bg-[#0c0414] border border-purple-900/30 group-hover:border-purple-500/40 flex items-center justify-center text-lg font-bold text-[#c455e3] shadow-xl transition-all duration-300 mb-6 group-hover:shadow-[0_0_20px_rgba(196,85,227,0.25)]">
                {step.step}
              </div>
              <h3 className="text-white text-base font-bold mb-2 text-center md:text-left group-hover:text-purple-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed text-center md:text-left">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: CORE VALUES ── */}
      <div className="max-w-[1200px] w-full px-6 relative z-20 mb-28">
        <div className="bg-gradient-to-br from-[#0c0414]/90 to-[#12061f]/80 rounded-[40px] border border-purple-900/10 p-8 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">Core Foundations</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Designed to Exceed Client Standards
              </h2>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light">
                We design and engineer enterprise solutions with a strong commitment to scale, compliance, and modular maintainability.
              </p>
              <div className="pt-2">
                <Link href="/#contact" className="inline-flex items-center gap-2 text-xs font-bold text-white px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-500/20">
                  Schedule Workshop
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {coreValues.map((val, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#030107]/50 border border-purple-950/20">
                  <div className="flex-shrink-0">{val.icon}</div>
                  <div>
                    <h3 className="text-white text-base font-bold mb-1.5">{val.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{val.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: FAQ ── */}
      <div className="max-w-[800px] w-full px-6 relative z-20 mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-500/20 bg-purple-950/15 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            Support Center
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm font-light">Quick insights into our service models, project kickoffs, and SLA agreements.</p>
        </div>
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="rounded-2xl bg-[#0c0414]/90 border border-purple-950/30 hover:border-purple-900/30 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-white font-semibold text-sm sm:text-base leading-snug pr-4">{faq.q}</span>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-950/40 flex items-center justify-center text-purple-400">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[300px] border-t border-purple-950/10" : "max-h-0"}`}>
                  <p className="p-5 text-gray-400 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 6: CTA BANNER ── */}
      <div className="max-w-[1200px] w-full px-6 relative z-20">
        <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-r from-[#12061f] via-[#09030f] to-[#1d0a31] border border-purple-500/20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/10 via-transparent to-transparent pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Have a Specific Project Concept Ready?
          </h2>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-xl mx-auto mb-8 font-light">
            We collaborate with scale-ups and global enterprises to construct reliable, state-of-the-art applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/#contact" className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white px-7 py-3.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-500/25 w-full sm:w-auto">
              Let&apos;s Discuss Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/#contact" className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-gray-300 hover:text-white px-7 py-3.5 border border-purple-950/40 hover:border-purple-800/40 rounded-xl transition-all bg-purple-950/10 w-full sm:w-auto">
              <MousePointerClick className="w-3.5 h-3.5 text-purple-400" />
              Request Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
