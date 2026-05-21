"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Layers,
  Clock,
  ArrowRight,
  X,
  ChevronRight,
  Shield,
  Activity,
  CheckCircle2,
  Terminal,
  Database,
  ExternalLink,
  Laptop,
  Check,
  Zap,
  ArrowLeft
} from "lucide-react";

// Structure for a Case Study
interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  subCategory: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  impactLabel: string;
  image: string;
  techStack: string[];
  results: {
    metric: string;
    before: string;
    after: string;
  }[];
  milestones: string[];
}

export default function OurWorkPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);

  // High-fidelity mock case studies corresponding to enteropia core strengths
  const caseStudies: CaseStudy[] = useMemo(() => [
    {
      id: "pulsefit-global",
      title: "PulseFit Global Cross-Platform Ecosystem",
      client: "PulseFit Global Inc.",
      category: "Software Engineering",
      subCategory: "App Solutions",
      description: "Built a high-performance cross-platform health application with real-time Bluetooth sensor connections and local database encryption on iOS and Android.",
      challenge: "PulseFit's legacy app suffered from severe frame drops during sensor syncing, data disconnects on older iOS/Android devices, and high local database query latency which caused poor App Store reviews.",
      solution: "We re-architected the app core using a custom native bridges library. By establishing light, optimized background sync queues in C++ compiled to Swift/Kotlin and setting up encrypted SQLCipher storage, we streamlined Bluetooth polling intervals.",
      impact: "4.8 App Rating",
      impactLabel: "App Store Review Average",
      image: "/illustrations/app-solutions.png",
      techStack: ["React Native SDK", "Flutter Cross-Platform", "Swift Native", "Kotlin Core", "Firebase Backend", "Expo CLI"],
      results: [
        { metric: "App Frame Rate", before: "34 FPS (Laggy)", after: "60 FPS (Butter Smooth)" },
        { metric: "Sensor Sync Time", before: "18.2 Seconds", after: "1.4 Seconds" },
        { metric: "Local Query Latency", before: "450ms Average", after: "12ms Average" }
      ],
      milestones: [
        "Audit existing Bluetooth bridge drivers and profiling frames.",
        "Implement background C++ event-loop thread for low-level packet processing.",
        "Design modular SQLCipher local databases with composite indexes.",
        "Execute cross-device beta stress runs via TestFlight and Google Console."
      ]
    },
    {
      id: "apex-financial",
      title: "Apex Financial SOC2 Compliant Overlays",
      client: "Apex Financial Group",
      category: "Cloud & Security",
      subCategory: "Networking & Security",
      description: "Re-engineered network routes with zero-trust gateways, custom firewalls, and active intrusion prevention scripts safeguarding client monetary transactions.",
      challenge: "Apex needed to transition from traditional virtual private networks (VPNs) to SOC2 compliant microsegmentation models to secure critical financial endpoints without hurting global transaction speeds.",
      solution: "We deployed highly secure peer-to-peer WireGuard tunnels among transaction nodes. By wrapping ingress routers with Cloudflare WAF protections and locking down node permission profiles using AWS IAM strict constraints, security risks were minimized.",
      impact: "SOC2 Compliance",
      impactLabel: "Verified Ready & Audited",
      image: "/illustrations/networking-security.png",
      techStack: ["Cisco Networking", "Fortinet Firewalls", "WireGuard Encryption", "Cloudflare WAF Shield", "AWS IAM Security", "Linux System Hardening"],
      results: [
        { metric: "Zero-Trust Latency Overhead", before: "78ms VPN Tunneling", after: "< 1.5ms WireGuard Overlay" },
        { metric: "Unauthorized Access Attempts", before: "32 logged monthly", after: "0 successful attempts logged" },
        { metric: "Compliance Readiness Audit", before: "Failed (Insecure endpoints)", after: "100% Audit Passed" }
      ],
      milestones: [
        "Audit server network paths and run intrusion assessments.",
        "Design multi-peer tunnel topology with automated key rotations.",
        "Integrate Cloudflare WAF endpoint filters for layer 7 traffic protection.",
        "Pass independent SOC2 external audits with zero compliance deficiencies."
      ]
    },
    {
      id: "horizon-ecommerce",
      title: "Horizon Jamstack Catalog Modernization",
      client: "Horizon E-commerce Hub",
      category: "Software Engineering",
      subCategory: "Digital Solutions",
      description: "We completely redesigned Horizon's digital catalog, shifting to a Next.js static generation setup with integrated headless CMS, boosting overall site speed and search rankings globally.",
      challenge: "Horizon's server-rendered e-commerce website was slow during peak marketing campaigns, with average server response times exceeding 3 seconds, leading to a high 35% cart abandonment rate.",
      solution: "We converted the database monolith into a high-speed headless CMS model. Utilizing Next.js App Router, Partial Pre-rendering, and Edge caching on Vercel CDNs, content loading resolved in milliseconds.",
      impact: "+180% Conversions",
      impactLabel: "Cart Conversions Increase",
      image: "/illustrations/digital-media.png",
      techStack: ["Next.js", "Figma Design", "TailwindCSS", "SEO Audits", "WordPress Headless", "Vercel Analytics"],
      results: [
        { metric: "Time to First Byte (TTFB)", before: "1.4 Seconds average", after: "35ms Edge Node Cached" },
        { metric: "Bounce Rate", before: "35% (Abandoned)", after: "11% (Highly Engaged)" },
        { metric: "Lighthouse Performance Score", before: "42/100 (Unoptimized)", after: "98/100 (Optimized)" }
      ],
      milestones: [
        "Structure static layout modules utilizing Tailwind utility rules.",
        "Migrate product relational tables to content hooks in Headless API systems.",
        "Configure CDN caching policies with stale-while-revalidate headers.",
        "Establish web vitals testing pipelines to safeguard performance metrics."
      ]
    },
    {
      id: "vanguard-logistics",
      title: "Vanguard Real-time Fleet Optimization",
      client: "Vanguard Logistics Systems",
      category: "Software Engineering",
      subCategory: "Software Solutions",
      description: "Designed and implemented a custom warehouse routing engine that integrated legacy inventory schedules with live APIs, eliminating manual sheets entirely.",
      challenge: "Vanguard handled over 10,000 active dispatch routes manually via legacy Excel models. This led to fuel waste, inaccurate delivery times, and dispatcher fatigue during seasonal demand spikes.",
      solution: "We engineered a microservices routing engine. Written in high-throughput Go Lang and Node.js backend services, the algorithm evaluates road traffic, driver hours, and fuel efficiency in real-time.",
      impact: "90% Efficiency",
      impactLabel: "Operational Dispatch Speedup",
      image: "/illustrations/software-solutions.png",
      techStack: ["Node.js (API)", "Go Lang Microservices", "TypeScript Core", "PostgreSQL DBMS", "MongoDB Atlas", "Docker Scheduling"],
      results: [
        { metric: "Route Dispatch Processing Time", before: "4 Hours (Manual mapping)", after: "< 3 Seconds (Automated)" },
        { metric: "Fuel Fleet Overhead Costs", before: "$124K monthly average", after: "$89K monthly average" },
        { metric: "Dispatcher Operator Capacity", before: "15 routes per agent", after: "120 routes per agent" }
      ],
      milestones: [
        "Formulate Go Lang scheduling queues and microservices schemas.",
        "Integrate geospatial mapping and real-time traffic feed APIs.",
        "Construct responsive dispatch dashboards for field managers.",
        "Deploy Docker container configurations to production host stacks."
      ]
    },
    {
      id: "mednet-health",
      title: "MedNet Cloud Monolith Containerization",
      client: "MedNet Health Solutions",
      category: "Cloud & Security",
      subCategory: "Cloud Infrastructure",
      description: "Migrated a legacy monolith into serverless container systems managed on Kubernetes, reducing manual oversight and cloud hosting bills significantly.",
      challenge: "MedNet's medical applications ran on outdated, single-host virtual machines. Scale spikes crashed the database, and server billing was massive because resources could not scale down automatically.",
      solution: "We split the monolith codebase into isolated Docker microservices. We then orchestrated them using scalable Kubernetes containers and built automated infrastructure deployment scripts using Terraform.",
      impact: "-55% Cloud Costs",
      impactLabel: "Infrastructure Cost Savings",
      image: "/illustrations/networking-security.png",
      techStack: ["Amazon Web Services (AWS)", "Google Cloud (GCP)", "Kubernetes Containers", "Terraform IaC Plans", "GitHub Actions CI/CD", "Prometheus Monitoring"],
      results: [
        { metric: "Monthly Infrastructure Hosting Bills", before: "$14,500 average", after: "$6,500 average" },
        { metric: "System Scale Up Timing", before: "25 Minutes (Manual VM boot)", after: "12 Seconds (Kubernetes pod scaling)" },
        { metric: "Core Service Uptime Guarantee", before: "98.4% (Frequent downtime)", after: "99.99% High Availability" }
      ],
      milestones: [
        "Draft Terraform configuration scripts for multi-region AWS stacks.",
        "Isolate monolith segments into structured, clean Docker images.",
        "Configure Kubernetes pod scaling rules and health check checks.",
        "Set up GitHub Actions automatic workflows to deploy master edits cleanly."
      ]
    },
    {
      id: "intellect-analytics",
      title: "Intellect AI Stock Prediction Engine",
      client: "Intellect Analytics Ltd.",
      category: "AI & Automation",
      subCategory: "Machine Learning Solutions",
      description: "Constructed intelligent regression models and recommendation systems parsing large transaction datasets to suggest stock allocation automatically.",
      challenge: "Intellect wanted to automate high-volume retail warehouse allocations, but standard time-series projections yielded error rates above 15%, causing stock-outs and inventory bloat.",
      solution: "We built a customized prediction engine in Python and PyTorch. Incorporating dynamic variables like local weather models and regional search trends, the engine outputs exact procurement numbers daily.",
      impact: "99% Accuracy",
      impactLabel: "Stock Prediction Precision",
      image: "/illustrations/software-solutions.png",
      techStack: ["Python Systems", "PyTorch Framework", "TensorFlow AI", "OpenAI Engine Integration", "FastAPI Pipelines", "Hugging Face Models"],
      results: [
        { metric: "Inventory Prediction Error", before: "18.4% average error", after: "0.8% average error" },
        { metric: "Product Warehousing Duration", before: "42 Days average storage", after: "18 Days average storage" },
        { metric: "Stockout Scenarios Logged", before: "45 cases quarterly", after: "0 cases logged quarterly" }
      ],
      milestones: [
        "Clean, catalog, and normalize five years of historical transaction logs.",
        "Construct PyTorch multi-variable regression models.",
        "Build secure, fast FastAPI pipelines to serve inference calculations.",
        "Establish automated training pipelines based on incoming sales queues."
      ]
    }
  ], []);

  // Filter categories
  const categories = ["All", "Software Engineering", "Cloud & Security", "AI & Automation"];

  // Category filtering
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter(item => {
      return selectedCategory === "All" || item.category === selectedCategory;
    });
  }, [caseStudies, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10 overflow-x-hidden flex flex-col items-center">
      {/* Visual Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a38_1px,transparent_1px),linear-gradient(to_bottom,#1f0a38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-[8%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-purple-600/10 via-fuchsia-600/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] w-full px-6 relative z-20 mt-16 flex-1 flex flex-col">
        
        {/* ── SECTION 1: HERO HEADER ── */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 space-y-4">  
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#c455e3] tracking-tight leading-tight">
            Our Portfolio & Works
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-light">
            We collaborate with ambitious organizations to architect, scale, and optimize their business critical platforms. Explore our engineering milestones.
          </p>
        </div>

        {/* ── SECTION 2: STATS COUNTER BANNER ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-3xl bg-[#0c0414]/90 border border-purple-900/10 mb-20 shadow-2xl backdrop-blur-md">
          {[
            { value: "99.99%", label: "Uptime SLA", desc: "For all cloud deployments" },
            { value: "2.4x", label: "Process Speed", desc: "Average system speedup" },
            { value: "-55%", label: "Cost Reduction", desc: "In hosting & database waste" },
            { value: "12 Wks", label: "Guaranteed Launch", desc: "On standard enterprise builds" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center space-y-1 relative group">
              <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 font-mono">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-[10px] text-gray-500 font-light hidden sm:block">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* ── SECTION 3: INTERACTIVE FILTER ── */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap justify-center items-center gap-1.5 p-2 bg-[#0c0414]/90 border border-purple-950/40 rounded-2xl backdrop-blur-md shadow-2xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-purple-950/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: SHOWCASE CARDS GRID ── */}
        {filteredCaseStudies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-purple-900/10 bg-[#12061f]/10 rounded-[32px] p-8">
            <Layers className="w-12 h-12 mb-4 text-purple-500/35 animate-pulse" />
            <h3 className="text-white text-lg font-bold">No projects listed</h3>
            <p className="text-sm text-gray-400 max-w-sm font-light mt-1">No matches found for the selected category. Check back soon for new case studies!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {filteredCaseStudies.map((study) => (
              <div
                key={study.id}
                onClick={() => setActiveCaseStudy(study)}
                className="group relative flex flex-col bg-[#0c0414]/90 border border-purple-900/10 hover:border-purple-500/20 rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1 shadow-2xl hover:shadow-purple-950/40 cursor-pointer overflow-hidden"
              >
                {/* Top Border Highlight */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Cover Image */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-purple-950/15 mb-6 shadow-md border border-purple-950/10">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />

                  {/* Category overlay tags */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest bg-black/80 text-purple-300 px-3 py-1 rounded-full border border-purple-800/30">
                      {study.category}
                    </span>
                  </div>

                  {/* Impact Stats inside Image */}
                  <div className="absolute bottom-4 left-5 z-20 space-y-0.5">
                    <div className="text-xl font-black text-white font-mono leading-none drop-shadow-md">
                      {study.impact}
                    </div>
                    <div className="text-[9px] uppercase font-mono tracking-wider text-gray-300 font-bold drop-shadow-sm">
                      {study.impactLabel}
                    </div>
                  </div>
                </div>

                {/* Info Content */}
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-purple-400">
                      {study.client}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                      {study.description}
                    </p>
                  </div>

                  {/* Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {study.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] px-2.5 py-1 bg-purple-900/10 text-purple-300 rounded-lg border border-purple-800/15"
                      >
                        {tech}
                      </span>
                    ))}
                    {study.techStack.length > 4 && (
                      <span className="text-[9px] px-2.5 py-1 bg-[#12061f] text-gray-500 rounded-lg border border-purple-950/20">
                        +{study.techStack.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Action Link Row */}
                  <div className="border-t border-purple-950/40 pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {study.subCategory}
                    </span>
                    <span className="text-xs font-bold text-[#c455e3] group-hover:text-purple-400 transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                      Review blueprint
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ARCHITECTURAL CASE STUDY BLUEPRINT MODAL ── */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          {/* Main Modal Box */}
          <div className="bg-[#0c0414] border border-purple-500/20 max-w-4xl w-full max-h-[88vh] rounded-[32px] overflow-y-auto p-6 md:p-10 shadow-2xl relative scrollbar-thin scrollbar-track-[#12061f] scrollbar-thumb-purple-900/40">
            
            {/* Sticky Header Close Controls */}
            <div className="sticky top-0 right-0 flex justify-end mb-4 z-30">
              <button
                onClick={() => setActiveCaseStudy(null)}
                className="p-2.5 rounded-full border border-purple-500/20 bg-purple-950/80 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-900 transition-all cursor-pointer shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Back button link */}
            <button
              onClick={() => setActiveCaseStudy(null)}
              className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-white transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to work listings
            </button>

            {/* Modal Content */}
            <div className="space-y-8">
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded-full bg-purple-900/20 text-[#c455e3] border border-purple-800/30 font-semibold uppercase tracking-wider">
                    {activeCaseStudy.category}
                  </span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-400 font-medium">{activeCaseStudy.client}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  {activeCaseStudy.title}
                </h1>
              </div>

              {/* Cover Banner */}
              <div className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden bg-purple-950/10 shadow-lg border border-purple-900/10">
                <Image
                  src={activeCaseStudy.image}
                  alt={activeCaseStudy.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Two-Column details: Challenge vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-purple-950/40 pt-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      <Activity className="w-4 h-4" />
                    </span>
                    The Challenge
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light whitespace-pre-wrap">
                    {activeCaseStudy.challenge}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                      <Zap className="w-4 h-4" />
                    </span>
                    The Solution
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light whitespace-pre-wrap">
                    {activeCaseStudy.solution}
                  </p>
                </div>
              </div>

              {/* Stack tags complete details */}
              <div className="border-t border-purple-950/40 pt-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  Technical Stack Integrations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeCaseStudy.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 bg-purple-900/15 text-purple-300 rounded-lg border border-purple-800/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Production Results table comparison */}
              <div className="border-t border-purple-950/40 pt-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Production Metrics Comparison
                </h3>
                <div className="overflow-x-auto border border-purple-950/40 rounded-2xl bg-[#030107]/70 shadow-lg">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-purple-950/40 bg-purple-950/10 text-white font-bold">
                        <th className="p-4">Key Metrics</th>
                        <th className="p-4 text-red-400">Before enteropia</th>
                        <th className="p-4 text-green-400">After Optimization</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-400">
                      {activeCaseStudy.results.map((row, idx) => (
                        <tr key={idx} className="border-b border-purple-950/10 last:border-0 hover:bg-purple-950/5">
                          <td className="p-4 font-semibold text-white">{row.metric}</td>
                          <td className="p-4 font-light">{row.before}</td>
                          <td className="p-4 text-white font-semibold flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-green-400" /> {row.after}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Development Milestones completed */}
              <div className="border-t border-purple-950/40 pt-6 pb-4 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Deployment Work Milestones
                </h3>
                <ul className="space-y-3 pl-1">
                  {activeCaseStudy.milestones.map((milestone, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 font-light">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-950 border border-purple-800/40 text-[9px] font-bold text-purple-400 flex items-center justify-center mt-0.5 shadow-md">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
