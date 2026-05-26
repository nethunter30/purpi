import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Terminal,
  Code2,
  Layers,
  Database,
  Cloud,
  Cpu,
  Settings,
  Binary,
  Sparkles,
  Smartphone,
  Globe,
  Lock,
  Network,
  ShieldAlert,
  ShieldCheck,
  Palette,
  Compass,
  Search,
  ChevronLeft,
  ArrowRight,
  Package
} from "lucide-react";
import dbConnect from "@/lib/db";
import CategoryModel from "@/models/manage-services/categories";
import SubCategoryModel from "@/models/manage-services/subcat";
import ProductModel from "@/models/manage-services/products";

interface RouteParams {
  params: Promise<{ services: string; subservices: string }>;
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

const getIconComponent = (slug: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    "custom-web-apps": Terminal,
    "api-integrations": Code2,
    "system-migration": Layers,
    "ecommerce-architectures": Database,
    "multi-cloud-deployment": Cloud,
    "kubernetes-orchestration": Cpu,
    "infrastructure-as-code": Settings,
    "cloud-migration": Layers,
    "nlp-systems": Binary,
    "predictive-modeling": Database,
    "llm-integration": Sparkles,
    "computer-vision": Cpu,
    "native-mobile-apps": Smartphone,
    "cross-platform-apps": Smartphone,
    "progressive-web-apps": Globe,
    "app-store-optimization": Settings,
    "zero-trust-architecture": Lock,
    "vpn-networks": Network,
    "threat-detection": ShieldAlert,
    "firewall-management": ShieldCheck,
    "ux-ui-design": Palette,
    "corporate-branding": Compass,
    "creative-content": Globe,
    "seo-auditing": Search
  };
  return iconMap[slug] || Package;
};

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { subservices } = await params;
  try {
    await dbConnect();
    const category = await CategoryModel.findOne({ slug: subservices });
    if (!category) {
      return { title: "Service Category Not Found" };
    }
    const description = category.description || getCategoryDescription(category.slug);
    return {
      title: category.name,
      description,
      alternates: {
        canonical: `https://enteropia.com/services/${subservices}`,
      },
      openGraph: {
        title: `${category.name} | enteropia`,
        description,
        url: `https://enteropia.com/services/${subservices}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${category.name} | enteropia`,
        description,
      },
    };
  } catch (err) {
    return { title: "Services" };
  }
}

export default async function SubServicesPage({ params }: RouteParams) {
  const { services, subservices } = await params;

  if (services !== "services") {
    notFound();
  }

  let category: any = null;
  let subcats: any[] = [];
  let products: any[] = [];

  try {
    await dbConnect();
    category = await CategoryModel.findOne({ slug: subservices });
    if (category) {
      [subcats, products] = await Promise.all([
        SubCategoryModel.find({ categorySlug: subservices }).sort({ name: 1 }),
        ProductModel.find({ categorySlug: subservices }).sort({ createdAt: -1 }),
      ]);
    }
  } catch (err) {
    console.error("Error loading category data:", err);
  }

  if (!category) {
    return (
      <div className="w-full bg-black min-h-screen pt-32 pb-24 px-6 sm:px-12 md:px-20 lg:px-32 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none z-0" />
        <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
          <Sparkles className="w-16 h-16 text-purple-500/50 mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Coming Soon
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            This service category is being updated. Please check back shortly.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const hasSubcats = subcats.length > 0;

  return (
    <div className="w-full bg-black min-h-screen pt-32 pb-24 px-6 sm:px-12 md:px-20 lg:px-32 relative overflow-hidden flex flex-col">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-fuchsia-900/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto relative z-10 flex-1 flex flex-col">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </Link>

        {/* Hero Info */}
        <div className="flex flex-col items-start text-left mb-16">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-5">
            Service Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
            {category.name}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            {category.description || getCategoryDescription(category.slug)}
          </p>
        </div>

        {/* Content */}
        {!hasSubcats ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-lg mx-auto z-10 border border-purple-950/30 rounded-sm bg-[#0c0414]/80">
            <Sparkles className="w-12 h-12 text-purple-500/50 mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              We are finalizing premium offerings for this category. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {subcats.map((sub: any) => {
              const Icon = getIconComponent(sub.slug);
              // Find matching product to get the description if available
              const prod = products.find((p) => p.subcategorySlug === sub.slug);
              const href = `/services/${subservices}/${sub.slug}`;
              const description = sub.description || (prod ? prod.description : "Premium engineering services and tech specs are being finalized.");

              return (
                <Link
                  key={sub.slug}
                  href={href}
                  className="relative flex flex-col justify-between p-7 rounded-sm bg-[#0c0414]/80 border border-purple-950/40 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(168,85,247,0.08)] overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-900/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-800/10 transition-colors" />

                  <div>
                    <div className="w-11 h-11 rounded-sm bg-purple-950/20 border border-purple-800/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-800/30 group-hover:text-purple-300 transition-all mb-5">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h2 className="text-white text-base font-bold mb-3 group-hover:text-[#c455e3] transition-colors">
                      {sub.name}
                    </h2>

                    {sub.bulletList?.heading && (
                      <p className="text-purple-400/80 text-xs font-semibold uppercase tracking-wider mb-2">
                        {sub.bulletList.heading}
                      </p>
                    )}

                    {sub.bulletList?.points && sub.bulletList.points.length > 0 ? (
                      <ul className="space-y-1.5 mb-6">
                        {sub.bulletList.points.slice(0, 4).map((pt: string, idx: number) => (
                          <li key={idx} className="text-gray-400 text-xs font-light flex items-start gap-1.5 leading-relaxed">
                            <span className="text-purple-500 text-[10px] mt-0.5">•</span>
                            <span className="line-clamp-2">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light line-clamp-4">
                        {description}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-purple-400 group-hover:text-purple-300 transition-colors pt-4 border-t border-purple-950/15">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
