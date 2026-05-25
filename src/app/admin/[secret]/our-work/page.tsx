"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ShieldAlert,
  X,
  Layers,
  Eye,
  EyeOff,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import ImageUpload from "@/admin/components/common/ImageUpload";

interface ResultRow {
  metric: string;
  before: string;
  after: string;
}

interface CaseStudyItem {
  _id?: string;
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
  results: ResultRow[];
  milestones: string[];
  isActive: boolean;
}

const CATEGORIES = ["Software Engineering", "Cloud & Security", "AI & Automation"];

const emptyForm: CaseStudyItem = {
  id: "",
  title: "",
  client: "",
  category: "Software Engineering",
  subCategory: "",
  description: "",
  challenge: "",
  solution: "",
  impact: "",
  impactLabel: "",
  image: "",
  techStack: [],
  results: [{ metric: "", before: "", after: "" }],
  milestones: [""],
  isActive: true,
};

export default function OurWorkAdminPage() {
  const params = useParams();
  const secret = params.secret as string;

  const [studies, setStudies] = useState<CaseStudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CaseStudyItem>(emptyForm);
  const [manualSlug, setManualSlug] = useState(false);
  // techStack as comma-separated string in the input
  const [techStackInput, setTechStackInput] = useState("");

  const fetchStudies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/our-work?all=true");
      const result = await res.json();
      if (result.success) {
        setStudies(result.data);
      } else {
        setError(result.message || "Failed to fetch case studies");
      }
    } catch {
      setError("An unexpected error occurred while loading case studies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setManualSlug(false);
    setFormData(emptyForm);
    setTechStackInput("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (study: CaseStudyItem) => {
    setEditingId(study._id || study.id);
    setManualSlug(true);
    setFormData({
      id: study.id,
      title: study.title,
      client: study.client,
      category: study.category,
      subCategory: study.subCategory,
      description: study.description,
      challenge: study.challenge,
      solution: study.solution,
      impact: study.impact,
      impactLabel: study.impactLabel,
      image: study.image,
      techStack: study.techStack || [],
      results: study.results && study.results.length > 0
        ? [...study.results]
        : [{ metric: "", before: "", after: "" }],
      milestones: study.milestones && study.milestones.length > 0
        ? [...study.milestones]
        : [""],
      isActive: study.isActive,
    });
    setTechStackInput((study.techStack || []).join(", "));
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setError("");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title };
      if (!manualSlug && !editingId) {
        updated.id = title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSlug(true);
    const slug = e.target.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, id: slug }));
  };

  // Results rows
  const handleResultChange = (index: number, field: keyof ResultRow, value: string) => {
    setFormData((prev) => {
      const results = [...prev.results];
      results[index] = { ...results[index], [field]: value };
      return { ...prev, results };
    });
  };

  const addResultRow = () =>
    setFormData((prev) => ({
      ...prev,
      results: [...prev.results, { metric: "", before: "", after: "" }],
    }));

  const removeResultRow = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index),
    }));

  // Milestones
  const handleMilestoneChange = (index: number, value: string) => {
    setFormData((prev) => {
      const milestones = [...prev.milestones];
      milestones[index] = value;
      return { ...prev, milestones };
    });
  };

  const addMilestone = () =>
    setFormData((prev) => ({ ...prev, milestones: [...prev.milestones, ""] }));

  const removeMilestone = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));

  const toggleActiveStatus = async (study: CaseStudyItem) => {
    try {
      const res = await fetch(`/api/our-work/${study._id || study.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...study, isActive: !study.isActive }),
      });
      const result = await res.json();
      if (result.success) {
        fetchStudies();
      } else {
        setError(result.message || "Failed to toggle visibility");
      }
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/our-work/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchStudies();
      } else {
        setError(result.message || "Failed to delete case study");
      }
    } catch {
      setError("An unexpected error occurred while deleting the case study");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const cleanMilestones = formData.milestones.map((m) => m.trim()).filter(Boolean);
    const cleanResults = formData.results.filter(
      (r) => r.metric.trim() && r.before.trim() && r.after.trim()
    );
    const techStackArr = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!formData.id || !formData.title || !formData.client || !formData.image) {
      setError("Title, Client, Slug, and Image are required.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      techStack: techStackArr,
      results: cleanResults,
      milestones: cleanMilestones,
    };

    try {
      const url = editingId ? `/api/our-work/${editingId}` : "/api/our-work";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        closeModal();
        fetchStudies();
      } else {
        setError(result.message || "Failed to save case study");
      }
    } catch {
      setError("An unexpected error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = studies.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-8 h-8 text-[#a356db]" />
              Our Work Manager
            </h1>
            <p className="text-sm text-gray-300 max-w-xl font-light">
              Add, manage and publish case studies and portfolio projects visible on the Our Work page.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Case Study
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Case Studies
            <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
              {studies.length}
            </span>
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-light"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Layers className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-light">No case studies found. Click "Add Case Study" to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Impact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filtered.map((study) => (
                  <tr key={study._id || study.id} className="hover:bg-purple-900/5 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg relative overflow-hidden bg-purple-950/20 border border-purple-900/30 flex-shrink-0">
                          {study.image ? (
                            <img src={study.image} alt={study.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Layers className="w-4 h-4 text-purple-400/40" />
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-white truncate">{study.title}</p>
                          <p className="text-xs text-purple-300 font-mono mt-0.5">/{study.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{study.client}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-lg bg-purple-950/30 text-purple-300 border border-purple-900/20">
                        {study.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-white font-mono">{study.impact}</p>
                        <p className="text-[10px] text-gray-500">{study.impactLabel}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActiveStatus(study)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 border cursor-pointer ${
                          study.isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {study.isActive ? (
                          <><Eye className="w-3 h-3" /> Active</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Hidden</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(study)}
                          className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(study._id || study.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c0314] rounded-2xl border border-purple-900/30 flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-900/20 bg-[#0e0416] flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingId ? "Edit Case Study" : "Create New Case Study"}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Fill in the project details, metrics, tech stack and milestones.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-950/30 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 flex-shrink-0">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0c0314]">

                {/* Row 1: Title + Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Project Title *</label>
                    <input
                      type="text" required value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. PulseFit Global Ecosystem"
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">URL Slug *</label>
                    <input
                      type="text" required value={formData.id}
                      onChange={handleSlugChange}
                      placeholder="e.g. pulsefit-global"
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light font-mono"
                    />
                  </div>
                </div>

                {/* Row 2: Client + Category + SubCategory */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Client Name *</label>
                    <input
                      type="text" required value={formData.client}
                      onChange={(e) => setFormData((p) => ({ ...p, client: e.target.value }))}
                      placeholder="e.g. PulseFit Global Inc."
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#150a21] text-white">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Sub-Category *</label>
                    <input
                      type="text" required value={formData.subCategory}
                      onChange={(e) => setFormData((p) => ({ ...p, subCategory: e.target.value }))}
                      placeholder="e.g. App Solutions"
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Project Description *</label>
                  <textarea
                    required rows={2} value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Brief overview of the project and what was built..."
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light leading-relaxed"
                  />
                </div>

                {/* Challenge + Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">The Challenge *</label>
                    <textarea
                      required rows={4} value={formData.challenge}
                      onChange={(e) => setFormData((p) => ({ ...p, challenge: e.target.value }))}
                      placeholder="What problem did the client face?"
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">The Solution *</label>
                    <textarea
                      required rows={4} value={formData.solution}
                      onChange={(e) => setFormData((p) => ({ ...p, solution: e.target.value }))}
                      placeholder="How did enteropia solve it?"
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light leading-relaxed"
                    />
                  </div>
                </div>

                {/* Impact Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Impact Headline *</label>
                    <input
                      type="text" required value={formData.impact}
                      onChange={(e) => setFormData((p) => ({ ...p, impact: e.target.value }))}
                      placeholder="e.g. +180% Conversions"
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Impact Label *</label>
                    <input
                      type="text" required value={formData.impactLabel}
                      onChange={(e) => setFormData((p) => ({ ...p, impactLabel: e.target.value }))}
                      placeholder="e.g. Cart Conversions Increase"
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Tech Stack (comma-separated)</label>
                  <input
                    type="text" value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="e.g. React Native SDK, Flutter, Firebase Backend"
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                  />
                </div>

                {/* Cover Image */}
                <div className="border-t border-purple-900/20 pt-5">
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                    folder="our-work"
                    secret={secret}
                    label="Cover Image *"
                  />
                </div>

                {/* Results Metrics Table */}
                <div className="border-t border-purple-900/20 pt-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-widest">
                      Performance Metrics (Before / After)
                    </h4>
                    <button
                      type="button" onClick={addResultRow}
                      className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Row
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.results.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                        <input
                          type="text" value={row.metric}
                          onChange={(e) => handleResultChange(idx, "metric", e.target.value)}
                          placeholder="Metric"
                          className="bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-light"
                        />
                        <input
                          type="text" value={row.before}
                          onChange={(e) => handleResultChange(idx, "before", e.target.value)}
                          placeholder="Before"
                          className="bg-[#1c0f2b]/50 border border-red-900/30 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-xs font-light"
                        />
                        <input
                          type="text" value={row.after}
                          onChange={(e) => handleResultChange(idx, "after", e.target.value)}
                          placeholder="After"
                          className="bg-[#1c0f2b]/50 border border-green-900/30 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-xs font-light"
                        />
                        <button
                          type="button" onClick={() => removeResultRow(idx)}
                          disabled={formData.results.length <= 1}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div className="border-t border-purple-900/20 pt-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-widest">
                      Deployment Milestones
                    </h4>
                    <button
                      type="button" onClick={addMilestone}
                      className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Milestone
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-purple-500/80 font-mono w-5">
                          {idx + 1}.
                        </span>
                        <input
                          type="text" value={milestone}
                          onChange={(e) => handleMilestoneChange(idx, e.target.value)}
                          placeholder="e.g. Audit existing infrastructure and identify gaps"
                          className="flex-1 bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                        />
                        <button
                          type="button" onClick={() => removeMilestone(idx)}
                          disabled={formData.milestones.length <= 1}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active toggle */}
                <div className="border-t border-purple-900/20 pt-5">
                  <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500"
                    />
                    Make case study active (Visible on Our Work page)
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-6 border-t border-purple-900/20 bg-[#0e0416] flex-shrink-0">
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 py-2.5 px-4 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-[#a356db] hover:bg-[#b26be3] text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Create Case Study"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
