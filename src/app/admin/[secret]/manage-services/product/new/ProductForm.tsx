"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2, Plus, Trash2, ChevronDown, ChevronUp, ShieldAlert, Save,
  ArrowLeft, Package, Code2, Shield, GitBranch, DollarSign, HelpCircle,
  Zap, Star, Upload,
} from "lucide-react";
import type {
  ProductSections,
  WhatWeDoCard,
  SecurityCard,
  ProcessCard,
  PriceCard,
  FaqItem,
  CodeBlock,
} from "@/models/services/Product";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ICategory { _id: string; name: string; slug: string }
interface ISubcategory { _id: string; name: string; slug: string; category: string }

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  category: string;
  subcategory: string;
  sections: ProductSections;
  order: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

const defaultSections = (): ProductSections => ({
  productDetails: { title: "", description: "", points: [], codeBlocks: [] },
});

// ─── Section Panel Wrapper ──────────────────────────────────────────────────

function SectionPanel({
  icon: Icon, title, badge, children, collapsible = true,
}: {
  icon: React.ElementType;
  title: string;
  badge?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-purple-900/30 rounded-2xl overflow-hidden bg-[#0f0418]/40">
      <button
        type="button"
        onClick={() => collapsible && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 bg-[#1c0f2b]/40 ${collapsible ? "cursor-pointer hover:bg-[#1c0f2b]/60" : "cursor-default"} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#a356db]" />
          <span className="text-sm font-bold text-white">{title}</span>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-700/30">
              {badge}
            </span>
          )}
        </div>
        {collapsible && (open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Reusable input components ───────────────────────────────────────────────

const inputCls = "w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light";
const textareaCls = `${inputCls} resize-none`;
const labelCls = "text-white text-xs font-medium";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function PointsEditor({ points, onChange }: { points: string[]; onChange: (p: string[]) => void }) {
  return (
    <div className="space-y-2">
      {points.map((pt, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text" value={pt}
            onChange={(e) => { const n = [...points]; n[i] = e.target.value; onChange(n); }}
            placeholder={`Point ${i + 1}`}
            className={`flex-1 ${inputCls}`}
          />
          <button type="button" onClick={() => onChange(points.filter((_, j) => j !== i))}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer flex-shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...points, ""])}
        className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer transition-colors">
        <Plus className="w-3.5 h-3.5" /> Add Point
      </button>
    </div>
  );
}

// ─── Main Form ───────────────────────────────────────────────────────────────

export default function ProductForm({ initialData, productId }: {
  initialData?: ProductFormData;
  productId?: string;
}) {
  const params = useParams();
  const router = useRouter();
  const secret = params.secret as string;

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<ISubcategory[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [manualSlug, setManualSlug] = useState(!!productId);

  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      name: "", slug: "", description: "", image: "",
      isActive: true, category: "", subcategory: "",
      sections: defaultSections(),
      order: 1,
    }
  );

  const [uploadMode, setUploadMode] = useState<"upload" | "url">(
    initialData?.image && initialData.image.startsWith("http") ? "url" : "upload"
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError("");
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("subfolder", "products");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();
      if (result.success && result.imageUrl) {
        setForm((p) => ({ ...p, image: result.imageUrl }));
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch {
      setError("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Enable/disable optional sections
  const [enabledSections, setEnabledSections] = useState({
    whatWeDo: !!initialData?.sections.whatWeDo,
    security: !!initialData?.sections.security,
    process: !!initialData?.sections.process,
    pricing: !!initialData?.sections.pricing,
    faq: !!initialData?.sections.faq,
  });

  // ── Fetch categories & subcategories ───────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const [catRes, subRes] = await Promise.all([
        fetch("/api/services/categories"),
        fetch("/api/services/subcategories"),
      ]);
      const [catData, subData] = await Promise.all([catRes.json(), subRes.json()]);
      if (catData.success) setCategories(catData.data);
      if (subData.success) setSubcategories(subData.data);
    };
    load();
  }, []);

  // Filter subcategories when category changes
  useEffect(() => {
    if (!form.category) { setFilteredSubs([]); return; }
    const subs = subcategories.filter(
      (s) => (typeof s.category === "object" ? (s.category as any)._id : s.category) === form.category
    );
    setFilteredSubs(subs);
    if (!subs.find((s) => s._id === form.subcategory)) {
      setForm((p) => ({ ...p, subcategory: subs[0]?._id || "" }));
    }
  }, [form.category, subcategories]);

  // ── Slug auto-gen ─────────────────────────────────────────────────────
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => {
      const updated = { ...prev, name };
      if (!manualSlug) {
        updated.slug = name.toLowerCase().trim()
          .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSlug(true);
    const slug = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm((p) => ({ ...p, slug }));
  };

  // ── Section toggle ────────────────────────────────────────────────────
  const toggleSection = (key: keyof typeof enabledSections) => {
    setEnabledSections((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key]) {
        // Remove the section from form when disabled
        setForm((f) => {
          const s = { ...f.sections };
          delete s[key as keyof ProductSections];
          return { ...f, sections: s };
        });
      } else {
        // Initialize section with defaults
        setForm((f) => {
          const s = { ...f.sections };
          if (key === "whatWeDo" && !s.whatWeDo)
            s.whatWeDo = { sectionHeading: "", sectionDescription: "", cards: [] };
          if (key === "security" && !s.security)
            s.security = { sectionHeading: "", sectionDescription: "", cards: [] };
          if (key === "process" && !s.process)
            s.process = { sectionHeading: "", sectionDescription: "", cards: [] };
          if (key === "pricing" && !s.pricing)
            s.pricing = { sectionHeading: "", sectionDescription: "", cards: [] };
          if (key === "faq" && !s.faq)
            s.faq = { sectionHeading: "", sectionDescription: "", items: [] };
          return { ...f, sections: s };
        });
      }
      return next;
    });
  };

  // ── Section field updaters ────────────────────────────────────────────

  const setSection = <K extends keyof ProductSections>(key: K, val: ProductSections[K]) => {
    setForm((p) => ({ ...p, sections: { ...p.sections, [key]: val } }));
  };

  // ─── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const url = productId ? `/api/services/products/${productId}` : "/api/services/products";
    const method = productId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        router.push(`/admin/${secret}/manage-services`);
      } else {
        setError(result.message || "Failed to save service");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────

  const pd = form.sections.productDetails;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button type="button" onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 transition-colors cursor-pointer mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Services
            </button>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-[#a356db]" />
              {productId ? "Edit Service" : "New Service"}
            </h1>
            <p className="text-xs text-gray-400 font-light">
              Fill in the core details and add content sections as needed.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Core Details ────────────────────────────────────────────── */}
        <SectionPanel icon={Package} title="Core Details" badge="Required" collapsible={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Service Name *">
              <input type="text" required value={form.name} onChange={handleNameChange}
                placeholder="e.g. Kubernetes Management" className={inputCls} />
            </Field>
            <Field label="URL Slug *">
              <input type="text" required value={form.slug} onChange={handleSlugChange}
                placeholder="e.g. kubernetes-management" className={`${inputCls} font-mono`} />
            </Field>
          </div>
          <Field label="Short Description *">
            <textarea required rows={2} value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="One-line summary shown in listing cards..." className={textareaCls} />
          </Field>
          <Field label="Cover Image">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMode("upload")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    uploadMode === "upload"
                      ? "bg-purple-600/20 border-purple-500 text-white"
                      : "border-purple-900/30 text-gray-400 hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    uploadMode === "url"
                      ? "bg-purple-600/20 border-purple-500 text-white"
                      : "border-purple-900/30 text-gray-400 hover:text-white"
                  }`}
                >
                  URL Link
                </button>
              </div>

              {uploadMode === "upload" ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="relative flex items-center justify-center border border-dashed border-purple-900/40 rounded-xl p-4 bg-[#1c0f2b]/20 hover:bg-[#1c0f2b]/40 transition-colors">
                    {isUploading ? (
                      <div className="flex items-center gap-2 text-xs text-purple-400 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-1.5 cursor-pointer text-xs text-gray-400 hover:text-white font-light">
                        <span className="font-semibold text-purple-400 hover:underline flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Click to upload
                        </span>
                        <span>SVG, PNG, JPG or GIF (max. 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                  {form.image && (
                    <div className="flex items-center gap-3 p-2 bg-[#1c0f2b]/40 border border-purple-900/20 rounded-xl">
                      <img src={form.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-purple-900/30" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400 truncate font-light">Uploaded Image URL:</p>
                        <p className="text-xs text-purple-300 font-mono truncate">{form.image}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, image: "" }))}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://... or /path/to/image.png" className={inputCls}
                />
              )}
            </div>
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category *">
              <select required value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className={`${inputCls} cursor-pointer`}>
                <option value="" disabled className="bg-[#150a21]">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id} className="bg-[#150a21]">{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Subcategory *">
              <select required value={form.subcategory}
                onChange={(e) => setForm((p) => ({ ...p, subcategory: e.target.value }))}
                disabled={!form.category || filteredSubs.length === 0}
                className={`${inputCls} cursor-pointer disabled:opacity-50`}>
                <option value="" disabled className="bg-[#150a21]">
                  {form.category ? (filteredSubs.length === 0 ? "No subcategories" : "Select subcategory") : "Pick a category first"}
                </option>
                {filteredSubs.map((s) => (
                  <option key={s._id} value={s._id} className="bg-[#150a21]">{s.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Display Order">
            <input type="number" required min={0} value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
              placeholder="e.g. 1" className={inputCls} />
          </Field>
          <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
            <input type="checkbox" checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500" />
            Publish immediately (Active)
          </label>
        </SectionPanel>

        {/* ── Product Details Section ──────────────────────────────────── */}
        <SectionPanel icon={Zap} title="Product Details" badge="Required">
          <Field label="Hero Title *">
            <input type="text" required value={pd.title}
              onChange={(e) => setSection("productDetails", { ...pd, title: e.target.value })}
              placeholder="e.g. Enterprise Kubernetes Cluster Management" className={inputCls} />
          </Field>
          <Field label="Hero Description *">
            <textarea required rows={3} value={pd.description}
              onChange={(e) => setSection("productDetails", { ...pd, description: e.target.value })}
              placeholder="Detailed description for the hero section..." className={textareaCls} />
          </Field>
          <Field label="Bullet Points">
            <PointsEditor points={pd.points ?? []}
              onChange={(points) => setSection("productDetails", { ...pd, points })} />
          </Field>
          {/* Code Blocks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Code Blocks</label>
              <button type="button"
                onClick={() => setSection("productDetails", {
                  ...pd,
                  codeBlocks: [...(pd.codeBlocks ?? []), { language: "bash", code: "", filename: "" }],
                })}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Code Block
              </button>
            </div>
            {(pd.codeBlocks ?? []).map((cb, i) => (
              <div key={i} className="border border-purple-900/20 rounded-xl p-4 space-y-3 bg-[#0f0418]/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">Block {i + 1}</span>
                  <button type="button"
                    onClick={() => setSection("productDetails", {
                      ...pd,
                      codeBlocks: pd.codeBlocks?.filter((_, j) => j !== i),
                    })}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Language">
                    <input type="text" value={cb.language}
                      onChange={(e) => {
                        const blocks = [...(pd.codeBlocks ?? [])];
                        blocks[i] = { ...blocks[i], language: e.target.value };
                        setSection("productDetails", { ...pd, codeBlocks: blocks });
                      }}
                      placeholder="bash / ts / json" className={inputCls} />
                  </Field>
                  <Field label="Filename (optional)">
                    <input type="text" value={cb.filename ?? ""}
                      onChange={(e) => {
                        const blocks = [...(pd.codeBlocks ?? [])];
                        blocks[i] = { ...blocks[i], filename: e.target.value };
                        setSection("productDetails", { ...pd, codeBlocks: blocks });
                      }}
                      placeholder="e.g. deploy.sh" className={inputCls} />
                  </Field>
                </div>
                <Field label="Code *">
                  <textarea rows={4} value={cb.code}
                    onChange={(e) => {
                      const blocks = [...(pd.codeBlocks ?? [])];
                      blocks[i] = { ...blocks[i], code: e.target.value };
                      setSection("productDetails", { ...pd, codeBlocks: blocks });
                    }}
                    placeholder="Paste your code here..."
                    className="w-full bg-[#0a0312] border border-purple-900/30 rounded-xl p-3 text-purple-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-mono leading-relaxed resize-none"
                  />
                </Field>
              </div>
            ))}
          </div>
        </SectionPanel>

        {/* ── Optional Sections Toggle Bar ─────────────────────────────── */}
        <div className="bg-[#140624] rounded-2xl border border-purple-900/20 p-5">
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4">Optional Sections — Toggle to Enable</p>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { key: "whatWeDo", label: "What We Do", icon: Zap },
                { key: "security", label: "Security", icon: Shield },
                { key: "process", label: "Process", icon: GitBranch },
                { key: "pricing", label: "Pricing", icon: DollarSign },
                { key: "faq", label: "FAQ", icon: HelpCircle },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" onClick={() => toggleSection(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  enabledSections[key]
                    ? "bg-[#a356db]/20 border-[#a356db]/40 text-white"
                    : "bg-transparent border-purple-900/20 text-gray-500 hover:text-gray-300 hover:border-purple-900/40"
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
                {enabledSections[key] && <span className="ml-1 text-[#a356db]">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── What We Do ───────────────────────────────────────────────── */}
        {enabledSections.whatWeDo && form.sections.whatWeDo && (
          <SectionPanel icon={Zap} title="What We Do">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Section Heading *">
                <input type="text" value={form.sections.whatWeDo.sectionHeading}
                  onChange={(e) => setSection("whatWeDo", { ...form.sections.whatWeDo!, sectionHeading: e.target.value })}
                  placeholder="e.g. What We Deliver" className={inputCls} />
              </Field>
              <Field label="Section Description *">
                <input type="text" value={form.sections.whatWeDo.sectionDescription}
                  onChange={(e) => setSection("whatWeDo", { ...form.sections.whatWeDo!, sectionDescription: e.target.value })}
                  placeholder="Short tagline..." className={inputCls} />
              </Field>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelCls}>Cards</label>
                <button type="button"
                  onClick={() => setSection("whatWeDo", {
                    ...form.sections.whatWeDo!,
                    cards: [...form.sections.whatWeDo!.cards, { icon: "Server", title: "", description: "", points: [] }],
                  })}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Card
                </button>
              </div>
              {form.sections.whatWeDo.cards.map((card, i) => (
                <div key={i} className="border border-purple-900/20 rounded-xl p-4 space-y-3 bg-[#0f0418]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">Card {i + 1}</span>
                    <button type="button"
                      onClick={() => setSection("whatWeDo", {
                        ...form.sections.whatWeDo!,
                        cards: form.sections.whatWeDo!.cards.filter((_, j) => j !== i),
                      })}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="Icon (Lucide name)">
                      <input type="text" value={card.icon}
                        onChange={(e) => {
                          const cards = [...form.sections.whatWeDo!.cards];
                          cards[i] = { ...cards[i], icon: e.target.value };
                          setSection("whatWeDo", { ...form.sections.whatWeDo!, cards });
                        }}
                        placeholder="e.g. Server" className={inputCls} />
                    </Field>
                    <Field label="Title">
                      <input type="text" value={card.title}
                        onChange={(e) => {
                          const cards = [...form.sections.whatWeDo!.cards];
                          cards[i] = { ...cards[i], title: e.target.value };
                          setSection("whatWeDo", { ...form.sections.whatWeDo!, cards });
                        }}
                        placeholder="Card title" className={inputCls} />
                    </Field>
                    <Field label="Description">
                      <input type="text" value={card.description}
                        onChange={(e) => {
                          const cards = [...form.sections.whatWeDo!.cards];
                          cards[i] = { ...cards[i], description: e.target.value };
                          setSection("whatWeDo", { ...form.sections.whatWeDo!, cards });
                        }}
                        placeholder="Short description" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Points">
                    <PointsEditor points={card.points ?? []}
                      onChange={(points) => {
                        const cards = [...form.sections.whatWeDo!.cards];
                        cards[i] = { ...cards[i], points };
                        setSection("whatWeDo", { ...form.sections.whatWeDo!, cards });
                      }} />
                  </Field>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}

        {/* ── Security ─────────────────────────────────────────────────── */}
        {enabledSections.security && form.sections.security && (
          <SectionPanel icon={Shield} title="Security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Section Heading">
                <input type="text" value={form.sections.security.sectionHeading}
                  onChange={(e) => setSection("security", { ...form.sections.security!, sectionHeading: e.target.value })}
                  placeholder="e.g. Enterprise-Grade Security" className={inputCls} />
              </Field>
              <Field label="Section Description">
                <input type="text" value={form.sections.security.sectionDescription}
                  onChange={(e) => setSection("security", { ...form.sections.security!, sectionDescription: e.target.value })}
                  placeholder="Tagline..." className={inputCls} />
              </Field>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelCls}>Security Cards</label>
                <button type="button"
                  onClick={() => setSection("security", {
                    ...form.sections.security!,
                    cards: [...form.sections.security!.cards, { icon: "Shield", title: "", description: "" }],
                  })}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Card
                </button>
              </div>
              {form.sections.security.cards.map((card, i) => (
                <div key={i} className="border border-purple-900/20 rounded-xl p-4 bg-[#0f0418]/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">Card {i + 1}</span>
                    <button type="button"
                      onClick={() => setSection("security", {
                        ...form.sections.security!,
                        cards: form.sections.security!.cards.filter((_, j) => j !== i),
                      })}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(["icon", "title", "description"] as const).map((field) => (
                      <Field key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
                        <input type="text" value={card[field]}
                          onChange={(e) => {
                            const cards = [...form.sections.security!.cards];
                            cards[i] = { ...cards[i], [field]: e.target.value };
                            setSection("security", { ...form.sections.security!, cards });
                          }}
                          placeholder={field === "icon" ? "e.g. Lock" : `Card ${field}`} className={inputCls} />
                      </Field>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}

        {/* ── Process ──────────────────────────────────────────────────── */}
        {enabledSections.process && form.sections.process && (
          <SectionPanel icon={GitBranch} title="Process">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Section Heading">
                <input type="text" value={form.sections.process.sectionHeading}
                  onChange={(e) => setSection("process", { ...form.sections.process!, sectionHeading: e.target.value })}
                  placeholder="e.g. Our Delivery Process" className={inputCls} />
              </Field>
              <Field label="Section Description">
                <input type="text" value={form.sections.process.sectionDescription}
                  onChange={(e) => setSection("process", { ...form.sections.process!, sectionDescription: e.target.value })}
                  placeholder="Tagline..." className={inputCls} />
              </Field>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelCls}>Steps</label>
                <button type="button"
                  onClick={() => setSection("process", {
                    ...form.sections.process!,
                    cards: [...form.sections.process!.cards, { title: "", description: "" }],
                  })}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>
              {form.sections.process.cards.map((card, i) => (
                <div key={i} className="border border-purple-900/20 rounded-xl p-4 bg-[#0f0418]/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                      Step {i + 1}
                    </span>
                    <button type="button"
                      onClick={() => setSection("process", {
                        ...form.sections.process!,
                        cards: form.sections.process!.cards.filter((_, j) => j !== i),
                      })}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="Title">
                      <input type="text" value={card.title}
                        onChange={(e) => {
                          const cards = [...form.sections.process!.cards];
                          cards[i] = { ...cards[i], title: e.target.value };
                          setSection("process", { ...form.sections.process!, cards });
                        }}
                        placeholder="e.g. Discovery & Planning" className={inputCls} />
                    </Field>
                    <Field label="Description">
                      <input type="text" value={card.description}
                        onChange={(e) => {
                          const cards = [...form.sections.process!.cards];
                          cards[i] = { ...cards[i], description: e.target.value };
                          setSection("process", { ...form.sections.process!, cards });
                        }}
                        placeholder="Brief explanation..." className={inputCls} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}

        {/* ── Pricing ──────────────────────────────────────────────────── */}
        {enabledSections.pricing && form.sections.pricing && (
          <SectionPanel icon={DollarSign} title="Pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Section Heading">
                <input type="text" value={form.sections.pricing.sectionHeading}
                  onChange={(e) => setSection("pricing", { ...form.sections.pricing!, sectionHeading: e.target.value })}
                  placeholder="e.g. Simple, Transparent Pricing" className={inputCls} />
              </Field>
              <Field label="Section Description">
                <input type="text" value={form.sections.pricing.sectionDescription}
                  onChange={(e) => setSection("pricing", { ...form.sections.pricing!, sectionDescription: e.target.value })}
                  placeholder="Tagline..." className={inputCls} />
              </Field>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={labelCls}>Pricing Plans</label>
                <button type="button"
                  onClick={() => setSection("pricing", {
                    ...form.sections.pricing!,
                    cards: [...form.sections.pricing!.cards, {
                      title: "", tagline: "", price: 0, billingCycle: "/month",
                      points: [], highlighted: false, ctaLabel: "Get Started", ctaHref: "",
                    }],
                  })}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Plan
                </button>
              </div>
              {form.sections.pricing.cards.map((plan, i) => (
                <div key={i} className="border border-purple-900/20 rounded-xl p-4 space-y-4 bg-[#0f0418]/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">Plan {i + 1}</span>
                      {plan.highlighted && <Star className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <button type="button"
                      onClick={() => setSection("pricing", {
                        ...form.sections.pricing!,
                        cards: form.sections.pricing!.cards.filter((_, j) => j !== i),
                      })}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Field label="Plan Name">
                      <input type="text" value={plan.title}
                        onChange={(e) => {
                          const cards = [...form.sections.pricing!.cards];
                          cards[i] = { ...cards[i], title: e.target.value };
                          setSection("pricing", { ...form.sections.pricing!, cards });
                        }}
                        placeholder="e.g. Starter" className={inputCls} />
                    </Field>
                    <Field label="Tagline">
                      <input type="text" value={plan.tagline}
                        onChange={(e) => {
                          const cards = [...form.sections.pricing!.cards];
                          cards[i] = { ...cards[i], tagline: e.target.value };
                          setSection("pricing", { ...form.sections.pricing!, cards });
                        }}
                        placeholder="e.g. For teams" className={inputCls} />
                    </Field>
                    <Field label="Price ($)">
                      <input type="number" value={plan.price}
                        onChange={(e) => {
                          const cards = [...form.sections.pricing!.cards];
                          cards[i] = { ...cards[i], price: Number(e.target.value) };
                          setSection("pricing", { ...form.sections.pricing!, cards });
                        }}
                        className={inputCls} />
                    </Field>
                    <Field label="Billing Cycle">
                      <input type="text" value={plan.billingCycle}
                        onChange={(e) => {
                          const cards = [...form.sections.pricing!.cards];
                          cards[i] = { ...cards[i], billingCycle: e.target.value };
                          setSection("pricing", { ...form.sections.pricing!, cards });
                        }}
                        placeholder="/month" className={inputCls} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="Price Tagline">
                      <input type="text" value={plan.priceTagline ?? ""}
                        onChange={(e) => {
                          const cards = [...form.sections.pricing!.cards];
                          cards[i] = { ...cards[i], priceTagline: e.target.value };
                          setSection("pricing", { ...form.sections.pricing!, cards });
                        }}
                        placeholder="e.g. Billed annually" className={inputCls} />
                    </Field>
                    <Field label="CTA Label">
                      <input type="text" value={plan.ctaLabel ?? ""}
                        onChange={(e) => {
                          const cards = [...form.sections.pricing!.cards];
                          cards[i] = { ...cards[i], ctaLabel: e.target.value };
                          setSection("pricing", { ...form.sections.pricing!, cards });
                        }}
                        placeholder="Get Started" className={inputCls} />
                    </Field>
                    <Field label="CTA Href">
                      <input type="text" value={plan.ctaHref ?? ""}
                        onChange={(e) => {
                          const cards = [...form.sections.pricing!.cards];
                          cards[i] = { ...cards[i], ctaHref: e.target.value };
                          setSection("pricing", { ...form.sections.pricing!, cards });
                        }}
                        placeholder="/contact?plan=starter" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Feature Points">
                    <PointsEditor points={plan.points}
                      onChange={(points) => {
                        const cards = [...form.sections.pricing!.cards];
                        cards[i] = { ...cards[i], points };
                        setSection("pricing", { ...form.sections.pricing!, cards });
                      }} />
                  </Field>
                  <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
                    <input type="checkbox" checked={plan.highlighted ?? false}
                      onChange={(e) => {
                        const cards = [...form.sections.pricing!.cards];
                        cards[i] = { ...cards[i], highlighted: e.target.checked };
                        setSection("pricing", { ...form.sections.pricing!, cards });
                      }}
                      className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500" />
                    Featured / Recommended Plan
                  </label>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        {enabledSections.faq && form.sections.faq && (
          <SectionPanel icon={HelpCircle} title="FAQ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Section Heading">
                <input type="text" value={form.sections.faq.sectionHeading}
                  onChange={(e) => setSection("faq", { ...form.sections.faq!, sectionHeading: e.target.value })}
                  placeholder="e.g. Frequently Asked Questions" className={inputCls} />
              </Field>
              <Field label="Section Description">
                <input type="text" value={form.sections.faq.sectionDescription}
                  onChange={(e) => setSection("faq", { ...form.sections.faq!, sectionDescription: e.target.value })}
                  placeholder="Tagline..." className={inputCls} />
              </Field>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelCls}>FAQ Items</label>
                <button type="button"
                  onClick={() => setSection("faq", {
                    ...form.sections.faq!,
                    items: [...form.sections.faq!.items, { question: "", answer: "" }],
                  })}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>
              {form.sections.faq.items.map((item, i) => (
                <div key={i} className="border border-purple-900/20 rounded-xl p-4 space-y-3 bg-[#0f0418]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold">Q{i + 1}</span>
                    <button type="button"
                      onClick={() => setSection("faq", {
                        ...form.sections.faq!,
                        items: form.sections.faq!.items.filter((_, j) => j !== i),
                      })}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Field label="Question">
                    <input type="text" value={item.question}
                      onChange={(e) => {
                        const items = [...form.sections.faq!.items];
                        items[i] = { ...items[i], question: e.target.value };
                        setSection("faq", { ...form.sections.faq!, items });
                      }}
                      placeholder="e.g. How long does setup take?" className={inputCls} />
                  </Field>
                  <Field label="Answer">
                    <textarea rows={3} value={item.answer}
                      onChange={(e) => {
                        const items = [...form.sections.faq!.items];
                        items[i] = { ...items[i], answer: e.target.value };
                        setSection("faq", { ...form.sections.faq!, items });
                      }}
                      placeholder="Detailed answer..." className={textareaCls} />
                  </Field>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}

        {/* ── Submit ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-4 pt-2 pb-8">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white border border-purple-900/30 hover:border-purple-600 transition-all cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white transition-all shadow-lg shadow-purple-500/20 cursor-pointer disabled:opacity-60 flex items-center gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {productId ? "Save Changes" : "Publish Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
