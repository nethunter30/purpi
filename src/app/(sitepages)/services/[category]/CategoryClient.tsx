"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Tag, Shield, Server, Code, Cpu, Cloud, Network, Layout, Briefcase } from "lucide-react";

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
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategory: string;
}

interface CategoryClientProps {
  category: Category;
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

export default function CategoryClient({ category, subcategories, products }: CategoryClientProps) {
  const IconComponent = getCategoryIcon(category.slug);
  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(null);

  const faqs = categoryFaqs[category.slug] || [
    {
      question: "How do I choose the right technology solution for my business?",
      answer: "Our systems architects evaluate your scale, current tech stack, operational needs, and budget to design a tailored roadmap that fits your business objectives."
    },
    {
      question: "Do you offer custom pricing and subscription models?",
      answer: "Yes, we provide flexible engagement packages, including fixed-cost project contracts, dedicated developer retainers, and SLA-based ongoing support models."
    },
    {
      question: "How do we get started with enteropia?",
      answer: "Simply use the contact form or hotline to book a consultation. Our team will schedule an architecture scoping session to outline your custom blueprint."
    }
  ];

  // Group products by subcategory ID
  const productsBySub = subcategories.reduce<Record<string, Product[]>>((acc, sub) => {
    acc[sub.id] = products.filter((p) => p.subcategory === sub.id);
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Hero Section */}
      <section className="relative w-full bg-purple-950/20 backdrop-blur-md pt-32 pb-20 overflow-hidden select-none">
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
              <span className="text-white">{category.name.toUpperCase()}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 flex-shrink-0">
                <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              {category.name}
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
              {category.description}
            </p>
          </div>

          <div className="relative pr-6 pb-6 w-full lg:w-96 h-48 lg:h-56 flex-shrink-0">
            {/* Background offset block: same size as main image container, shifted down-right */}
            <div className="absolute top-5 left-5 right-6 bottom-0 bg-[#8b5cf6] rounded-sm z-0" />

            {/* Main Image Container */}
            <div className="relative w-full h-full right-6 rounded-sm overflow-hidden border border-purple-500/20 shadow-2xl bg-[#0f0418] transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1 z-10">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full opacity-65 hover:opacity-85 transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-950/10">
                  <IconComponent className="w-16 h-16 text-purple-500/25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0418] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories List Section */}
      <section className="relative w-full bg-black py-20 min-h-[300px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500 mb-2">
              SUBCATEGORIES
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Explore Specialized Verticals
            </h2>
          </div>

          {subcategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-center space-y-4">
              <Tag className="w-12 h-12 opacity-20 text-purple-400" />
              <p className="text-sm font-light">No subcategories are currently configured for this category.</p>
              <Link href="/services" className="text-xs text-purple-400 hover:text-purple-300 font-bold underline">
                Back to all services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {subcategories.map((sub) => {
                const subProds = productsBySub[sub.id] || [];

                return (
                  <div
                    key={sub.id}
                    className="group relative flex flex-col bg-[#0f0418]/45 backdrop-blur-md p-7 border border-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.06)] hover:-translate-y-1 max-w-xl w-full mx-auto"
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      <Link href={`/services/${category.slug}/${sub.slug}`}>
                        {sub.name}
                      </Link>
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light line-clamp-2">
                      {sub.description}
                    </p>

                    {/* Subcategory Cover Image if exists */}
                    {sub.image && (
                      <div className="w-full h-28 rounded overflow-hidden border border-white/5 mb-6 relative">
                        <img src={sub.image} alt={sub.name} className="object-cover w-full h-full opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0418] to-transparent pointer-events-none" />
                      </div>
                    )}

                    {/* Product Listing */}
                    <div className="space-y-3 flex-1 mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
                        Offerings
                      </h4>
                      {subProds.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No individual offerings listed yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {subProds.map((prod) => (
                            <Link
                              key={prod.id}
                              href={`/services/${category.slug}/${sub.slug}/${prod.slug}`}
                              className="flex items-center justify-between p-2.5 rounded bg-black/45 border border-white/5 hover:border-purple-500/20 hover:bg-purple-950/10 text-xs font-medium text-slate-300 hover:text-white transition-all group/prod"
                            >
                              <span className="truncate">{prod.name}</span>
                              <ChevronRight className="w-3 h-3 text-gray-600 group-hover/prod:text-purple-400 group-hover/prod:translate-x-0.5 transition-all flex-shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-auto">
                      <Link
                        href={`/services/${category.slug}/${sub.slug}`}
                        className="inline-flex items-center gap-1 text-[13px] font-bold text-purple-400 hover:text-purple-300 transition-colors group/view"
                      >
                        Explore Subcategory
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/view:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ──────────────────────────────────────── */}
      <section className="relative w-full py-16 md:py-24 border-t border-purple-950/20 bg-[#06020c]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#c455e3] mb-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-950/20">
              FAQ
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mt-4 font-light">
              Common questions regarding our {category.name} solutions and lifecycle delivery.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="group border border-purple-950/40 bg-[#0d0517]/45 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/20"
                  onMouseEnter={() => setOpenFaqIdx(idx)}
                  onMouseLeave={() => setOpenFaqIdx(null)}
                >
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-white hover:text-purple-300 transition-colors text-sm md:text-base cursor-pointer"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-purple-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? "rotate-90 text-white" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-60 border-t border-purple-950/20 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-5 text-slate-400 text-xs md:text-sm leading-relaxed font-light bg-[#08020e]/60">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

const categoryFaqs: Record<string, { question: string; answer: string }[]> = {
  "software-development": [
    {
      question: "What software development methodologies do you use?",
      answer: "We primarily employ Agile and DevOps methodologies, enabling rapid iterations, continuous integration, and transparent client collaboration throughout the lifecycle."
    },
    {
      question: "Do you build cross-platform mobile apps?",
      answer: "Yes, we build performant cross-platform mobile applications using React Native and Flutter, as well as native iOS (Swift) and Android (Kotlin) apps tailored to business needs."
    },
    {
      question: "Can you integrate third-party APIs and legacy systems?",
      answer: "Absolutely. We have extensive experience building custom middleware and integrating complex third-party SaaS APIs, payment gateways, and legacy enterprise databases."
    }
  ],
  "it-services": [
    {
      question: "Do you provide 24/7 system monitoring and support?",
      answer: "Yes, we offer SLA-backed 24/7 proactive monitoring, real-time alerting, and remote support services to identify and resolve server and network bottlenecks before they affect business operations."
    },
    {
      question: "What cloud platforms do you support?",
      answer: "We support all major cloud provider platforms, including Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure, focusing on security and cost optimization."
    },
    {
      question: "How do you handle disaster recovery and backup?",
      answer: "We design robust backup strategies with multi-region automated replication, point-in-time recovery, and documented disaster recovery protocols to ensure business continuity."
    }
  ],
  "caas": [
    {
      question: "What is Container as a Service (CaaS) and how does it benefit my business?",
      answer: "CaaS is a cloud service model that allows businesses to upload, organize, run, scale, and manage containers. It streamlines DevOps pipelines, improves resource utilization, and ensures application portability across different environments."
    },
    {
      question: "Do you support Kubernetes cluster orchestration?",
      answer: "Yes, we specialize in building and managing secure, production-ready Kubernetes clusters on AWS (EKS), GCP (GKE), Azure (AKS), as well as custom self-hosted Kubernetes setups."
    },
    {
      question: "How do you secure containerized applications?",
      answer: "We implement container security best practices, including image scanning for vulnerabilities, restricted IAM roles, network policies, namespace isolation, and secrets management."
    }
  ]
};
