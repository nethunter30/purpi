import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Activity,
  Zap,
  Laptop,
  TrendingUp,
  Check,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import dbConnect from "@/lib/db";
import CaseStudy from "@/models/CaseStudy";

export const revalidate = 60;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  await dbConnect();
  const studies = await CaseStudy.find({ isActive: true });
  return studies.map((study) => ({
    slug: study.id,
  }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const study = await CaseStudy.findOne({ id: slug });

  if (!study) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: study.title,
    description: study.description,
    alternates: {
      canonical: `/our-work/${study.id}`,
    },
    openGraph: {
      title: `${study.title} | enteropia Case Study`,
      description: study.description,
      url: `https://enteropia.com/our-work/${study.id}`,
      type: "website",
      images: [{ url: study.image, alt: study.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} | enteropia Case Study`,
      description: study.description,
      images: [study.image],
    },
  };
}

export default async function CaseStudyPage({ params }: RouteParams) {
  const { slug } = await params;
  await dbConnect();
  const studyDoc = await CaseStudy.findOne({ id: slug });

  if (!studyDoc) {
    notFound();
  }

  const study = studyDoc.toObject();

  // Inject Project JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": study.title,
    "headline": study.title,
    "description": study.description,
    "image": `https://enteropia.com${study.image}`,
    "author": {
      "@type": "Organization",
      "name": "enteropia",
      "url": "https://enteropia.com"
    },
    "provider": {
      "@type": "Organization",
      "name": "enteropia",
      "url": "https://enteropia.com"
    },
    "about": {
      "@type": "Thing",
      "name": study.category
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://enteropia.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Our Work",
        "item": "https://enteropia.com/our-work"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": study.title,
        "item": `https://enteropia.com/our-work/${study.id}`
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10 overflow-x-hidden flex flex-col items-center">
      {/* Script tag for search engine indexing */}
      <script
        type="application/ld+json"
        id="schema-case-study"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        id="schema-case-study-breadcrumb"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Visual Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a38_1px,transparent_1px),linear-gradient(to_bottom,#1f0a38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-[8%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-purple-600/10 via-fuchsia-600/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-pink-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full px-6 relative z-20 mt-16 flex-1 flex flex-col">
        {/* Navigation Link back */}
        <Link
          href="/our-work"
          className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-white transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back to work listings
        </Link>

        {/* Blueprint Details Box */}
        <div className="bg-[#0c0414]/90 border border-purple-500/20 rounded-sm p-6 md:p-10 shadow-2xl relative">
          {/* Top Border Highlight */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-100" />

          {/* Header Info */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 font-light">
              <span className="px-3 py-1 rounded-sm bg-purple-900/20 text-[#c455e3] border border-purple-800/30 font-semibold uppercase tracking-wider">
                {study.category}
              </span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-500/70" /> {study.client}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {study.title}
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
              {study.description}
            </p>
          </div>

          {/* Cover Banner */}
          <div className="relative w-full h-56 md:h-96 rounded-sm overflow-hidden bg-purple-950/10 shadow-lg border border-purple-900/10 mb-8">
            <Image
              src={study.image}
              alt={study.title}
              fill
              className="object-cover"
              priority
            />
            {/* Impact stats overlaid inside cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 z-20 space-y-1">
              <div className="text-2xl md:text-4xl font-black text-white font-mono leading-none drop-shadow-md">
                {study.impact}
              </div>
              <div className="text-[10px] md:text-xs uppercase font-mono tracking-widest text-purple-300 font-bold drop-shadow-sm">
                {study.impactLabel}
              </div>
            </div>
          </div>

          {/* Two-Column details: Challenge vs Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-purple-950/40 pt-8 mb-8">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="p-1 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400">
                  <Activity className="w-4.5 h-4.5" />
                </span>
                The Challenge
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light whitespace-pre-wrap">
                {study.challenge}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="p-1 rounded-sm bg-green-500/10 border border-green-500/20 text-green-400">
                  <Zap className="w-4.5 h-4.5" />
                </span>
                The Solution
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light whitespace-pre-wrap">
                {study.solution}
              </p>
            </div>
          </div>

          {/* Stack tags complete details */}
          <div className="border-t border-purple-950/40 pt-8 mb-8 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Laptop className="w-4.5 h-4.5 text-purple-400" />
              Technical Stack Integrations
            </h3>
            <div className="flex flex-wrap gap-2">
              {study.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 bg-purple-900/15 text-purple-300 rounded-sm border border-purple-800/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Production Results table comparison */}
          <div className="border-t border-purple-950/40 pt-8 mb-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-purple-400" />
              Production Metrics Comparison
            </h3>
            <div className="overflow-x-auto border border-purple-950/40 rounded-sm bg-[#030107]/70 shadow-lg">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-purple-950/40 bg-purple-950/10 text-white font-bold">
                    <th className="p-4">Key Metrics</th>
                    <th className="p-4 text-red-400">Before enteropia</th>
                    <th className="p-4 text-green-400">After Optimization</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  {study.results.map((row, idx) => (
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
          <div className="border-t border-purple-950/40 pt-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-purple-400" />
              Deployment Work Milestones
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
              {study.milestones.map((milestone, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 font-light bg-purple-950/10 border border-purple-950/30 p-3 rounded-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-purple-950 border border-purple-800/40 text-[9px] font-bold text-purple-400 flex items-center justify-center mt-0.5 shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
