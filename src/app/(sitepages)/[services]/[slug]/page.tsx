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
} from "lucide-react";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import SubService from "@/models/SubService";

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

      // Fetch sub-services for this service
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

  // Fallback to static matching slug if database search is empty
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

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/8 rounded-full blur-[120px] pointer-events-none" />

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Solution
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {serviceData.title}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed font-light">
                {serviceData.description}
              </p>
            </div>

            <div className="border-t border-purple-900/20 pt-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Deep Dive Details
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {serviceData.details}
              </p>
            </div>

            {/* Premium Perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 bg-[#12061f]/50 border border-purple-950/20 rounded-2xl">
                <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Secure by Design
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Strict compliance and data safety protocols.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#12061f]/50 border border-purple-950/20 rounded-2xl">
                <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Maximum Performance
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Optimized for speed and ultra-low latency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Image & Sidebar CTA */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="relative w-full h-72 rounded-3xl overflow-hidden border border-purple-900/20 shadow-2xl bg-purple-950/20">
              <Image
                src={serviceData.image}
                alt={serviceData.title}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Quick Contact Form CTA */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#12061f] to-[#1d0a31] border border-purple-900/20 shadow-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Interested in {serviceData.title}?
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Let us build a customized enterprise solution structured
                  specifically for your operations.
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
                  Scalable support & maintenance
                </li>
              </ul>

              <Link
                href="/#contact"
                className="w-full py-3 flex items-center justify-center rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-xs font-bold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                Schedule A Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* ── Sub-services Section ── */}
        {subservices.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 rounded-xl bg-purple-600/15 border border-purple-600/20">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  What We Offer
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Specific offerings under {serviceData.title}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subservices.map((sub, idx) => (
                <div
                  key={sub._id}
                  className="group relative flex flex-col rounded-2xl bg-[#12061f]/70 border border-purple-900/20 hover:border-purple-500/30 p-7 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-purple-900/20 overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Index badge */}
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-500 mb-3 block">
                    Offering {String(idx + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">
                    {sub.description}
                  </p>

                  {/* What We Offer chips */}
                  {sub.whatWeOffer.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Includes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.whatWeOffer.map((item, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-purple-900/20 text-purple-300 rounded-lg border border-purple-800/30"
                          >
                            <ChevronRight className="w-2.5 h-2.5" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  {sub.benefits.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Key Benefits
                      </p>
                      <ul className="space-y-1.5">
                        {sub.benefits.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-gray-300"
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
      </div>
    </div>
  );
}
