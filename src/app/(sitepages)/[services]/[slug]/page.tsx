import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  Zap,
  Sparkles,
  Layers,
  ChevronRight,
  Calendar,
  Globe2,
  Terminal,
  TrendingUp,
  FileCheck,
  Check,
  X
} from "lucide-react";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import SubService from "@/models/SubService";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ services: string; slug: string }>;
}

interface ISubService {
  _id: string;
  title: string;
  description: string;
  whatWeOffer: string[];
  benefits: string[];
  order: number;
}

const fallbackFeatures = [
  {
    title: "Digital Solutions & Media",
    description:
      "Crafting impactful websites with design, content, and marketing.",
    image: "/illustrations/digital-media.png",
    slug: "digital-solutions-media",
    details:
      "Our Digital Solutions & Media program offers comprehensive creation services. We combine beautiful UX design with compelling copywriting, SEO optimization, and forward-looking brand strategy to design web experiences that captivate visitors and transform them into loyal clients.",
  },
  {
    title: "Software Solutions",
    description: "Building custom software to streamline business operations.",
    image: "/illustrations/software-solutions.png",
    slug: "software-solutions",
    details:
      "Tailored to fit your unique operational workflows, our custom software applications eliminate manual overhead, integrate fragmented data flows, and scale cleanly alongside your company's growth path.",
  },
  {
    title: "App solutions",
    description: "Creating intuitive mobile apps for iOS and Android.",
    image: "/illustrations/app-solutions.png",
    slug: "app-solutions",
    details:
      "We build intuitive, high-performance mobile applications on iOS and Android platforms. Leveraging modern cross-platform frameworks, we deliver native-speed, premium-feeling apps with zero friction.",
  },
  {
    title: "Networking And Secure Solutions",
    description:
      "Providing robust IT networks and cybersecurity to protect your business.",
    image: "/illustrations/networking-security.png",
    slug: "networking-and-secure-solutions",
    details:
      "Protect your critical corporate assets with advanced enterprise security frameworks, intrusion prevention networks, structured fiber cabling, and continuous vulnerability assessment protocols.",
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Scalable and secure cloud hosting solutions to power your applications globally.",
    image: "/illustrations/cloud-infrastructure.png",
    slug: "cloud-infrastructure",
    details:
      "Migrate seamlessly to high-availability, auto-scaling cloud clusters. We specialize in serverless deployments, hybrid configurations, automated container scheduling, and performance tuning.",
  },
  {
    title: "AI & Machine Learning",
    description:
      "Integrate intelligent algorithms and automation to drive data-driven decision making.",
    image: "/illustrations/ai-machine-learning.png",
    slug: "ai-machine-learning",
    details:
      "Automate complex business intelligence flows and optimize processes with smart recommendation engines, predictive regression algorithms, neural vision, and customized pipeline automations.",
  },
];

const getTechStack = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("digital")) {
    return [
      { name: "Next.js", color: "bg-white/10 text-white" },
      { name: "Figma Design", color: "bg-orange-500/10 text-orange-400" },
      { name: "TailwindCSS", color: "bg-cyan-500/10 text-cyan-400" },
      { name: "SEO Audits", color: "bg-green-500/10 text-green-400" },
      { name: "WordPress", color: "bg-blue-500/10 text-blue-400" },
      { name: "Vercel Analytics", color: "bg-zinc-800/10 text-zinc-300" }
    ];
  }
  if (s.includes("software")) {
    return [
      { name: "Node.js (API)", color: "bg-green-500/10 text-green-400" },
      { name: "Go Lang Microservices", color: "bg-cyan-500/10 text-cyan-400" },
      { name: "TypeScript Core", color: "bg-blue-500/10 text-blue-400" },
      { name: "PostgreSQL DBMS", color: "bg-indigo-500/10 text-indigo-400" },
      { name: "MongoDB Atlas", color: "bg-emerald-500/10 text-emerald-400" },
      { name: "Docker Scheduling", color: "bg-sky-500/10 text-sky-400" }
    ];
  }
  if (s.includes("app")) {
    return [
      { name: "React Native SDK", color: "bg-cyan-500/10 text-cyan-400" },
      { name: "Flutter Cross-Platform", color: "bg-blue-500/10 text-blue-400" },
      { name: "Swift Native", color: "bg-orange-500/10 text-orange-400" },
      { name: "Kotlin Core", color: "bg-purple-500/10 text-purple-400" },
      { name: "Firebase Backend", color: "bg-yellow-500/10 text-yellow-400" },
      { name: "Expo CLI", color: "bg-zinc-800/10 text-zinc-300" }
    ];
  }
  if (s.includes("networking") || s.includes("secure")) {
    return [
      { name: "Cisco Networking", color: "bg-blue-500/10 text-blue-400" },
      { name: "Fortinet Firewalls", color: "bg-red-500/10 text-red-400" },
      { name: "WireGuard Encryption", color: "bg-green-500/10 text-green-400" },
      { name: "Cloudflare WAF Shield", color: "bg-orange-500/10 text-orange-400" },
      { name: "AWS IAM Security", color: "bg-yellow-500/10 text-yellow-400" },
      { name: "Linux System Hardening", color: "bg-zinc-800/10 text-zinc-300" }
    ];
  }
  if (s.includes("cloud")) {
    return [
      { name: "Amazon Web Services (AWS)", color: "bg-yellow-500/10 text-yellow-400" },
      { name: "Google Cloud (GCP)", color: "bg-blue-500/10 text-blue-400" },
      { name: "Kubernetes Containers", color: "bg-indigo-500/10 text-indigo-400" },
      { name: "Terraform IaC Plans", color: "bg-purple-500/10 text-purple-400" },
      { name: "GitHub Actions CI/CD", color: "bg-zinc-800/10 text-zinc-300" },
      { name: "Prometheus Monitoring", color: "bg-red-500/10 text-red-400" }
    ];
  }
  if (s.includes("ai") || s.includes("machine")) {
    return [
      { name: "Python Systems", color: "bg-blue-500/10 text-blue-400" },
      { name: "PyTorch Framework", color: "bg-orange-500/10 text-orange-400" },
      { name: "TensorFlow AI", color: "bg-yellow-500/10 text-yellow-400" },
      { name: "OpenAI Engine Integration", color: "bg-green-500/10 text-green-400" },
      { name: "FastAPI Pipelines", color: "bg-emerald-500/10 text-emerald-400" },
      { name: "Hugging Face Models", color: "bg-zinc-800/10 text-zinc-300" }
    ];
  }
  return [
    { name: "TypeScript", color: "bg-blue-500/10 text-blue-400" },
    { name: "Next.js Framework", color: "bg-white/10 text-white" },
    { name: "Docker Engine", color: "bg-sky-500/10 text-sky-400" },
    { name: "TailwindCSS", color: "bg-cyan-500/10 text-cyan-400" }
  ];
};

const getTimelineSteps = (title: string) => {
  return [
    {
      period: "Week 01 - 02",
      title: "Discovery & Auditing",
      desc: `Detailed engineering sessions to audit your target goals for ${title}. We document custom API scopes, database scale parameters, and compliance thresholds.`
    },
    {
      period: "Week 03 - 05",
      title: "Interactive Prototyping",
      desc: "Delivering user experience (UX) blueprints, database schemas, and a functional technical proof-of-concept for client testing."
    },
    {
      period: "Week 06 - 09",
      title: "Core System Construction",
      desc: `Rapid development phase building the core backend systems, responsive layouts, and cloud configurations for ${title} using strict Clean Architecture.`
    },
    {
      period: "Week 10 - 11",
      title: "Auditing & Stress Testing",
      desc: "Executing complete unit and integration tests, load testing for high traffic scenarios, and running security scanners."
    },
    {
      period: "Week 12",
      title: "Zero-Downtime Deployment",
      desc: "Deploying the optimized app into auto-scaling high-availability cloud configurations with continuous monitoring triggers."
    }
  ];
};

const getCaseStudy = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("digital")) {
    return {
      client: "Horizon E-commerce Hub",
      metric: "+180% Conversions",
      highlight: "-35% Bounce Rate",
      text: "We completely redesigned Horizon's digital catalog, shifting to a Next.js static generation setup with integrated headless CMS, boosting overall site speed and search rankings globally."
    };
  }
  if (s.includes("software")) {
    return {
      client: "Vanguard Logistics Systems",
      metric: "90% Operations Efficiency",
      highlight: "Save 30+ Tech Hours/Week",
      text: "Designed and implemented a custom warehouse routing engine that integrated legacy inventory schedules with live APIs, eliminating manual sheets entirely."
    };
  }
  if (s.includes("app")) {
    return {
      client: "PulseFit Global",
      metric: "4.8 App Store Rating",
      highlight: "1M+ App Downloads",
      text: "Built a high-performance cross-platform health application with real-time Bluetooth sensor connections and local database encryption on iOS and Android."
    };
  }
  if (s.includes("networking") || s.includes("secure")) {
    return {
      client: "Apex Financial Group",
      metric: "SOC2 Compliance Ready",
      highlight: "0 Security Incidents",
      text: "Re-engineered network routes with zero-trust gateways, custom firewalls, and active intrusion prevention scripts safeguarding client monetary transactions."
    };
  }
  if (s.includes("cloud")) {
    return {
      client: "MedNet Health Solutions",
      metric: "-55% Cloud Costs",
      highlight: "99.99% Core Service Uptime",
      text: "Migrated a legacy monolith into serverless container systems managed on Kubernetes, reducing manual oversight and cloud hosting bills significantly."
    };
  }
  return {
    client: "Intellect Analytics",
    metric: "10x Fast Data Queries",
    highlight: "99% Predict Accuracy",
    text: "Constructed intelligent regression models and recommendation systems parsing large transaction datasets to suggest stock allocation automatically."
  };
};

export default async function ServiceDetailPage({ params }: RouteParams) {
  const { services, slug } = await params;

  let serviceData: {
    _id?: string;
    title: string;
    description: string;
    details: string;
    image: string;
  } | null = null;

  let subservices: ISubService[] = [];

  try {
    await dbConnect();
    const service = await Service.findOne({ slug });
    if (service) {
      serviceData = {
        _id: service._id.toString(),
        title: service.title,
        description: service.description,
        details: service.details || service.description,
        image: service.image,
      };

      const rawSubs = await SubService.find({ serviceId: service._id })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      subservices = rawSubs.map((s: any) => ({
        _id: s._id.toString(),
        title: s.title,
        description: s.description,
        whatWeOffer: s.whatWeOffer || [],
        benefits: s.benefits || [],
        order: s.order,
      }));
    }
  } catch (error) {
    console.error("Database connection failed while fetching service", error);
  }

  // Fallback if DB returns empty
  if (!serviceData) {
    const matchedFallback = fallbackFeatures.find((f) => f.slug === slug);
    if (matchedFallback) {
      serviceData = {
        title: matchedFallback.title,
        description: matchedFallback.description,
        details: matchedFallback.details,
        image: matchedFallback.image,
      };
    }
  }

  if (!serviceData) {
    notFound();
  }

  const techStack = getTechStack(slug);
  const timelineSteps = getTimelineSteps(serviceData.title);
  const caseStudy = getCaseStudy(slug);

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10 overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-20">
        {/* Back Link */}
        <Link
          href={`/${services}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#c455e3] transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to all {services}
        </Link>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Premium Solution
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {serviceData.title}
              </h1>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
                {serviceData.description}
              </p>
            </div>

            <div className="border-t border-purple-900/20 pt-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Deep Dive Details
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-light">
                {serviceData.details}
              </p>
            </div>

            {/* Dynamic Tech Stack Badges */}
            <div className="border-t border-purple-900/20 pt-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Technology Stack Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1.5 rounded-xl border border-purple-500/10 font-semibold ${tech.color}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 bg-[#0c0414]/90 border border-purple-950/20 rounded-2xl">
                <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Secure by Design
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Strict compliance, security scanners, and robust data isolation protocols.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#0c0414]/90 border border-purple-950/20 rounded-2xl">
                <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Maximum Performance
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Optimized for sub-second speeds, efficient code bundles, and low latencies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Image & Sidebar CTA */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="relative w-full h-72 rounded-3xl overflow-hidden border border-purple-900/20 shadow-2xl bg-purple-950/20">
              {serviceData.image ? (
                <Image
                  src={serviceData.image}
                  alt={serviceData.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-[#12061f] flex items-center justify-center text-purple-900">
                  <Layers className="w-20 h-20" />
                </div>
              )}
            </div>

            {/* Sidebar CTA Box */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c0414] to-[#160727] border border-purple-900/25 shadow-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Interested in {serviceData.title}?
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed font-light">
                  Let us build a customized enterprise solution structured specifically for your operations.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  Expert 24/7 dedicated developers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  Full staging environment preview
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  Scalable SLA support & maintenance
                </li>
              </ul>

              <Link
                href="/#contact"
                className="w-full py-3 flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                Schedule A Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: SUB-SERVICES (WHAT WE OFFER) ── */}
        {subservices.length > 0 && (
          <div className="border-t border-purple-950/40 pt-16 mb-24">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  What We Offer
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Specific offerings under {serviceData.title}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subservices.map((sub, idx) => (
                <div
                  key={sub._id}
                  className="group relative flex flex-col rounded-2xl bg-[#0c0414]/90 border border-purple-900/10 hover:border-purple-500/20 p-7 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-purple-950/50 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#c455e3] mb-3 block">
                    Offering {String(idx + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1 font-light">
                    {sub.description}
                  </p>

                  {/* What We Offer tags */}
                  {sub.whatWeOffer.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Includes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.whatWeOffer.map((item, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1 bg-purple-900/15 text-purple-300 rounded-lg border border-purple-800/20"
                          >
                            <ChevronRight className="w-2.5 h-2.5 text-purple-400" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits checklist */}
                  {sub.benefits.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Key Benefits
                      </p>
                      <ul className="space-y-1.5">
                        {sub.benefits.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-gray-300 font-light"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 3: CASE STUDY HIGHLIGHT ── */}
        <div className="border-t border-purple-950/40 pt-16 mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Case Study Highlight
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Measurable business growth milestones delivered
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-r from-[#0c0414]/90 to-[#12061f]/50 p-8 rounded-3xl border border-purple-900/10">
            <div className="md:col-span-4 space-y-3">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#c455e3]">
                Client Case
              </span>
              <h3 className="text-xl font-bold text-white leading-tight">
                {caseStudy.client}
              </h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-purple-400">{caseStudy.metric}</p>
                <p className="text-xs text-gray-400 font-light">{caseStudy.highlight}</p>
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                "{caseStudy.text}"
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: DELIVERY TIMELINE ── */}
        <div className="border-t border-purple-950/40 pt-16 mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Development Timeline
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                What to expect during our 12-week development cycle
              </p>
            </div>
          </div>

          <div className="relative border-l border-purple-950/60 ml-4 pl-8 space-y-10">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-black border-2 border-purple-500 flex items-center justify-center text-[10px] font-bold text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-md">
                  {idx + 1}
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-bold block mb-1">
                  {step.period}
                </span>
                <h3 className="text-white text-base font-bold mb-1.5 group-hover:text-purple-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-3xl font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 5: CAPABILITY COMPARISON TABLE ── */}
        <div className="border-t border-purple-950/40 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <FileCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Engagement Plan Comparison
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose the coverage tier aligned with your engineering workload
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-purple-950/30 rounded-2xl bg-[#0c0414]/80 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-purple-950/40 bg-purple-950/10 text-white font-bold">
                  <th className="p-4 sm:p-5">Deliverables</th>
                  <th className="p-4 sm:p-5">Standard Tier</th>
                  <th className="p-4 sm:p-5 text-[#c455e3]">Enterprise Plus</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-purple-950/20">
                  <td className="p-4 sm:p-5 font-semibold text-white">System Delivery Speed</td>
                  <td className="p-4 sm:p-5">6 - 8 Weeks</td>
                  <td className="p-4 sm:p-5 text-white font-semibold">Priority (4 - 6 Weeks)</td>
                </tr>
                <tr className="border-b border-purple-950/20">
                  <td className="p-4 sm:p-5 font-semibold text-white">SLA Uptime Guarantee</td>
                  <td className="p-4 sm:p-5">99.5% Standard</td>
                  <td className="p-4 sm:p-5 text-white font-semibold">99.99% High Availability</td>
                </tr>
                <tr className="border-b border-purple-950/20">
                  <td className="p-4 sm:p-5 font-semibold text-white">Dedicated Tech Lead</td>
                  <td className="p-4 sm:p-5"><X className="w-4 h-4 text-red-500/60" /></td>
                  <td className="p-4 sm:p-5 text-purple-400"><Check className="w-4 h-4 text-green-400" /></td>
                </tr>
                <tr className="border-b border-purple-950/20">
                  <td className="p-4 sm:p-5 font-semibold text-white">Staging Previews</td>
                  <td className="p-4 sm:p-5">Bi-weekly Builds</td>
                  <td className="p-4 sm:p-5 text-white font-semibold">On-demand Pipeline</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Scale Consultations</td>
                  <td className="p-4 sm:p-5">Email & Slack</td>
                  <td className="p-4 sm:p-5 text-white font-semibold">24/7 Dedicated Call Line</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
