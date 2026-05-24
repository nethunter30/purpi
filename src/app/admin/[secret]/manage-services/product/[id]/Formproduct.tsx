"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Loader2,
  PlusCircle,
  MinusCircle,
  FileText,
  Image as ImageIcon,
  Layers,
  DollarSign,
  HelpCircle,
  Shield,
  ClipboardList
} from "lucide-react";
import ImageUpload from "@/admin/components/common/ImageUpload";

interface FormproductProps {
  id: string; // "new" or database ID
  secret: string;
  initialSubcat?: string;
}

// Interfaces matching backend Schema
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface BulletList {
  heading: string;
  points: string[];
}

interface Feature {
  title: string;
  description: string;
}

interface WhatWeDoSection {
  title: string;
  description: string;
  points: string[];
}

interface SecurityFeature {
  title: string;
  description: string;
  icon?: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}

interface ServerPlatform {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  features: string[];
  configCode?: string;
}

interface ToolSection {
  id: string;
  title: string;
  description: string;
  tools: string[];
  serverPlatforms: ServerPlatform[];
}

interface Category {
  slug: string;
  name: string;
}

interface SubCategory {
  slug: string;
  name: string;
  categorySlug: string;
}

export default function Formproduct({ id, secret, initialSubcat }: FormproductProps) {
  const router = useRouter();
  const isNew = id === "new";

  // Data references
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Internal tab state
  const [activeFormTab, setActiveFormTab] = useState<"general" | "media" | "features" | "security" | "process" | "pricing" | "faqs">("general");

  // Main form state (name & slug are auto-derived from title)
  const [categorySlug, setCategorySlug] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [tags, setTags] = useState("");
  const [configCode, setConfigCode] = useState("");

  // Array form states
  const [bulletList, setBulletList] = useState<BulletList>({ heading: "", points: [] });
  const [whatWeDo, setWhatWeDo] = useState<WhatWeDoSection[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [toolSections, setToolSections] = useState<Array<{
    id: string;
    title: string;
    description: string;
    tools: string;
    configName: string;
    configFeatures: string[];
    configCode: string;
  }>>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Fetch reference categories and subcategories
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch("/api/manage-services/category"),
          fetch("/api/manage-services/subcat")
        ]);
        const catData = await catRes.json();
        const subData = await subRes.json();

        if (catData.success) {
          setCategories(catData.data);
        }
        if (subData.success) {
          setSubcategories(subData.data);
        }

        // If creating a new product, pre-fill parent selectors
        if (isNew) {
          let initialCat = catData.data?.[0]?.slug || "";
          let initialSub = "";
          
          if (initialSubcat) {
            const matchedSub = subData.data?.find((s: SubCategory) => s.slug === initialSubcat);
            if (matchedSub) {
              initialCat = matchedSub.categorySlug;
              initialSub = matchedSub.slug;
            }
          }
          
          if (!initialSub) {
            const relatedSubs = subData.data?.filter((s: SubCategory) => s.categorySlug === initialCat) || [];
            initialSub = relatedSubs[0]?.slug || "";
          }

          setCategorySlug(initialCat);
          setSubcategorySlug(initialSub);
          
          const finalSubObj = subData.data?.find((s: SubCategory) => s.slug === initialSub);
          if (finalSubObj) {
            setTitle(finalSubObj.name);
          }

          setToolSections([
            {
              id: Date.now().toString(),
              title: "",
              description: "",
              tools: "",
              configName: "",
              configFeatures: [],
              configCode: "",
            }
          ]);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load category/subcategory listings.");
        setLoading(false);
      }
    };

    fetchReferences();
  }, [isNew, initialSubcat]);

  // Load existing product
  useEffect(() => {
    if (isNew) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/manage-services/product/${id}`);
        const data = await res.json();

        if (data.success) {
          const p = data.data;
          setCategorySlug(p.categorySlug || "");
          setSubcategorySlug(p.subcategorySlug || "");
          setTitle(p.title || p.name || "");
          setDescription(p.description || "");
          setImage(p.image || "");
          setHeroImage(p.heroImage || "");
          setTags(p.tags ? p.tags.join(", ") : "");
          setBulletList(p.bulletList || { heading: "", points: [] });
           setFeatures(p.features || []);
          setSecurityFeatures(p.securityFeatures || []);
          setProcessSteps(p.processSteps || []);
          setPricingPlans(p.pricingPlans || []);
          setFaqs(p.faqs || []);
          setWhatWeDo(p.whatWeDo || []);
          setConfigCode(p.configCode || "");

          if (p.toolSections && p.toolSections.length > 0) {
            setToolSections(p.toolSections.map((sec: any, idx: number) => {
              const matchingPlatform = p.serverPlatforms?.[idx] || {};
              return {
                id: sec.id || Date.now().toString() + Math.random().toString(),
                title: sec.title || "",
                description: sec.description || "",
                tools: sec.tools ? sec.tools.join(", ") : "",
                configName: matchingPlatform.name || "",
                configFeatures: matchingPlatform.features || [],
                configCode: matchingPlatform.configCode || "",
              };
            }));
          } else {
            setToolSections([
              {
                id: Date.now().toString() + Math.random().toString(),
                title: p.title || "",
                description: p.description || "",
                tools: p.tags ? p.tags.join(", ") : "",
                configName: "",
                configFeatures: [],
                configCode: p.configCode || "",
              }
            ]);
          }
        } else {
          setError(data.message || "Failed to load product details.");
        }
      } catch (err) {
        setError("An error occurred while loading product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isNew]);

  // Handle category changing (auto update filtered subcategories select)
  const handleCategoryChange = (cat: string) => {
    setCategorySlug(cat);
    const filtered = subcategories.filter((s) => s.categorySlug === cat);
    const firstSub = filtered[0];
    setSubcategorySlug(firstSub?.slug || "");
    if (firstSub) {
      setTitle(firstSub.name);
    } else {
      setTitle("");
    }
  };

  // Handle subcategory changing (auto update title/name)
  const handleSubcategoryChange = (subSlug: string) => {
    setSubcategorySlug(subSlug);
    const selectedSub = subcategories.find((s) => s.slug === subSlug);
    if (selectedSub) {
      setTitle(selectedSub.name);
    }
  };

  // Helper: Slugify
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categorySlug || !subcategorySlug || !title) {
      setError("Please fill out all required general product fields (Product Name, Category, Sub-Category).");
      setActiveFormTab("general");
      return;
    }

    // Validate tool sections
    if (toolSections.length === 0) {
      setError("Please add at least one dynamic tools section.");
      setActiveFormTab("general");
      return;
    }

    for (let i = 0; i < toolSections.length; i++) {
      const sec = toolSections[i];
      if (!sec.title.trim() || !sec.description.trim()) {
        setError(`Please fill out both Hero Title and Main Description for Section ${i + 1}.`);
        setActiveFormTab("general");
        return;
      }
    }

    setSubmitting(true);

    const parsedToolSections = toolSections.map((sec) => ({
      id: sec.id,
      title: sec.title.trim(),
      description: sec.description.trim(),
      tools: sec.tools
        ? sec.tools
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== "")
        : [],
    }));

    const parsedServerPlatforms = toolSections.map((sec, idx) => ({
      id: sec.id,
      name: sec.configName.trim() || `Config Block ${idx + 1}`,
      slug: generateSlug(sec.configName) || `config-block-${idx + 1}`,
      shortDescription: sec.description.trim(),
      features: sec.configFeatures.filter((f) => f.trim() !== ""),
      configCode: sec.configCode,
    }));

    const firstSec = parsedToolSections[0];
    const productPayload = {
      name: title,
      slug: subcategorySlug,
      categorySlug,
      subcategorySlug,
      title: firstSec?.title || title,
      description: firstSec?.description || "",
      image,
      heroImage,
      bulletList: bulletList && bulletList.heading.trim() ? bulletList : undefined,
      features,
      securityFeatures,
      processSteps,
      pricingPlans,
      serverPlatforms: parsedServerPlatforms,
      faqs,
      tags: firstSec?.tools || [],
      whatWeDo,
      configCode: parsedServerPlatforms[0]?.configCode || "",
      toolSections: parsedToolSections
    };

    try {
      const url = isNew ? "/api/manage-services/product" : `/api/manage-services/product/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload)
      });
      const data = await res.json();

      if (data.success) {
        router.push(`/admin/${secret}/manage-services?tab=products`);
      } else {
        setError(data.message || "Failed to save product.");
      }
    } catch (err) {
      setError("Error occurred while submitting the product details.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter subcategories selection list based on selected category
  const filteredSubcategoriesList = subcategories.filter((s) => s.categorySlug === categorySlug);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
        <p className="text-sm font-semibold">Loading product editor assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-purple-900/10 pb-4">
        <button
          onClick={() => router.push(`/admin/${secret}/manage-services?tab=products`)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <h1 className="text-lg font-bold text-white">
          {isNew ? "Add New Product" : `Edit Product: ${title || ""}`}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <MinusCircle className="w-5 h-5 flex-shrink-0 cursor-pointer" onClick={() => setError("")} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main editor structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Tabs on Left */}
        <div className="lg:col-span-1 space-y-1.5 p-2 bg-[#10031d] rounded-xl border border-purple-950/20">
          <button
            onClick={() => setActiveFormTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFormTab === "general"
                ? "bg-[#a356db] text-white shadow-lg"
                : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
            }`}
          >
            <FileText size={16} /> General
          </button>
          <button
            onClick={() => setActiveFormTab("media")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFormTab === "media"
                ? "bg-[#a356db] text-white shadow-lg"
                : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
            }`}
          >
            <ImageIcon size={16} /> Product Media
          </button>
          <button
            onClick={() => setActiveFormTab("features")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFormTab === "features"
                ? "bg-[#a356db] text-white shadow-lg"
                : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
            }`}
          >
            <Layers size={16} /> What We Do
          </button>
          <button
            onClick={() => setActiveFormTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFormTab === "security"
                ? "bg-[#a356db] text-white shadow-lg"
                : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
            }`}
          >
            <Shield size={16} /> Security
          </button>
          <button
            onClick={() => setActiveFormTab("process")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFormTab === "process"
                ? "bg-[#a356db] text-white shadow-lg"
                : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
            }`}
          >
            <ClipboardList size={16} /> Our Process
          </button>
          <button
            onClick={() => setActiveFormTab("pricing")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFormTab === "pricing"
                ? "bg-[#a356db] text-white shadow-lg"
                : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
            }`}
          >
            <DollarSign size={16} /> Plans & Platforms
          </button>
          
          <button
            onClick={() => setActiveFormTab("faqs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeFormTab === "faqs"
                ? "bg-[#a356db] text-white shadow-lg"
                : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
            }`}
          >
            <HelpCircle size={16} /> FAQs
          </button>
        </div>

        {/* Content Sheet on Right */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-[#140624] border border-purple-900/20 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Tab: General */}
            {activeFormTab === "general" && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-base font-bold text-white border-b border-purple-950/20 pb-2">
                  General Product Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <select
                      value={categorySlug}
                      required
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                      Sub-Category *
                    </label>
                    <select
                      value={subcategorySlug}
                      required
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      {filteredSubcategoriesList.length === 0 ? (
                        <option value="">No subcategories in this category</option>
                      ) : (
                        filteredSubcategoriesList.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                

                {/* Dynamic Tool-Divided Sections */}
                <div className="space-y-6 pt-4 border-t border-purple-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Dynamic Sections (Divided by Tools)</h3>
                      <p className="text-xs text-gray-500 mt-1">Each section represents a tab page containing the hero details, tags list, and its configuration specifications.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setToolSections((prev) => [
                          ...prev,
                          {
                            id: Date.now().toString() + Math.random().toString(),
                            title: "",
                            description: "",
                            tools: "",
                            configName: "",
                            configFeatures: [],
                            configCode: "",
                          }
                        ])
                      }
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <PlusCircle size={14} /> Add Section
                    </button>
                  </div>

                  {toolSections.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No sections added yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {toolSections.map((sec, sIdx) => (
                        <div key={sec.id} className="p-5 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-4 relative">
                          <button
                            type="button"
                            onClick={() => setToolSections((prev) => prev.filter((item) => item.id !== sec.id))}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-400 cursor-pointer"
                            title="Remove section"
                          >
                            <MinusCircle size={16} />
                          </button>

                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-950 border border-purple-800 text-purple-400 text-[10px] font-bold flex-shrink-0">
                              {sIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                              {sec.title || `Section ${sIdx + 1}`}
                            </span>
                          </div>

                          {/* Hero Title */}
                          <div>
                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Hero Title *</label>
                            <input
                              type="text"
                              required
                              value={sec.title}
                              onChange={(e) => {
                                const updated = [...toolSections];
                                updated[sIdx].title = e.target.value;
                                setToolSections(updated);
                              }}
                              placeholder="Main headline displayed in product landing page hero"
                              className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white"
                            />
                          </div>

                          {/* Main Description */}
                          <div>
                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Main Description *</label>
                            <textarea
                              required
                              value={sec.description}
                              onChange={(e) => {
                                const updated = [...toolSections];
                                updated[sIdx].description = e.target.value;
                                setToolSections(updated);
                              }}
                              placeholder="Detailed introduction summary of this product stack"
                              rows={3}
                              className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white"
                            />
                          </div>

                          {/* Tools */}
                          <div>
                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Tools (Comma-separated)</label>
                            <input
                              type="text"
                              value={sec.tools}
                              onChange={(e) => {
                                const updated = [...toolSections];
                                updated[sIdx].tools = e.target.value;
                                setToolSections(updated);
                              }}
                              placeholder="e.g. Next.js, Cloud, React, API"
                              className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white"
                            />
                          </div>

                          {/* Inner divider to config block */}
                          <div className="w-full h-px bg-purple-950/20 my-4" />

                          {/* Merged Configuration Block inside same card */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wide">Configuration & Deliverables</h4>

                            {/* Block Heading */}
                            <div>
                              <label className="block text-[11px] text-gray-450 font-semibold uppercase tracking-wider mb-1.5">Block Heading (optional)</label>
                              <input
                                type="text"
                                value={sec.configName}
                                onChange={(e) => {
                                  const updated = [...toolSections];
                                  updated[sIdx].configName = e.target.value;
                                  setToolSections(updated);
                                }}
                                placeholder="e.g. Nginx Configuration Setup"
                                className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white"
                              />
                            </div>

                            {/* List of Points */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Points ({sec.configFeatures.length})</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...toolSections];
                                    updated[sIdx].configFeatures.push("");
                                    setToolSections(updated);
                                  }}
                                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer"
                                >
                                  <PlusCircle size={12} /> Add Point
                                </button>
                              </div>
                              {sec.configFeatures.length === 0 ? (
                                <p className="text-[11px] text-gray-650 italic">No points yet. Click Add Point.</p>
                              ) : (
                                sec.configFeatures.map((feat, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      required
                                      value={feat}
                                      onChange={(e) => {
                                        const updated = [...toolSections];
                                        updated[sIdx].configFeatures[fIdx] = e.target.value;
                                        setToolSections(updated);
                                      }}
                                      placeholder={`Point ${fIdx + 1}`}
                                      className="flex-1 px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...toolSections];
                                        updated[sIdx].configFeatures = updated[sIdx].configFeatures.filter((_, i) => i !== fIdx);
                                        setToolSections(updated);
                                      }}
                                      className="text-red-500 hover:text-red-400 cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Code Block Snippet */}
                            <div>
                              <label className="block text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1.5">Code Block Snippet (optional)</label>
                              <textarea
                                value={sec.configCode}
                                onChange={(e) => {
                                  const updated = [...toolSections];
                                  updated[sIdx].configCode = e.target.value;
                                  setToolSections(updated);
                                }}
                                placeholder="e.g. server { listen 80; }"
                                rows={6}
                                className="w-full px-3 py-2 bg-[#05010a] border border-purple-900/20 rounded-lg text-xs font-mono text-green-300"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Media */}
            {activeFormTab === "media" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-base font-bold text-white border-b border-purple-950/20 pb-2">
                  Product Image Assets
                </h2>

                <ImageUpload
                  value={image}
                  onChange={setImage}
                  folder="products"
                  secret={secret}
                  label="Thumbnail / Secondary Illustration Image"
                />

                <ImageUpload
                  value={heroImage}
                  onChange={setHeroImage}
                  folder="products"
                  secret={secret}
                  label="Hero Graphics / Main Illustration Image"
                />
              </div>
            )}

            {/* Tab: What We Do */}
            {activeFormTab === "features" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-purple-950/20 pb-2">
                  <h2 className="text-base font-bold text-white">What We Do</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setWhatWeDo((prev) => [
                        ...prev,
                        { title: "", description: "", points: [] }
                      ])
                    }
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add Section
                  </button>
                </div>

                {whatWeDo.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-600 border border-dashed border-purple-950/30 rounded-xl">
                    <Layers size={28} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No sections yet</p>
                    <p className="text-xs mt-1">Click &quot;Add Section&quot; to create your first &quot;What We Do&quot; entry.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {whatWeDo.map((section, sIdx) => (
                      <div
                        key={sIdx}
                        className="relative p-5 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-4"
                      >
                        {/* Remove section */}
                        <button
                          type="button"
                          onClick={() =>
                            setWhatWeDo((prev) => prev.filter((_, i) => i !== sIdx))
                          }
                          className="absolute top-3 right-3 text-red-500 hover:text-red-400 cursor-pointer"
                          title="Remove section"
                        >
                          <MinusCircle size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-950 border border-purple-800 text-purple-400 text-[10px] font-bold flex-shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Section {sIdx + 1}</span>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Title</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const updated = [...whatWeDo];
                              updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                              setWhatWeDo(updated);
                            }}
                            placeholder="e.g. Custom Infrastructure Design"
                            className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Description</label>
                          <textarea
                            value={section.description}
                            onChange={(e) => {
                              const updated = [...whatWeDo];
                              updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                              setWhatWeDo(updated);
                            }}
                            rows={3}
                            placeholder="Brief description of what this section covers..."
                            className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Points ({section.points.length})</label>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...whatWeDo];
                                updated[sIdx] = { ...updated[sIdx], points: [...updated[sIdx].points, ""] };
                                setWhatWeDo(updated);
                              }}
                              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <PlusCircle size={13} /> Add Point
                            </button>
                          </div>

                          {section.points.length === 0 ? (
                            <p className="text-xs text-gray-700 italic">No points yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {section.points.map((pt, pIdx) => (
                                <div key={pIdx} className="flex items-center gap-2">
                                  <span className="text-purple-500 text-xs flex-shrink-0">•</span>
                                  <input
                                    type="text"
                                    value={pt}
                                    onChange={(e) => {
                                      const updated = [...whatWeDo];
                                      const pts = [...updated[sIdx].points];
                                      pts[pIdx] = e.target.value;
                                      updated[sIdx] = { ...updated[sIdx], points: pts };
                                      setWhatWeDo(updated);
                                    }}
                                    placeholder={`Point ${pIdx + 1}`}
                                    className="flex-1 px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...whatWeDo];
                                      const pts = updated[sIdx].points.filter((_, i) => i !== pIdx);
                                      updated[sIdx] = { ...updated[sIdx], points: pts };
                                      setWhatWeDo(updated);
                                    }}
                                    className="text-red-500 hover:text-red-400 cursor-pointer flex-shrink-0"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Security */}
            {activeFormTab === "security" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-purple-950/20 pb-2">
                  <h2 className="text-base font-bold text-white">Security Details</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setSecurityFeatures((prev) => [
                        ...prev,
                        { title: "", description: "" }
                      ])
                    }
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add Feature
                  </button>
                </div>

                {securityFeatures.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-600 border border-dashed border-purple-950/30 rounded-xl">
                    <Shield size={28} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No security features yet</p>
                    <p className="text-xs mt-1">Click &quot;Add Feature&quot; to create your first security specification.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {securityFeatures.map((sec, idx) => (
                      <div
                        key={idx}
                        className="relative p-5 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-4"
                      >
                        {/* Remove feature */}
                        <button
                          type="button"
                          onClick={() =>
                            setSecurityFeatures((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-3 right-3 text-red-500 hover:text-red-400 cursor-pointer"
                          title="Remove feature"
                        >
                          <MinusCircle size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-950 border border-purple-800 text-purple-400 text-[10px] font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Feature {idx + 1}</span>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Title</label>
                          <input
                            type="text"
                            required
                            value={sec.title}
                            onChange={(e) => {
                              const updated = [...securityFeatures];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setSecurityFeatures(updated);
                            }}
                            placeholder="e.g. End-to-End Encryption"
                            className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Description</label>
                          <textarea
                            required
                            value={sec.description}
                            onChange={(e) => {
                              const updated = [...securityFeatures];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setSecurityFeatures(updated);
                            }}
                            rows={3}
                            placeholder="Describe the security details and mechanisms..."
                            className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Our Process */}
            {activeFormTab === "process" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-purple-950/20 pb-2">
                  <h2 className="text-base font-bold text-white">Our Process Steps</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setProcessSteps((prev) => [
                        ...prev,
                        { step: prev.length + 1, title: "", description: "" }
                      ])
                    }
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add Step
                  </button>
                </div>

                {processSteps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-600 border border-dashed border-purple-950/30 rounded-xl">
                    <ClipboardList size={28} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No process steps yet</p>
                    <p className="text-xs mt-1">Click &quot;Add Step&quot; to build your process timeline.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {processSteps.map((stepItem, idx) => (
                      <div
                        key={idx}
                        className="relative p-5 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-4"
                      >
                        {/* Remove step */}
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = processSteps.filter((_, i) => i !== idx);
                            // Re-index steps
                            const reindexed = filtered.map((item, i) => ({
                              ...item,
                              step: i + 1
                            }));
                            setProcessSteps(reindexed);
                          }}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-400 cursor-pointer"
                          title="Remove step"
                        >
                          <MinusCircle size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-950 border border-purple-800 text-purple-400 text-[10px] font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Step {idx + 1}</span>
                        </div>

                        {/* Heading */}
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Heading</label>
                          <input
                            type="text"
                            required
                            value={stepItem.title}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setProcessSteps(updated);
                            }}
                            placeholder="e.g. Discovery & Consultation"
                            className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Description</label>
                          <textarea
                            required
                            value={stepItem.description}
                            onChange={(e) => {
                              const updated = [...processSteps];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setProcessSteps(updated);
                            }}
                            rows={3}
                            placeholder="Describe what occurs in this step..."
                            className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}            {/* Tab: Pricing & Platforms */}
            {activeFormTab === "pricing" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-purple-950/20 pb-2">
                  <h2 className="text-base font-bold text-white">
                    Plans & Platforms
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      setPricingPlans((prev) => [
                        ...prev,
                        {
                          id: Date.now().toString() + Math.random().toString(),
                          name: "",
                          description: "",
                          price: "",
                          period: "",
                          features: [],
                          highlighted: false
                        }
                      ])
                    }
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add Plan Tier
                  </button>
                </div>

                {pricingPlans.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-600 border border-dashed border-purple-950/30 rounded-xl">
                    <DollarSign size={28} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No plans added yet</p>
                    <p className="text-xs mt-1">Click &quot;Add Plan Tier&quot; to create a pricing/coverage card.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pricingPlans.map((plan, idx) => (
                      <div key={plan.id} className="bg-[#0d0315] p-5 rounded-xl border border-purple-950/40 relative space-y-4">
                        <button
                          type="button"
                          onClick={() => setPricingPlans((prev) => prev.filter((p) => p.id !== plan.id))}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-400 cursor-pointer"
                          title="Remove plan"
                        >
                          <MinusCircle size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-950 border border-purple-800 text-purple-400 text-[10px] font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Plan {idx + 1}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Title</label>
                            <input
                              type="text"
                              required
                              value={plan.name}
                              onChange={(e) => {
                                const updated = [...pricingPlans];
                                updated[idx].name = e.target.value;
                                setPricingPlans(updated);
                              }}
                              placeholder="e.g. Standard Tier"
                              className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Title Tag Line</label>
                            <input
                              type="text"
                              required
                              value={plan.description}
                              onChange={(e) => {
                                const updated = [...pricingPlans];
                                updated[idx].description = e.target.value;
                                setPricingPlans(updated);
                              }}
                              placeholder="e.g. Perfect for small teams and startups"
                              className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Price (with variants)</label>
                            <input
                              type="text"
                              required
                              value={plan.price}
                              onChange={(e) => {
                                const updated = [...pricingPlans];
                                updated[idx].price = e.target.value;
                                setPricingPlans(updated);
                              }}
                              placeholder="e.g. 1000 / month"
                              className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Price Tag Line</label>
                            <input
                              type="text"
                              value={plan.period || ""}
                              onChange={(e) => {
                                const updated = [...pricingPlans];
                                updated[idx].period = e.target.value;
                                setPricingPlans(updated);
                              }}
                              placeholder="e.g. Billed annually"
                              className="w-full px-3 py-2.5 bg-[#0f0418] border border-purple-900/25 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        {/* Plan Features (Dynamic Listing) */}
                        <div className="space-y-2 pt-2 border-t border-purple-900/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Features Listing ({plan.features.length})</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...pricingPlans];
                                updated[idx].features.push("");
                                setPricingPlans(updated);
                              }}
                              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <PlusCircle size={13} /> Add Feature
                            </button>
                          </div>
                          {plan.features.length === 0 ? (
                            <p className="text-xs text-gray-700 italic">No features added yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {plan.features.map((feat, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    required
                                    value={feat}
                                    onChange={(e) => {
                                      const updated = [...pricingPlans];
                                      updated[idx].features[fIdx] = e.target.value;
                                      setPricingPlans(updated);
                                    }}
                                    placeholder={`Feature ${fIdx + 1}`}
                                    className="flex-1 px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...pricingPlans];
                                      updated[idx].features = updated[idx].features.filter((_, i) => i !== fIdx);
                                      setPricingPlans(updated);
                                    }}
                                    className="text-red-500 hover:text-red-400 cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: FAQs */}
            {activeFormTab === "faqs" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-base font-bold text-white border-b border-purple-950/20 pb-2">
                  Frequently Asked Questions (FAQ)
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Product FAQs ({faqs.length})</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFaqs((prev) => [
                          ...prev,
                          { id: Date.now().toString(), question: "", answer: "" }
                        ])
                      }
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <PlusCircle size={14} /> Add FAQ Card
                    </button>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={faq.id} className="bg-[#140620] p-4 rounded-xl border border-purple-900/20 relative space-y-3">
                        <button
                          type="button"
                          onClick={() => setFaqs((prev) => prev.filter((f) => f.id !== faq.id))}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-450 cursor-pointer"
                        >
                          <MinusCircle size={16} />
                        </button>

                        <input
                          type="text"
                          required
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].question = e.target.value;
                            setFaqs(updated);
                          }}
                          placeholder="What is this service delivery timeline?"
                          className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/25 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <textarea
                          required
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...faqs];
                            updated[idx].answer = e.target.value;
                            setFaqs(updated);
                          }}
                          placeholder="Standard timeline is 4-6 weeks."
                          rows={3}
                          className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/25 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Form Action Buttons */}
          <div className="flex justify-end gap-3 p-6 bg-[#10031d] rounded-2xl border border-purple-900/20">
            <button
              type="button"
              onClick={() => router.push(`/admin/${secret}/manage-services?tab=products`)}
              className="px-5 py-3 rounded-xl border border-purple-900/30 hover:bg-purple-900/10 text-sm font-semibold text-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-all shadow-lg shadow-purple-500/10 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isNew ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
